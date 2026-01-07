import type { CategoryMeta } from "./types";

export const categories: CategoryMeta[] = [
  {
    id: "now",
    title: "今すぐできる",
    description: "次の一手があるやつ。1個だけでOK。",
    note: "やる気は後から来る。",
    stamp: "行動!!",
    colorClass: "bg-amber-50 border-amber-100",
  },
  {
    id: "wait",
    title: "待つしかない",
    description: "今は操縦できない。待つのも技術。",
    note: "じっとして偉い（本気）",
    stamp: "待機中",
    colorClass: "bg-sky-50 border-sky-100",
  },
  {
    id: "not",
    title: "そもそも起きてない",
    description: "まだ起こってない心配。想像だけ先走り。",
    note: "未来、まだログインしてない。",
    stamp: "未発生",
    colorClass: "bg-slate-50 border-slate-200",
  },
];

export const emptyMessage = "ここは不安の待合室。まだ誰も来てない。平和。";
