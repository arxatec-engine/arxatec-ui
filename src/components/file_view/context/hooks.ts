import { useContext } from "react";
import { FilePreviewAssistantContext } from "./context";

export const useFilePreviewAssistantContext = () => {
  const context = useContext(FilePreviewAssistantContext);
  if (!context) {
    throw new Error(
      "useFilePreviewAssistantContext should be used within FilePreviewAssistantProvider",
    );
  }
  return context;
};
