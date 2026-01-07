import { describe, expect, it } from "vitest";
import { generateQuestSuggestions } from "../lib/quest";

describe("generateQuestSuggestions", () => {
  it("includes next step for now category", () => {
    const suggestions = generateQuestSuggestions("now", "最初の1行を書く");
    expect(suggestions[0]).toBe("最初の1行を書く");
    expect(suggestions.length).toBeLessThanOrEqual(3);
  });

  it("returns wait templates for wait category", () => {
    const suggestions = generateQuestSuggestions("wait");
    expect(suggestions).toContain("次に確認する日時を決める（例：明日18:00）");
    expect(suggestions.length).toBeLessThanOrEqual(3);
  });
});
