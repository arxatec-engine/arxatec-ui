export const EXPLORER_VIEW_MODE = { LIST: "list", GRID: "grid" } as const;

export type ExplorerViewMode =
  (typeof EXPLORER_VIEW_MODE)[keyof typeof EXPLORER_VIEW_MODE];
