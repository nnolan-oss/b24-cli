import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockPost, mockGet } = vi.hoisted(() => ({
  mockPost: vi.fn(),
  mockGet: vi.fn(),
}));

vi.mock("conf", () => ({
  default: class {
    get = mockGet;
    set = vi.fn();
    clear = vi.fn();
  },
}));

vi.mock("axios", () => ({
  default: {
    create: vi.fn().mockReturnValue({ post: mockPost }),
  },
}));

const { callMethod, resetClient } = await import("../api/client.js");

describe("callMethod", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetClient();
    mockGet.mockReturnValue("https://example.bitrix24.com/rest/1/abc/");
  });

  it("returns data.result on success", async () => {
    mockPost.mockResolvedValue({ data: { result: [{ id: "1" }] } });
    const result = await callMethod("tasks.task.list", {});
    expect(result).toEqual([{ id: "1" }]);
  });

  it("returns full data when result key is absent", async () => {
    mockPost.mockResolvedValue({ data: { custom: "value" } });
    const result = await callMethod("some.method");
    expect(result).toEqual({ custom: "value" });
  });

  it("throws when API returns an error", async () => {
    mockPost.mockResolvedValue({
      data: { error: "ACCESS_DENIED", error_description: "No access" },
    });
    await expect(callMethod("tasks.task.list")).rejects.toThrow(
      "Bitrix24: No access",
    );
  });

  it("throws with error code when description is absent", async () => {
    mockPost.mockResolvedValue({
      data: { error: "UNKNOWN_ERROR" },
    });
    await expect(callMethod("tasks.task.list")).rejects.toThrow(
      "Bitrix24: UNKNOWN_ERROR",
    );
  });

  it("throws when webhook url is not configured", async () => {
    mockGet.mockReturnValue("");
    await expect(callMethod("tasks.task.list")).rejects.toThrow();
  });

  it("posts to the correct endpoint", async () => {
    mockPost.mockResolvedValue({ data: { result: true } });
    await callMethod("task.commentitem.add", { TASKID: 1 });
    expect(mockPost).toHaveBeenCalledWith("task.commentitem.add.json", {
      TASKID: 1,
    });
  });
});
