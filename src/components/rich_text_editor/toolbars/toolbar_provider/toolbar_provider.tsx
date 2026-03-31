import type { Editor } from "@tiptap/react";
import React from "react";
import { ToolbarContext } from "./context";

interface ToolbarProviderProps {
  editor: Editor;
  children: React.ReactNode;
}

export const ToolbarProvider = ({ editor, children }: ToolbarProviderProps) => {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    if (!editor) return;
    const handleTransaction = () => forceUpdate();
    editor.on("transaction", handleTransaction);
    return () => {
      editor.off("transaction", handleTransaction);
    };
  }, [editor]);

  return (
    <ToolbarContext.Provider value={{ editor }}>
      {children}
    </ToolbarContext.Provider>
  );
};
