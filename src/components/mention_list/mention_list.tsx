import * as React from "react";
import { AtSign, UserRoundX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { ScrollArea } from "../scroll_area";
import type { MentionListProps, MentionListRef } from "./types";
import { cn } from "../../utilities/class";

function HighlightedText({ text, query }: { text: string; query?: string }) {
  if (!query) return <>{text}</>;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-transparent font-semibold not-italic text-foreground">
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

export const MentionList = React.forwardRef<MentionListRef, MentionListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [trackedItems, setTrackedItems] = React.useState(props.items);
    if (trackedItems !== props.items) {
      setTrackedItems(props.items);
      setSelectedIndex(0);
    }

    const selectItem = (index: number) => {
      const item = props.items[index];
      if (item) {
        props.command({ id: item.id, label: item.label });
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

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
        <div className="bg-popover border border-border rounded-md shadow-md min-w-[200px] overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1.5 border-b border-border flex items-center gap-1.5">
            <AtSign className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Mencionar</span>
          </div>
          <div className="flex flex-col items-center gap-2 py-5 px-4 text-center">
            <div className="size-7 rounded-full bg-muted flex items-center justify-center">
              <UserRoundX className="size-3.5 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">
              Sin resultados
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-popover border border-border rounded-md shadow-md min-w-[200px] animate-in fade-in zoom-in-95 duration-100 pointer-events-auto">
        <div className="px-2 py-1.5 border-b border-border flex items-center gap-1.5">
          <AtSign className="size-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Mencionar</span>
        </div>

        <ScrollArea className="h-[200px] w-full">
          <div
            className="p-1 flex flex-col"
            onMouseDown={(e) => e.preventDefault()}
          >
            {props.items.map((item, index) => {
              const isSelected = index === selectedIndex;
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
                    "flex items-center gap-2 w-full px-2 py-1.5 text-left text-sm rounded-sm transition-colors duration-100 outline-none select-none",
                    isSelected
                      ? "bg-accent text-accent-foreground"
                      : "text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Avatar className="size-6 shrink-0">
                    {item.image ? (
                      <AvatarImage src={item.image} alt={item.label} />
                    ) : null}
                    <AvatarFallback className="text-[10px] font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="truncate text-xs">
                      <HighlightedText text={item.label} query={props.query} />
                    </span>
                    {item.subtitle && (
                      <span className="text-xs truncate text-muted-foreground leading-3">
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
  }
);

MentionList.displayName = "MentionList";
