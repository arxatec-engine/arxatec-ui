import { useState, type ReactNode } from "react";
import { FilePreviewAssistantContext } from "./context";
import type {
  FilePreviewAssistantContextValue,
  FilePreviewAssistantState,
} from "./types";

interface StateProviderProps {
  open: boolean;
  children: ReactNode;
}

const FilePreviewAssistantStateProvider: React.FC<StateProviderProps> = ({
  open,
  children,
}) => {
  const [assistant, setAssistant] = useState<FilePreviewAssistantState>(() =>
    open ? false : null,
  );

  const value: FilePreviewAssistantContextValue = {
    assistant,
    setAssistant,
  };

  return (
    <FilePreviewAssistantContext.Provider value={value}>
      {children}
    </FilePreviewAssistantContext.Provider>
  );
};

export interface FilePreviewAssistantProviderProps {
  children: ReactNode;
  open: boolean;
  fileId: string;
}

export const FilePreviewAssistantProvider: React.FC<
  FilePreviewAssistantProviderProps
> = ({ children, open, fileId }) => (
  <FilePreviewAssistantStateProvider key={`${open}:${fileId}`} open={open}>
    {children}
  </FilePreviewAssistantStateProvider>
);
