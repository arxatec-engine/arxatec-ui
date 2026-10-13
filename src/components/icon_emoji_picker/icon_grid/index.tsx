import { Icon } from "@/components/icon_picker/components/icon";
import { ScrollArea } from "@/components/scroll_area";
import type { IconName } from "lucide-react/dynamic";
import { SearchIcon } from "lucide-react";
import { cn } from "@/utilities/class";
import { VIEWPORT_BLOCK } from "./constants";
import { useIconPagination } from "./hooks";

interface IconGridProps {
  value?: string | null;
  onSelect: (name: string) => void;
  searchPlaceholder: string;
  emptyText: string;
}

export const IconGrid = ({
  value,
  onSelect,
  searchPlaceholder,
  emptyText,
}: IconGridProps) => {
  const { query, search, visible, isEmpty, viewportRef } = useIconPagination();

  return (
    <div className="flex h-[300px] flex-col">
      <div className="flex h-9 shrink-0 items-center gap-2 border-b px-3">
        <SearchIcon className="size-4 shrink-0 opacity-50" />
        <input
          value={query}
          onChange={(event) => search(event.target.value)}
          placeholder={searchPlaceholder}
          className="flex h-10 w-full bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground"
        />
      </div>

      {isEmpty ? (
        <p className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          {emptyText}
        </p>
      ) : (
        <ScrollArea
          viewportRef={viewportRef}
          onWheel={(event) => event.stopPropagation()}
          data-testid="icon-grid-scroll"
          className={cn("min-h-0 flex-1", VIEWPORT_BLOCK)}
        >
          <div className="flex flex-wrap px-1 py-1">
            {visible.map((name) => (
              <button
                key={name}
                type="button"
                title={name}
                aria-label={name}
                onClick={() => onSelect(name)}
                className={cn(
                  "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  value === name && "bg-accent text-foreground",
                )}
              >
                <Icon name={name as IconName} className="size-4" />
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
