import { Loader2, SearchXIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/utilities/index";

import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../command";

interface Props<T> {
  data: T[];
  isLoading: boolean;
  emptyMessage: string;
  renderItem: (item: T) => ReactNode;
  onSelect: (value: string) => void;
  getKey: (item: T) => string;
  loadingMessage?: string;
  className?: string;
}

export const AsyncCommandList = <T,>({
  data,
  isLoading,
  emptyMessage,
  renderItem,
  getKey,
  onSelect,
  loadingMessage = "Loading…",
  className,
}: Props<T>) => {
  return (
    <CommandList className={cn("w-full h-full", className)}>
      {isLoading ? (
        <CommandItem value="loading" disabled className="flex flex-col p-6">
          <Loader2 className="size-5 animate-spin" />
          {loadingMessage}
        </CommandItem>
      ) : data.length === 0 ? (
        <CommandEmpty className="p-6 h-auto flex text-muted-foreground items-center flex-col justify-center gap-2 text-sm">
          <SearchXIcon className="size-7" />
          <p>{emptyMessage}</p>
        </CommandEmpty>
      ) : (
        <CommandGroup className="w-full">
          {data.map((item) => (
            <CommandItem
              key={getKey(item)}
              value={getKey(item)}
              onSelect={onSelect}
            >
              {renderItem(item)}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </CommandList>
  );
};
