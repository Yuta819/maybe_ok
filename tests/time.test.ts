import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "../lib/time";

describe("formatRelativeTime", () => {
  it("returns minutes", () => {
    const now = new Date("2024-01-01T00:10:00.000Z");
    const value = formatRelativeTime("2024-01-01T00:05:00.000Z", now);
    expect(value).toBe("5分前");
  });

  it("returns days", () => {
    const now = new Date("2024-01-10T00:00:00.000Z");
    const value = formatRelativeTime("2024-01-08T00:00:00.000Z", now);
    expect(value).toBe("2日前");
  });
});
