import type { Anxiety } from "./types";

const STORAGE_KEY = "tabun-daijoubu.anxieties";

export const storage = {
  load(): Anxiety[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Anxiety[];
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  },
  save(items: Anxiety[]) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  },
};
