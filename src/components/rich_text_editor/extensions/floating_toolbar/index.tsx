import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { type Editor } from "@tiptap/core";
import {
  BoldToolbar,
  ItalicToolbar,
  UnderlineToolbar,
  ColorHighlightToolbar,
  ToolbarProvider,
  HeadingsToolbar,
  BulletListToolbar,
  OrderedListToolbar,
  FontFamilyToolbar,
  FontSizeToolbar,
} from "../../toolbars";
import { useMediaQuery } from "@/hooks";
import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { TooltipProvider } from "@/components/tooltip";
import { FloatingElement } from "../../ui/floating-element";
import { isSelectionValid } from "../../lib/tiptap-utils";
import { cn } from "@/utilities";

export type FloatingToolbarProps = {
  editor: Editor | null;
  extraActions?: ReactNode;
  compact?: boolean;
  showWhenCaretCollapsed?: boolean;
  dismissOnBlurStrict?: boolean;
  presentation?: "floating" | "dock";
  panelClassName?: string;
};

export function FloatingToolbar({
  editor,
  extraActions,
  compact = false,
  showWhenCaretCollapsed = false,
  dismissOnBlurStrict = false,
  presentation = "floating",
  panelClassName,
}: FloatingToolbarProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isVisible, setIsVisible] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isChildFocused, setIsChildFocused] = useState(false);
  const isChildFocusedRef = useRef(false);
  useLayoutEffect(() => {
    isChildFocusedRef.current = isChildFocused;
  });

  // Prevent default context menu on mobile
  useEffect(() => {
    if (!editor?.options.element || !isMobile) return;

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    const el = editor.options.element;
    (el as HTMLElement).addEventListener("contextmenu", handleContextMenu);

    return () =>
      (el as HTMLElement).removeEventListener("contextmenu", handleContextMenu);
  }, [editor, isMobile]);

  useEffect(() => {
    if (!editor || presentation === "dock") return;

    const updateVisibility = () => {
      const sel = editor.state.selection;
      const nonEmptyText = isSelectionValid(editor);
      const collapsedCaret =
        showWhenCaretCollapsed &&
        sel.empty &&
        editor.isEditable &&
        sel.$from.parent.isTextblock;
      const shouldBeVisible =
        (editor.isFocused || isChildFocused) &&
        (nonEmptyText || collapsedCaret);
      setIsVisible(shouldBeVisible);
    };

    editor.on("selectionUpdate", updateVisibility);
    editor.on("focus", updateVisibility);
    const handleBlur = () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = setTimeout(() => {
        blurTimeoutRef.current = null;
        const sel = editor.state.selection;
        const nonEmptyText = isSelectionValid(editor);
        const collapsedCaret =
          showWhenCaretCollapsed &&
          sel.empty &&
          editor.isEditable &&
          sel.$from.parent.isTextblock;
        const textOrCaret = nonEmptyText || collapsedCaret;
        const childHasFocus = isChildFocusedRef.current;
        if (dismissOnBlurStrict) {
          setIsVisible((editor.isFocused || childHasFocus) && textOrCaret);
          return;
        }
        const isPopOverOpen = document.querySelector(
          '[data-radix-popper-content-wrapper], [role="dialog"]',
        );
        setIsVisible(
          (editor.isFocused || childHasFocus || !!isPopOverOpen) && textOrCaret,
        );
      }, 150);
    };
    editor.on("blur", handleBlur);

    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
      editor.off("selectionUpdate", updateVisibility);
      editor.off("focus", updateVisibility);
      editor.off("blur", handleBlur);
    };
  }, [
    editor,
    isChildFocused,
    showWhenCaretCollapsed,
    dismissOnBlurStrict,
    presentation,
  ]);

  if (!editor) return null;

  const controlsRow = (
    <div className="flex items-center gap-0.5 p-1">
      <BoldToolbar />
      <ItalicToolbar />
      <UnderlineToolbar />
      {!compact && <HeadingsToolbar />}
      {!compact && !isMobile && (
        <>
          <BulletListToolbar />
          <OrderedListToolbar />
        </>
      )}
      <FontFamilyToolbar />
      <FontSizeToolbar />
      <ColorHighlightToolbar />
      {extraActions ? (
        <div className="flex shrink-0 items-center gap-0.5">{extraActions}</div>
      ) : null}
    </div>
  );

  const toolbarPanel =
    presentation === "dock" ? (
      <div
        className={cn(
          "tiptap-floating-toolbar flex w-fit max-w-[min(100vw-10rem,48rem)] items-center overflow-x-auto rounded-md border border-border bg-card shadow-sm",
          panelClassName,
        )}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onFocus={() => setIsChildFocused(true)}
        onBlur={() => setIsChildFocused(false)}
      >
        <ToolbarProvider editor={editor}>
          <TooltipProvider>{controlsRow}</TooltipProvider>
        </ToolbarProvider>
      </div>
    ) : (
      <div
        className={cn(
          "tiptap-floating-toolbar overflow-hidden shadow-lg border rounded-lg bg-card",
          isMobile ? "w-[calc(100vw-2rem)] mx-4" : "w-fit",
          panelClassName,
        )}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onFocus={() => setIsChildFocused(true)}
        onBlur={() => setIsChildFocused(false)}
      >
        <ToolbarProvider editor={editor}>
          <TooltipProvider>
            <ScrollArea className="h-fit">
              {controlsRow}
              <ScrollBar className="hidden" orientation="horizontal" />
            </ScrollArea>
          </TooltipProvider>
        </ToolbarProvider>
      </div>
    );

  if (presentation === "dock") {
    return toolbarPanel;
  }

  return (
    <FloatingElement
      editor={editor}
      shouldShow={isVisible}
      zIndex={50}
      floatingOptions={{
        placement: "top",
      }}
    >
      {toolbarPanel}
    </FloatingElement>
  );
}
