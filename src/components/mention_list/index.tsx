import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { ScrollArea } from "../scroll_area";
import { cn } from "@/utilities/class";
import type { MentionListProps, MentionListRef } from "./types";

export const MentionList = React.forwardRef<MentionListRef, MentionListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];
      if (item) {
        props.command({ id: item.id, label: item.label });
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length,
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    React.useEffect(() => setSelectedIndex(0), [props.items]);

    React.useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    if (props.items.length === 0) {
      return (
        <div className="bg-card border border-border rounded-md p-2 text-xs text-muted-foreground shadow-md min-w-[150px]">
          No se encontraron resultados
        </div>
      );
    }

    return (
      <div className="bg-card border border-border rounded-md shadow-md overflow-hidden min-w-[200px] animate-in fade-in zoom-in-95 duration-100 pointer-events-auto">
        <ScrollArea className="max-h-[220px]">
          <div
            className="p-1 flex flex-col gap-0.5"
            onMouseDown={(e) => e.preventDefault()}
          >
            {props.items.map((item, index) => {
              const initials = item.label
                ? item.label
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "U";

              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(index)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectItem(index);
                  }}
                  className={cn(
                    "flex items-center gap-2 w-full px-2 py-1.5 text-left text-xs rounded-sm transition-colors",
                    index === selectedIndex
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted",
                  )}
                >
                  <Avatar className="size-6 shrink-0 border border-border/50">
                    {item.image ? (
                      <AvatarImage src={item.image} alt={item.label} />
                    ) : null}
                    <AvatarFallback className="text-[10px]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="truncate">{item.label}</span>
                    {item.subtitle && (
                      <span
                        className={cn(
                          "text-[10px] truncate opacity-70",
                          index === selectedIndex
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground",
                        )}
                      >
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  },
);

MentionList.displayName = "MentionList";
