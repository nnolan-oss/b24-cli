import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGet, mockSet, mockClear } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockSet: vi.fn(),
  mockClear: vi.fn(),
}));

vi.mock("conf", () => ({
  default: class {
    get = mockGet;
    set = mockSet;
    clear = mockClear;
  },
}));

const {
  getWebhookUrl,
  setWebhookUrl,
  getUserId,
  setUserId,
  isAuthenticated,
  clearConfig,
} = await import("../utils/config.js");

describe("config", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("setWebhookUrl", () => {
    it("adds trailing slash when missing", () => {
      setWebhookUrl("https://example.bitrix24.com/rest/1/abc");
      expect(mockSet).toHaveBeenCalledWith(
        "webhookUrl",
        "https://example.bitrix24.com/rest/1/abc/",
      );
    });

    it("does not duplicate trailing slash", () => {
      setWebhookUrl("https://example.bitrix24.com/rest/1/abc/");
      expect(mockSet).toHaveBeenCalledWith(
        "webhookUrl",
        "https://example.bitrix24.com/rest/1/abc/",
      );
    });
  });

  describe("getWebhookUrl", () => {
    it("returns stored url", () => {
      mockGet.mockReturnValue("https://example.bitrix24.com/rest/1/abc/");
      expect(getWebhookUrl()).toBe("https://example.bitrix24.com/rest/1/abc/");
    });
  });

  describe("isAuthenticated", () => {
    it("returns true when webhook url is set", () => {
      mockGet.mockReturnValue("https://example.bitrix24.com/rest/1/abc/");
      expect(isAuthenticated()).toBe(true);
    });

    it("returns false when webhook url is empty", () => {
      mockGet.mockReturnValue("");
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe("getUserId / setUserId", () => {
    it("sets userId", () => {
      setUserId("42");
      expect(mockSet).toHaveBeenCalledWith("userId", "42");
    });

    it("gets userId", () => {
      mockGet.mockReturnValue("42");
      expect(getUserId()).toBe("42");
    });
  });

  describe("clearConfig", () => {
    it("clears all stored config", () => {
      clearConfig();
      expect(mockClear).toHaveBeenCalledOnce();
    });
  });
});
