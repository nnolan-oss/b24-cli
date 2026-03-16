import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/client.js", () => ({
  callMethod: vi.fn(),
}));

// conf mock required because tasks.ts -> i18n -> config -> conf
vi.mock("conf", () => ({
  default: class {
    get = vi.fn().mockReturnValue("en");
    set = vi.fn();
    clear = vi.fn();
  },
}));

const { callMethod } = await import("../api/client.js");
const {
  getComments,
  addComment,
  getMyTasks,
  getElapsedTime,
} = await import("../api/tasks.js");

const mockCall = vi.mocked(callMethod);

describe("getComments", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("with chatId (new API)", () => {
    it("calls im.dialog.messages.get with correct DIALOG_ID", async () => {
      mockCall.mockResolvedValue({ messages: [], users: [] });
      await getComments("100", "1234");
      expect(mockCall).toHaveBeenCalledWith("im.dialog.messages.get", {
        DIALOG_ID: "chat1234",
        FIRST_ID: 0,
        LIMIT: 50,
      });
    });

    it("maps messages to TaskComment shape", async () => {
      mockCall.mockResolvedValue({
        messages: [
          { id: 1, author_id: 42, text: "Hello", date: "2024-01-01", params: {} },
        ],
        users: [{ id: 42, first_name: "John", last_name: "Doe" }],
      });

      const result = await getComments("100", "1234");
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        ID: "1",
        AUTHOR_ID: "42",
        AUTHOR_NAME: "John Doe",
        POST_MESSAGE: "Hello",
        POST_DATE: "2024-01-01",
      });
    });

    it("filters out system messages (params.SYSTEM = Y)", async () => {
      mockCall.mockResolvedValue({
        messages: [
          { id: 1, author_id: 42, text: "Normal", date: "2024-01-01", params: {} },
          { id: 2, author_id: 42, text: "System", date: "2024-01-01", params: { SYSTEM: "Y" } },
        ],
        users: [{ id: 42, first_name: "Alice", last_name: "" }],
      });

      const result = await getComments("100", "1234");
      expect(result).toHaveLength(1);
      expect(result[0].POST_MESSAGE).toBe("Normal");
    });

    it("filters out messages with author_id <= 0", async () => {
      mockCall.mockResolvedValue({
        messages: [
          { id: 1, author_id: 0, text: "Bot message", date: "2024-01-01", params: {} },
          { id: 2, author_id: 5, text: "User message", date: "2024-01-01", params: {} },
        ],
        users: [{ id: 5, first_name: "Bob", last_name: "Smith" }],
      });

      const result = await getComments("100", "1234");
      expect(result).toHaveLength(1);
      expect(result[0].AUTHOR_NAME).toBe("Bob Smith");
    });

    it("falls back to User #ID when user not in users list", async () => {
      mockCall.mockResolvedValue({
        messages: [{ id: 1, author_id: 99, text: "Hi", date: "2024-01-01", params: {} }],
        users: [],
      });

      const result = await getComments("100", "1234");
      expect(result[0].AUTHOR_NAME).toBe("User #99");
    });

    it("handles object-shaped messages response", async () => {
      mockCall.mockResolvedValue({
        messages: { "0": { id: 1, author_id: 7, text: "Msg", date: "2024-01-01", params: {} } },
        users: [{ id: 7, first_name: "Sara", last_name: "" }],
      });

      const result = await getComments("100", "1234");
      expect(result).toHaveLength(1);
      expect(result[0].AUTHOR_NAME).toBe("Sara");
    });
  });

  describe("without chatId (legacy API)", () => {
    it("calls task.commentitem.getlist", async () => {
      mockCall.mockResolvedValue([]);
      await getComments("100");
      expect(mockCall).toHaveBeenCalledWith("task.commentitem.getlist", {
        TASKID: 100,
        ORDER: { POST_DATE: "asc" },
      });
    });

    it("returns array result directly", async () => {
      const comments = [{ ID: "1", AUTHOR_NAME: "Test", POST_MESSAGE: "Hi", POST_DATE: "2024-01-01", AUTHOR_ID: "1" }];
      mockCall.mockResolvedValue(comments);
      const result = await getComments("100");
      expect(result).toEqual(comments);
    });

    it("handles object-shaped legacy response", async () => {
      mockCall.mockResolvedValue({ "0": { ID: "1", POST_MESSAGE: "Hello" } });
      const result = await getComments("100");
      expect(result).toHaveLength(1);
    });

    it("returns empty array when result is empty", async () => {
      mockCall.mockResolvedValue([]);
      const result = await getComments("100");
      expect(result).toEqual([]);
    });
  });
});

describe("addComment", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls task.commentitem.add with correct params", async () => {
    mockCall.mockResolvedValue(42);
    await addComment("100", "Test comment");
    expect(mockCall).toHaveBeenCalledWith("task.commentitem.add", {
      TASKID: 100,
      FIELDS: { POST_MESSAGE: "Test comment" },
    });
  });

  it("returns the new comment id", async () => {
    mockCall.mockResolvedValue(55);
    const result = await addComment("100", "Hello");
    expect(result).toBe(55);
  });
});

describe("getMyTasks", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns tasks and total", async () => {
    mockCall.mockResolvedValue({ tasks: [{ id: "1" }], total: 1 });
    const result = await getMyTasks({ userId: "5" });
    expect(result.tasks).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it("filters by RESPONSIBLE_ID", async () => {
    mockCall.mockResolvedValue({ tasks: [], total: 0 });
    await getMyTasks({ userId: "7" });
    expect(mockCall).toHaveBeenCalledWith(
      "tasks.task.list",
      expect.objectContaining({
        filter: expect.objectContaining({ RESPONSIBLE_ID: "7" }),
      }),
    );
  });

  it("returns empty defaults when response is empty", async () => {
    mockCall.mockResolvedValue({});
    const result = await getMyTasks();
    expect(result.tasks).toEqual([]);
    expect(result.total).toBe(0);
  });
});

describe("getElapsedTime", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls task.elapseditem.getlist", async () => {
    mockCall.mockResolvedValue([]);
    await getElapsedTime("100");
    expect(mockCall).toHaveBeenCalledWith("task.elapseditem.getlist", {
      TASKID: "100",
    });
  });

  it("returns array of elapsed items", async () => {
    const items = [{ ID: "1", SECONDS: "3600", COMMENT_TEXT: "" }];
    mockCall.mockResolvedValue(items);
    const result = await getElapsedTime("100");
    expect(result).toEqual(items);
  });
});
