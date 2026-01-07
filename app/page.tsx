"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import AnxietyForm from "../components/AnxietyForm";
import SearchFilter from "../components/SearchFilter";
import ShelfColumn from "../components/ShelfColumn";
import Toast from "../components/Toast";
import { categories, emptyMessage } from "../lib/constants";
import type { Anxiety, Category } from "../lib/types";
import { storage } from "../lib/storage";
import { createId } from "../lib/id";
import { generateQuestSuggestions } from "../lib/quest";

export default function Home() {
  const [anxieties, setAnxieties] = useState<Anxiety[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [showArchived, setShowArchived] = useState(false);
  const [activeTab, setActiveTab] = useState<Category>("now");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    setAnxieties(storage.load());
  }, []);

  useEffect(() => {
    storage.save(anxieties);
  }, [anxieties]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleAdd = (payload: { text: string; category: Category; nextStep?: string }) => {
    const questSuggestions = generateQuestSuggestions(payload.category, payload.nextStep);
    const newItem: Anxiety = {
      id: createId(),
      text: payload.text,
      category: payload.category,
      nextStep: payload.nextStep,
      createdAt: new Date().toISOString(),
      quest: {
        suggested: questSuggestions,
        chosen: questSuggestions[0],
      },
    };
    setAnxieties((prev) => [newItem, ...prev]);
    setExpandedIds((prev) => new Set(prev).add(newItem.id));
  };

  const handleUpdate = (updated: Anxiety) => {
    setAnxieties((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleDelete = (id: string) => {
    setAnxieties((prev) => prev.filter((item) => item.id !== id));
  };

  const handleArchive = (id: string) => {
    setAnxieties((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, archivedAt: new Date().toISOString() } : item
      )
    );
  };

  const handleExpand = (id: string) => {
    setExpandedIds((prev) => new Set(prev).add(id));
  };

  const handleCollapse = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return anxieties.filter((item) => {
      if (!showArchived && item.archivedAt) return false;
      if (filter !== "all" && item.category !== filter) return false;
      if (!query.trim()) return true;
      return item.text.includes(query.trim());
    });
  }, [anxieties, filter, query, showArchived]);

  const grouped = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = filtered.filter((item) => item.category === category.id);
      return acc;
    }, {} as Record<Category, Anxiety[]>);
  }, [filtered]);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-10">
      <Header />

      <AnxietyForm onSubmit={handleAdd} />

      <SearchFilter
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
      />

      <div className="flex items-center gap-3 text-xs text-slate-500">
        <input
          id="show-archived"
          type="checkbox"
          checked={showArchived}
          onChange={(event) => setShowArchived(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-300"
        />
        <label htmlFor="show-archived">アーカイブも見る</label>
      </div>

      <div className="sm:hidden">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveTab(category.id)}
              className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
                activeTab === category.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <ShelfColumn
            meta={categories.find((item) => item.id === activeTab)!}
            items={grouped[activeTab]}
            now={now}
            expandedIds={expandedIds}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onExpand={handleExpand}
            onCollapse={handleCollapse}
            showToast={(message) => setToastMessage(message)}
          />
        </div>
      </div>

      <div className="hidden gap-6 sm:grid sm:grid-cols-3">
        {categories.map((category) => (
          <ShelfColumn
            key={category.id}
            meta={category}
            items={grouped[category.id]}
            now={now}
            expandedIds={expandedIds}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onExpand={handleExpand}
            onCollapse={handleCollapse}
            showToast={(message) => setToastMessage(message)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 text-center text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : null}

      <footer className="text-center text-xs text-slate-400">
        ※診断ではありません。つらさが強いときは、信頼できる人や専門窓口も頼ってね。
      </footer>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
