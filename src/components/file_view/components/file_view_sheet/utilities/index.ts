import type { FileViewSheetPanelRender } from "../types";

export const renderPanelContent = (
  content: FileViewSheetPanelRender | undefined,
  isActive: boolean,
) => {
  if (!content) return null;
  return typeof content === "function" ? content(isActive) : content;
};
