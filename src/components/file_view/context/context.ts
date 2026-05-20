import { createContext } from "react";
import type { FilePreviewAssistantContextValue } from "./types";

export const FilePreviewAssistantContext = createContext<
  FilePreviewAssistantContextValue | undefined
>(undefined);
