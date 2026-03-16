import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }));

vi.mock("conf", () => ({
  default: class {
    get = mockGet;
    set = vi.fn();
    clear = vi.fn();
  },
}));

const { t, getStatusLabel, getPriorityLabel, getAvailableLocales } =
  await import("../i18n/index.js");

describe("i18n", () => {
  beforeEach(() => {
    // Default to English
    mockGet.mockReturnValue("en");
  });

  describe("t()", () => {
    it("returns translation for a known key", () => {
      expect(t("app.name")).toBe("B24 CLI");
    });

    it("falls back to the key when translation is missing", () => {
      expect(t("nonexistent.key" as any)).toBe("nonexistent.key");
    });

    it("returns English when locale is unknown", () => {
      mockGet.mockReturnValue("xx");
      expect(t("app.name")).toBe("B24 CLI");
    });
  });

  describe("getStatusLabel()", () => {
    it.each([
      ["1", "New"],
      ["2", "Pending"],
      ["3", "In Progress"],
      ["4", "Awaiting control"],
      ["5", "Completed"],
      ["6", "Deferred"],
    ])("maps status %s to %s", (code, label) => {
      expect(getStatusLabel(code)).toBe(label);
    });

    it("returns the raw code for unknown status", () => {
      expect(getStatusLabel("99")).toBe("99");
    });
  });

  describe("getPriorityLabel()", () => {
    it.each([
      ["0", "Low"],
      ["1", "Medium"],
      ["2", "High"],
    ])("maps priority %s to %s", (code, label) => {
      expect(getPriorityLabel(code)).toBe(label);
    });

    it("returns the raw code for unknown priority", () => {
      expect(getPriorityLabel("9")).toBe("9");
    });
  });

  describe("getAvailableLocales()", () => {
    it("includes built-in locales", () => {
      const locales = getAvailableLocales();
      expect(locales).toContain("en");
      expect(locales).toContain("ru");
      expect(locales).toContain("uz");
    });
  });
});
