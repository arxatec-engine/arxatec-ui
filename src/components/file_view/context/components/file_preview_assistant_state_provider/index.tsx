import { useState, type ReactNode } from "react";
import { FilePreviewAssistantContext } from "../../context";
import type {
  FilePreviewAssistantContextValue,
  FilePreviewAssistantState,
} from "../../types";

interface StateProviderProps {
  open: boolean;
  children: ReactNode;
}

const FilePreviewAssistantStateProvider = ({
  open,
  children,
}: StateProviderProps) => {
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

export { FilePreviewAssistantStateProvider };
