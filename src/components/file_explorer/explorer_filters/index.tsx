import { cn } from "../../../utilities/class";
import { Input } from "../../input";
import { Search } from "lucide-react";
import type { ReactNode } from "react";
import {
  ExplorerFilterSelect,
  type ExplorerFilterSelectProps,
} from "./components";

export interface ExplorerFiltersProps {
  className?: string;
  search: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  typeFilter?: ExplorerFilterSelectProps;
  formatFilter?: ExplorerFilterSelectProps;
  trailing?: ReactNode;
}

export const ExplorerFilters = ({
  className,
  search,
  searchPlaceholder,
  onSearchChange,
  typeFilter,
  formatFilter,
  trailing,
}: ExplorerFiltersProps) => (
  <div className={cn("flex items-center gap-2 flex-wrap mb-2", className)}>
    <div className="w-full flex items-center relative flex-1">
      <Search className="absolute top-0 bottom-0 left-2 size-4 text-muted-foreground my-auto" />
      <Input
        size="sm"
        className="w-full pl-7"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>

    {typeFilter && <ExplorerFilterSelect {...typeFilter} />}
    {formatFilter && <ExplorerFilterSelect {...formatFilter} />}
    {trailing}
  </div>
);
