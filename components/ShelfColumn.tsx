import type { Anxiety, CategoryMeta } from "../lib/types";
import AnxietyCard from "./AnxietyCard";

type Props = {
  meta: CategoryMeta;
  items: Anxiety[];
  now: Date;
  expandedIds: Set<string>;
  onUpdate: (updated: Anxiety) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onExpand: (id: string) => void;
  onCollapse: (id: string) => void;
  showToast: (message: string) => void;
};

export default function ShelfColumn({
  meta,
  items,
  now,
  expandedIds,
  onUpdate,
  onDelete,
  onArchive,
  onExpand,
  onCollapse,
  showToast,
}: Props) {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-transparent bg-white/60 p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{meta.title}</h2>
            <p className="text-xs text-slate-500">{meta.description}</p>
          </div>
          <span className="stamp rounded-xl px-3 py-1 text-[10px] font-bold">{meta.stamp}</span>
        </div>
        <p className="mt-2 text-xs text-slate-400">{meta.note}</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <AnxietyCard
            key={item.id}
            item={item}
            now={now}
            expanded={expandedIds.has(item.id)}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onArchive={onArchive}
            onExpand={onExpand}
            onCollapse={onCollapse}
            showToast={showToast}
          />
        ))}
      </div>
    </section>
  );
}
