import { type ReactNode } from "react";
import { FilePreviewAssistantStateProvider } from "./components/file_preview_assistant_state_provider";

export interface FilePreviewAssistantProviderProps {
  children: ReactNode;
  open: boolean;
  fileId: string;
}

export const FilePreviewAssistantProvider = ({ children, open, fileId }: FilePreviewAssistantProviderProps) => (
  <FilePreviewAssistantStateProvider key={`${open}:${fileId}`} open={open}>
    {children}
  </FilePreviewAssistantStateProvider>
);
