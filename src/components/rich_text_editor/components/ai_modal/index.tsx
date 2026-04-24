import React, { useState, useRef } from "react";
import { type Editor } from "@tiptap/core";
import { Sparkles, X, Send, Loader2, StopCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FloatingElement } from "../../ui/floating-element";
import { Button } from "@/components/button";
import { Input } from "@/components/input";

export interface AiCommandModalProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
  onCommand: (prompt: string, selectionContent: string) => Promise<void>;
  isLoading: boolean;
  onCancel?: () => void;
}

export const AiCommandModal = ({
  editor,
  isOpen,
  onClose,
  onCommand,
  isLoading,
  onCancel,
}: AiCommandModalProps) => {
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);


  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isLoading || !editor) return;

    const selection = editor.state.selection;
    const content = editor.state.doc.textBetween(
      selection.from,
      selection.to,
      " ",
    );

    onCommand(prompt, content);
    setPrompt("");
  };

  const handleClose = () => {
    setPrompt("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleClose();
    }
  };

  // Focus input when modal opens
  const handleFocusRef = (node: HTMLInputElement | null) => {
    if (node && isOpen) {
      setTimeout(() => node.focus(), 10);
    }
    (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
  };

  return (
    <FloatingElement
      editor={editor}
      shouldShow={isOpen}
      zIndex={100}
      onOpenChange={(open) => !open && handleClose()}
      className="outline-none"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-[400px] bg-background border shadow-xl rounded-xl overflow-hidden"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Magic AI
              </span>
              <button
                onClick={handleClose}
                className="ml-auto p-1 hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3">
              {isLoading ? (
                <div className="py-4 flex flex-col items-center justify-center gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>IA trabajando...</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
                    className="gap-2 text-xs h-8"
                  >
                    <StopCircle className="w-3.5 h-3.5" />
                    Cancelar
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    ref={handleFocusRef}
                    placeholder="Pregúntale a la IA que edite esto..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1 h-9 text-sm focus-visible:ring-primary"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    disabled={!prompt.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>

            {!isLoading && (
              <div className="px-3 py-2 bg-muted/10 border-t flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground italic">
                  Presiona Enter para generar
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </FloatingElement>
  );
};
