import type { ExplorerAction } from "../types";

export const visibleActions = (actions: ExplorerAction[]) =>
  actions.filter((action) => !action.hidden);
