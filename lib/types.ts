export type Category = "now" | "wait" | "not";

export type Quest = {
  suggested: string[];
  chosen?: string;
  startedAt?: string;
  completedAt?: string;
  titleAwarded?: string;
};

export type Anxiety = {
  id: string;
  text: string;
  category: Category;
  nextStep?: string;
  createdAt: string;
  archivedAt?: string;
  quest?: Quest;
};

export type CategoryMeta = {
  id: Category;
  title: string;
  description: string;
  note: string;
  stamp: string;
  colorClass: string;
};
