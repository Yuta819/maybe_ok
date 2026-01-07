import { useMemo } from "react";
import type { Anxiety } from "../lib/types";
import { isToday } from "../lib/time";
import { pickTitle, questCopy } from "../lib/quest";

type Props = {
  anxiety: Anxiety;
  now: Date;
  expanded: boolean;
  onUpdate: (updated: Anxiety) => void;
  onCollapse: () => void;
  showToast: (message: string) => void;
};

export default function QuestSection({
  anxiety,
  now,
  expanded,
  onUpdate,
  onCollapse,
  showToast,
}: Props) {
  const quest = anxiety.quest;

  const chosen = quest?.chosen ?? quest?.suggested[0];
  const remainingSeconds = useMemo(() => {
    if (!quest?.startedAt) return null;
    const started = new Date(quest.startedAt).getTime();
    const diff = 60 - Math.floor((now.getTime() - started) / 1000);
    return diff > 0 ? diff : 0;
  }, [quest?.startedAt, now]);

  const completedToday = isToday(quest?.completedAt, now);
  const canStart = !quest?.startedAt && !completedToday;
  const canComplete = quest?.startedAt && !quest?.completedAt;

  if (!quest || !expanded) {
    return null;
  }

  const handleChoose = (value: string) => {
    const updated: Anxiety = {
      ...anxiety,
      quest: {
        ...quest,
        chosen: value,
      },
    };
    onUpdate(updated);
  };

  const handleStart = () => {
    if (!chosen) return;
    const updated: Anxiety = {
      ...anxiety,
      quest: {
        ...quest,
        chosen,
        startedAt: new Date().toISOString(),
      },
    };
    onUpdate(updated);
  };

  const handleComplete = () => {
    if (!quest?.startedAt) return;
    const title = pickTitle();
    const updated: Anxiety = {
      ...anxiety,
      quest: {
        ...quest,
        chosen,
        completedAt: new Date().toISOString(),
        titleAwarded: title,
      },
    };
    onUpdate(updated);
    showToast(["達成。脳内が2%静かになった。", "未来に振り回されずに済んだ。"][
      Math.floor(Math.random() * 2)
    ]);
  };

  return (
    <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-700">{questCopy.heading}</p>
        <p className="text-xs text-slate-500">{questCopy.sub}</p>
      </div>

      <div className="mt-3 space-y-2">
        {quest.suggested.map((suggestion) => (
          <label
            key={suggestion}
            className="flex cursor-pointer items-start gap-2 rounded-xl border border-transparent px-2 py-2 transition hover:border-slate-200"
          >
            <input
              type="radio"
              name={`quest-${anxiety.id}`}
              checked={chosen === suggestion}
              onChange={() => handleChoose(suggestion)}
              className="mt-1 h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-300"
            />
            <span className="text-slate-700">{suggestion}</span>
          </label>
        ))}
      </div>

      {quest?.startedAt ? (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs text-slate-600">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          <span>
            {remainingSeconds !== null
              ? `残り ${remainingSeconds} 秒`
              : "タイマー準備中"}
          </span>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {canStart ? (
          <button
            type="button"
            onClick={handleStart}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            実行する（60秒）
          </button>
        ) : null}
        <button
          type="button"
          onClick={onCollapse}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 transition hover:bg-white"
        >
          今は見送る
        </button>
        {canComplete ? (
          <button
            type="button"
            onClick={handleComplete}
            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
          >
            完了。えらい。
          </button>
        ) : null}
      </div>

      {quest?.completedAt ? (
        <div className="mt-4 space-y-1 text-xs text-slate-600">
          <p>
            称号：<span className="font-semibold">{quest.titleAwarded}</span>
          </p>
          <p>※称号に効能はありません</p>
        </div>
      ) : null}

      {completedToday ? (
        <p className="mt-3 text-xs text-emerald-700">
          今日はもう達成済み。落ち着き優先でいこう。
        </p>
      ) : null}
    </div>
  );
}
