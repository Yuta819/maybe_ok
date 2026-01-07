import { useMemo, useState } from "react";
import type { Anxiety, Category } from "../lib/types";
import { categories } from "../lib/constants";
import { formatRelativeTime, isToday } from "../lib/time";
import QuestSection from "./QuestSection";
import { generateQuestSuggestions } from "../lib/quest";

const categoryLabels: Record<Category, string> = {
  now: "今すぐできる",
  wait: "待つしかない",
  not: "そもそも起きてない",
};

type Props = {
  item: Anxiety;
  now: Date;
  expanded: boolean;
  onUpdate: (updated: Anxiety) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onExpand: (id: string) => void;
  onCollapse: (id: string) => void;
  showToast: (message: string) => void;
};

export default function AnxietyCard({
  item,
  now,
  expanded,
  onUpdate,
  onDelete,
  onArchive,
  onExpand,
  onCollapse,
  showToast,
}: Props) {
  const meta = useMemo(() => categories.find((cat) => cat.id === item.category), [item.category]);
  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState(item.text);
  const [draftCategory, setDraftCategory] = useState<Category>(item.category);
  const [draftNextStep, setDraftNextStep] = useState(item.nextStep ?? "");

  const handleSave = () => {
    const updatedCategory = draftCategory;
    const quest = generateQuestSuggestions(updatedCategory, draftNextStep);
    const updated: Anxiety = {
      ...item,
      text: draftText.trim() || item.text,
      category: updatedCategory,
      nextStep: updatedCategory === "now" && draftNextStep.trim() ? draftNextStep.trim() : undefined,
      quest: {
        suggested: quest,
        chosen: quest[0],
      },
    };
    onUpdate(updated);
    setEditing(false);
  };

  const tagVisible = isToday(item.quest?.completedAt, now);

  return (
    <div
      className={`rounded-2xl border p-4 shadow-card transition ${
        meta?.colorClass ?? "bg-white border-slate-200"
      } motion-safe:animate-fadeInUp`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs text-slate-500">{formatRelativeTime(item.createdAt, now)}</p>
          {editing ? (
            <textarea
              value={draftText}
              onChange={(event) => setDraftText(event.target.value)}
              rows={3}
              className="w-full rounded-xl border-slate-200 bg-white px-2 py-2 text-sm"
            />
          ) : (
            <p className="text-sm text-slate-800">{item.text}</p>
          )}
        </div>
        <span className="stamp rounded-xl px-3 py-1 text-[10px] font-bold">{meta?.stamp}</span>
      </div>

      {editing ? (
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryLabels).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setDraftCategory(id as Category)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  draftCategory === id
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {draftCategory === "now" ? (
            <input
              value={draftNextStep}
              onChange={(event) => setDraftNextStep(event.target.value)}
              placeholder="次の一手（1個）"
              className="w-full rounded-xl border-slate-200 bg-white px-2 py-2 text-sm"
            />
          ) : null}
        </div>
      ) : null}

      {item.nextStep && !editing ? (
        <p className="mt-2 text-xs text-slate-500">次の一手：{item.nextStep}</p>
      ) : null}

      {tagVisible ? (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          今日の1歩
        </div>
      ) : null}

      {item.quest?.titleAwarded ? (
        <p className="mt-2 text-xs text-slate-600">称号：{item.quest.titleAwarded}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {editing ? (
          <>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white"
            >
              保存
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-500"
            >
              取消
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-600"
            >
              編集
            </button>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="rounded-full border border-rose-200 px-3 py-1 text-rose-500"
            >
              削除
            </button>
            <button
              type="button"
              onClick={() => onArchive(item.id)}
              className="rounded-full border border-slate-200 px-3 py-1 text-slate-500"
            >
              アーカイブ
            </button>
            <button
              type="button"
              onClick={() => (expanded ? onCollapse(item.id) : onExpand(item.id))}
              className="rounded-full bg-slate-100 px-3 py-1 text-slate-600"
            >
              {expanded ? "クエストをたたむ" : "クエストを見る"}
            </button>
          </>
        )}
      </div>

      <QuestSection
        anxiety={item}
        now={now}
        expanded={expanded}
        onUpdate={onUpdate}
        onCollapse={() => onCollapse(item.id)}
        showToast={showToast}
      />
    </div>
  );
}
