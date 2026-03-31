import { useEffect, useState } from "react";
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
} from "../../toolbars";
import { useMediaQuery } from "@/hooks";
import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { TooltipProvider } from "@/components/tooltip";
import { FloatingElement } from "../../ui/floating-element";
import { isSelectionValid } from "../../lib/tiptap-utils";
import { cn } from "@/utilities";

export function FloatingToolbar({ editor }: { editor: Editor | null }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isVisible, setIsVisible] = useState(false);

  // Focus stability state
  const [isChildFocused, setIsChildFocused] = useState(false);

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
    if (!editor) return;

    const updateVisibility = () => {
      const shouldBeVisible =
        (editor.isFocused || isChildFocused) && isSelectionValid(editor);
      setIsVisible(shouldBeVisible);
    };

    editor.on("selectionUpdate", updateVisibility);
    editor.on("focus", updateVisibility);
    const handleBlur = () => {
      setTimeout(() => {
        const isPopOverOpen = document.querySelector(
          '[data-radix-popper-content-wrapper], [role="dialog"]'
        );
        const shouldStillShow =
          (editor.isFocused || isChildFocused || !!isPopOverOpen) &&
          isSelectionValid(editor);
        setIsVisible(shouldStillShow);
      }, 200);
    };
    editor.on("blur", handleBlur);

    return () => {
      editor.off("selectionUpdate", updateVisibility);
      editor.off("focus", updateVisibility);
      editor.off("blur", handleBlur);
    };
  }, [editor, isChildFocused]);

  if (!editor) return null;

  return (
    <FloatingElement
      editor={editor}
      shouldShow={isVisible}
      zIndex={50}
      floatingOptions={{
        placement: "top",
      }}
    >
      <div
        className={cn(
          "shadow-lg border rounded-lg bg-card overflow-hidden tiptap-floating-toolbar",
          isMobile ? "w-[calc(100vw-2rem)] mx-4" : "w-fit"
        )}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onFocus={() => setIsChildFocused(true)}
        onBlur={() => setIsChildFocused(false)}
      >
        <ToolbarProvider editor={editor}>
          <TooltipProvider>
            <ScrollArea className="h-fit">
              <div className="flex items-center p-1 gap-0.5">
                {/* Primary formatting */}
                <BoldToolbar />
                <ItalicToolbar />
                <UnderlineToolbar />
                <HeadingsToolbar />
                {!isMobile && (
                  <>
                    <BulletListToolbar />
                    <OrderedListToolbar />
                  </>
                )}
                {/* Rich formatting */}
                <ColorHighlightToolbar />
              </div>
              <ScrollBar className="hidden" orientation="horizontal" />
            </ScrollArea>
          </TooltipProvider>
        </ToolbarProvider>
      </div>
    </FloatingElement>
  );
}
