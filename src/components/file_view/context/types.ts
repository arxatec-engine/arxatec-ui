export type FilePreviewAssistantState = boolean | null;

export interface FilePreviewAssistantContextValue {
  assistant: FilePreviewAssistantState;
  setAssistant: (assistant: FilePreviewAssistantState) => void;
}
