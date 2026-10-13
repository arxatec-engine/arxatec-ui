import { ScrollArea } from "../../scroll_area";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../table";
import type { LucideIcon } from "lucide-react";
import type { ReactNode, RefObject } from "react";
import { cn } from "../../../utilities/class";

export interface ExplorerColumn {
  key: string;
  icon: LucideIcon;
  label?: string;
  className?: string;
  center?: boolean;
}

export interface ExplorerTableProps {
  columns: ExplorerColumn[];
  selectableRef?: RefObject<HTMLDivElement | null>;
  viewportRef?: RefObject<HTMLDivElement | null>;
  className?: string;
  flow?: boolean;
  overlay?: ReactNode;
  after?: ReactNode;
  children: ReactNode;
}

export const ExplorerTable = ({
  columns,
  selectableRef,
  viewportRef,
  className,
  flow = false,
  overlay,
  after,
  children,
}: ExplorerTableProps) => {
  const header = (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead key={column.key} className={column.className}>
            <span
              className={cn(
                "flex items-center gap-2 text-sm text-foreground",
                column.center && "justify-center",
              )}
            >
              <column.icon className="size-4" />
              {column.label}
            </span>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );

  if (flow) {
    return (
      <div
        ref={selectableRef}
        className={cn(
          "relative overflow-hidden rounded-md border bg-card",
          className,
        )}
      >
        <div className="relative z-30">
          <Table classNameFather="border-none rounded-none overflow-visible">
            {header}
            <TableBody className="border-none">{children}</TableBody>
          </Table>
        </div>

        {overlay}
        {after}
      </div>
    );
  }

  return (
    <div
      ref={selectableRef}
      className={cn(
        "border h-[calc(100vh-80px)] bg-card rounded-md relative overflow-hidden flex flex-col",
        className,
      )}
    >
      <div className="border-b bg-card relative z-20">
        <Table classNameFather="border-none rounded-none overflow-visible">
          {header}
        </Table>
      </div>

      <ScrollArea
        viewportRef={viewportRef}
        className="flex-1 min-h-0 relative z-20"
      >
        <div className="relative z-30">
          <Table classNameFather="border-none rounded-none overflow-visible">
            <TableBody className="border-none">{children}</TableBody>
          </Table>
        </div>
        {overlay}
      </ScrollArea>

      {after}
    </div>
  );
};
