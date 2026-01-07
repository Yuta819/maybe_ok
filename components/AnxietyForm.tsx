import { useMemo, useState } from "react";
import type { Category } from "../lib/types";
import { validateAnxiety } from "../lib/validation";

const categoryOptions: { id: Category; label: string }[] = [
  { id: "now", label: "今すぐできる" },
  { id: "wait", label: "待つしかない" },
  { id: "not", label: "そもそも起きてない" },
];

type Props = {
  onSubmit: (payload: { text: string; category: Category; nextStep?: string }) => void;
};

export default function AnxietyForm({ onSubmit }: Props) {
  const [text, setText] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [mode, setMode] = useState<"recommend" | "manual">("recommend");
  const [answerNow, setAnswerNow] = useState<"yes" | "no" | "">("");
  const [answerWait, setAnswerWait] = useState<"yes" | "no" | "">("");
  const [manualCategory, setManualCategory] = useState<Category>("now");
  const [message, setMessage] = useState<string | undefined>();
  const [warning, setWarning] = useState<string | undefined>();

  const recommendedCategory = useMemo<Category>(() => {
    if (answerNow === "yes") return "now";
    if (answerNow === "no" && answerWait === "yes") return "wait";
    return "not";
  }, [answerNow, answerWait]);

  const category = mode === "manual" ? manualCategory : recommendedCategory;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateAnxiety(text);
    setMessage(result.message);
    setWarning(result.warning);
    if (!result.ok) return;

    onSubmit({
      text: text.trim(),
      category,
      nextStep: category === "now" && nextStep.trim() ? nextStep.trim() : undefined,
    });
    setText("");
    setNextStep("");
    setAnswerNow("");
    setAnswerWait("");
    setManualCategory("now");
    setMessage(undefined);
    setWarning(undefined);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-white/80 p-5 shadow-card"
    >
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="anxiety">
          不安をひとこと
        </label>
        <textarea
          id="anxiety"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          placeholder="例：明日の会議で言葉に詰まったらどうしよう"
          className="w-full resize-none rounded-xl border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:ring-slate-300"
        />
        {message ? <p className="text-xs text-rose-500">{message}</p> : null}
        {warning ? <p className="text-xs text-amber-600">{warning}</p> : null}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode("recommend")}
            className={`rounded-full px-3 py-1 font-medium transition ${
              mode === "recommend"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            おすすめ（2問）
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`rounded-full px-3 py-1 font-medium transition ${
              mode === "manual"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            自分で選ぶ
          </button>
        </div>

        {mode === "recommend" ? (
          <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium text-slate-700">Q1: 今すぐ手を動かせる？</p>
              <div className="flex gap-2">
                {[
                  { value: "yes", label: "できる" },
                  { value: "no", label: "今は無理" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAnswerNow(option.value as "yes" | "no")}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      answerNow === option.value
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-slate-700">Q2: 結果待ち・人待ちの要素？</p>
              <div className="flex gap-2">
                {[
                  { value: "yes", label: "ある" },
                  { value: "no", label: "たぶんない" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAnswerWait(option.value as "yes" | "no")}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      answerWait === option.value
                        ? "bg-sky-600 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-500">
              おすすめ棚：<span className="font-medium">{categoryOptions.find((item) => item.id === category)?.label}</span>
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setManualCategory(option.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  manualCategory === option.id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {category === "now" ? (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="next-step">
            今すぐできる「次の一手」（1個だけ）
          </label>
          <input
            id="next-step"
            value={nextStep}
            onChange={(event) => setNextStep(event.target.value)}
            placeholder="例：議題メモに最初の1行を書く"
            className="w-full rounded-xl border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:ring-slate-300"
          />
        </div>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        棚に置く
      </button>
    </form>
  );
}
