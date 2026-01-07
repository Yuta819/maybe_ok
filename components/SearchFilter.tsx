import type { Category } from "../lib/types";

const filterOptions: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "now", label: "今すぐできる" },
  { id: "wait", label: "待つしかない" },
  { id: "not", label: "そもそも起きてない" },
];

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  filter: "all" | Category;
  onFilterChange: (value: "all" | Category) => void;
};

export default function SearchFilter({
  query,
  onQueryChange,
  filter,
  onFilterChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white/70 p-4 shadow-card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="text-sm font-medium text-slate-600" htmlFor="search">
          検索
        </label>
        <input
          id="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="キーワードで探す"
          className="w-full rounded-xl border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:ring-slate-300"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onFilterChange(option.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === option.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
