import type { Category } from "./types";

const nowTemplates = [
  "“最初の1行だけ”書く",
  "関係者に“確認だけ”送る",
  "必要情報を1つだけ集める（検索1回）",
  "やることを箇条書きで3つにする",
];

const waitTemplates = [
  "次に確認する日時を決める（例：明日18:00）",
  "今できる準備を1つだけ書く",
  "状況メモを30秒で残す（後で自分が助かる）",
  "深呼吸3回（3秒ガイド）",
];

const notTemplates = [
  "起きた事実だけを1行で書く",
  "証拠がある？をYes/Noで答える",
  "もし起きても“最小の対処”を1つ書く",
  "水を一口飲む（身体を現在に戻す）",
];

const titles = [
  "タブ閉じ勇者",
  "1分の錬金術師",
  "現実に帰還した人",
  "確認だけ送った偉人",
  "深呼吸の民",
];

export function generateQuestSuggestions(category: Category, nextStep?: string): string[] {
  const suggestions = new Set<string>();
  if (category === "now") {
    if (nextStep && nextStep.trim()) {
      suggestions.add(nextStep.trim());
    }
    nowTemplates.forEach((item) => suggestions.add(item));
  }
  if (category === "wait") {
    waitTemplates.forEach((item) => suggestions.add(item));
  }
  if (category === "not") {
    notTemplates.forEach((item) => suggestions.add(item));
  }
  return Array.from(suggestions).slice(0, 3);
}

export function pickTitle(randomSeed = Math.random()): string {
  const index = Math.floor(randomSeed * titles.length);
  return titles[index] ?? titles[0];
}

export const questCopy = {
  heading: "1分で片づくやつ、出しといた。",
  sub: "やる気は後から来る。先に指。",
};
