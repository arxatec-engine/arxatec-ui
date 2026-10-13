import { TableHead, TableHeader, TableRow } from "@/components/table";
import type { ComponentType, ReactNode } from "react";

export interface SelectTableColumn {
  key: string;
  label: ReactNode;
  icon: ComponentType<{ className?: string }>;
  className?: string;
}

export interface SelectTableHeaderProps {
  columns: readonly SelectTableColumn[];
}

export const SelectTableHeader = ({ columns }: SelectTableHeaderProps) => (
  <TableHeader>
    <TableRow>
      <TableHead className="w-[40px]">
        <span className="flex items-center gap-2"></span>
      </TableHead>
      {columns.map(({ key, icon: Icon, className, label }) => (
        <TableHead key={key} className={className}>
          <span className="flex items-center gap-2">
            <Icon className="size-4 text-muted-foreground" />
            {label}
          </span>
        </TableHead>
      ))}
    </TableRow>
  </TableHeader>
);
