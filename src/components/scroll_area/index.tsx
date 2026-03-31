import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/utilities/index";

function ScrollArea({
  className,
  children,
  viewportRef,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  viewportRef?: React.Ref<HTMLDivElement>;
}) {
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  // Sync viewportRef via DOM traversal instead of passing it directly to
  // Radix's Viewport ref. Radix composes external refs with an internal
  // callback ref that calls setState — in React 19 this triggers an infinite
  // cleanup/re-apply cycle (setState(null) → re-render → setState(node) → …).
  React.useLayoutEffect(() => {
    if (!viewportRef || !sentinelRef.current) return;

    const viewport = sentinelRef.current.closest<HTMLDivElement>(
      '[data-slot="scroll-area-viewport"]'
    );

    if (typeof viewportRef === "function") {
      viewportRef(viewport);
      return () => {
        viewportRef(null);
      };
    }

    (
      viewportRef as React.MutableRefObject<HTMLDivElement | null>
    ).current = viewport;
    return () => {
      (
        viewportRef as React.MutableRefObject<HTMLDivElement | null>
      ).current = null;
    };
  }, [viewportRef]);

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        <div ref={sentinelRef} aria-hidden style={{ display: "none" }} />
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-sm"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
