import { Loader2, SearchXIcon } from "lucide-react";
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
  renderItem: (item: T) => React.ReactNode;
  onSelect: (value: string) => void;
  getKey: (item: T) => string;
}

export function AsyncCommandList<T>({
  data,
  isLoading,
  emptyMessage,
  renderItem,
  getKey,
  onSelect,
}: Props<T>) {
  return (
    <CommandList className="w-full h-full">
      {isLoading ? (
        <CommandItem value="loading" disabled className="flex flex-col p-6">
          <Loader2 className="size-5 animate-spin" />
          Cargando...
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
              onSelect={(value) => onSelect(value)}
              key={getKey(item)}
              value={getKey(item)}
            >
              {renderItem(item)}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </CommandList>
  );
}
