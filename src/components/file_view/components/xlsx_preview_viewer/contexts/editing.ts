import { createContext, useContext } from "react";

import type { SpreadsheetEditorController } from "../types/interaction";

export const SpreadsheetEditingContext =
  createContext<SpreadsheetEditorController | null>(null);

export const useSpreadsheetEditing = () =>
  useContext(SpreadsheetEditingContext);
