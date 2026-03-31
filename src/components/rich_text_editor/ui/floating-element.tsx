import * as React from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  limitShift,
  type UseFloatingOptions,
} from "@floating-ui/react";
import { Editor } from "@tiptap/core";
import { createPortal } from "react-dom";
import { getSelectionBoundingRect } from "../lib/tiptap-utils";

interface FloatingElementProps {
  editor: Editor | null;
  shouldShow?: boolean;
  floatingOptions?: Partial<UseFloatingOptions>;
  zIndex?: number;
  onOpenChange?: (open: boolean) => void;
  referenceElement?: HTMLElement | null;
  getBoundingClientRect?: (editor: Editor) => DOMRect | null;
  closeOnEscape?: boolean;
  resetTextSelectionOnClose?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const FloatingElement = ({
  editor,
  shouldShow,
  floatingOptions = {},
  zIndex = 50,
  onOpenChange,
  referenceElement,
  getBoundingClientRect = getSelectionBoundingRect,
  closeOnEscape = true,
  children,
  style,
  className,
}: FloatingElementProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { refs, floatingStyles, update } = useFloating({
    open: shouldShow ?? isOpen,
    onOpenChange: (open) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    strategy: "fixed",
    middleware: [
      offset(10),
      flip({ fallbackAxisSideDirection: "end" }),
      shift({ limiter: limitShift() }),
      ...(floatingOptions.middleware || []),
    ],
    whileElementsMounted: autoUpdate,
    ...floatingOptions,
  });

  // Update reference position
  React.useEffect(() => {
    if (!editor || !(shouldShow ?? isOpen)) return;

    const handleUpdate = () => {
      if (referenceElement) {
        refs.setReference(referenceElement);
        return;
      }

      const rect = getBoundingClientRect(editor);
      if (rect) {
        refs.setReference({
          getBoundingClientRect: () => rect,
        });
      }
    };

    handleUpdate();

    // Listen to various events that might change position
    editor.on("selectionUpdate", handleUpdate);
    editor.on("transaction", handleUpdate);
    editor.on("focus", handleUpdate);
    editor.on("blur", handleUpdate);
    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, true);

    return () => {
      editor.off("selectionUpdate", handleUpdate);
      editor.off("transaction", handleUpdate);
      editor.off("focus", handleUpdate);
      editor.off("blur", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
    };
  }, [
    editor,
    referenceElement,
    refs,
    getBoundingClientRect,
    shouldShow,
    isOpen,
  ]);

  // Manually trigger update when visibility changes
  React.useEffect(() => {
    if (shouldShow ?? isOpen) {
      update();
    }
  }, [shouldShow, isOpen, update]);

  React.useEffect(() => {
    if (closeOnEscape && (shouldShow ?? isOpen)) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
          onOpenChange?.(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [closeOnEscape, isOpen, shouldShow, onOpenChange]);

  const visible = shouldShow ?? isOpen;

  if (!visible || !editor) return null;

  return createPortal(
    <div
      ref={refs.setFloating}
      className={className}
      style={{
        ...floatingStyles,
        zIndex,
        pointerEvents: "none",
        ...style,
      }}
    >
      <div style={{ pointerEvents: "auto" }}>{children}</div>
    </div>,
    document.body,
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const isElementWithinEditor = (editor: Editor, element: Node) => {
  const editorElement = editor.options.element as HTMLElement;
  return editorElement?.contains(element);
};
