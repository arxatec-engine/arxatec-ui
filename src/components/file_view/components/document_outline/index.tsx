import { useEffect, useState } from "react";

import { ScrollArea } from "@/components/scroll_area";

import type { DocumentOutlineItem } from "./types";

interface Props {
  items: DocumentOutlineItem[];
}

export const DocumentOutline = ({ items }: Props) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const update = () => {
      let current = 0;
      items.forEach((item, index) => {
        const position = item.position();
        if (position !== null && position <= 80) current = index;
      });
      setActive(current);
    };
    update();
    document.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      document.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [items]);
  if (!items.length) return null;

  const navigate = (item: DocumentOutlineItem) => {
    item.navigate();
    setOpen(false);
  };

  return (
    <nav
      aria-label="Índice del documento"
      className="absolute left-3 top-3 z-50"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <div className="flex flex-col items-start py-2">
        {items.map((item, index) => (
          <button
            key={index}
            type="button"
            aria-label={item.title}
            onFocus={() => setOpen(true)}
            onClick={() => navigate(item)}
            className="flex h-2 w-9 items-center justify-end focus-visible:outline-none"
          >
            <span
              className={`h-[2.5px] rounded-md transition-all duration-200 ${active === index ? "w-[18px] bg-foreground/80" : "w-[11px] bg-muted-foreground/40"}`}
            />
          </button>
        ))}
      </div>
      {open && (
        <div
          style={{ position: "absolute", top: 0, left: 0, zIndex: 50 }}
          className="origin-top-left motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-200"
        >
          <ScrollArea
            className="w-72 max-w-[calc(100vw-2rem)] rounded-xl border bg-popover text-popover-foreground shadow-lg"
            style={{ height: `min(70vh, 32rem, ${items.length * 40 + 16}px)` }}
          >
            <div className="p-2">
              {items.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => navigate(item)}
                  aria-current={active === index ? "location" : undefined}
                  className={`block w-full truncate rounded-md px-3 py-2 text-left text-sm hover:bg-accent focus-visible:bg-accent focus-visible:outline-none ${active === index ? "bg-accent/60 font-medium" : ""}`}
                  style={{ paddingLeft: `${12 + Math.min(item.level, 4) * 16}px` }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </nav>
  );
};

export type { DocumentOutlineItem } from "./types";
