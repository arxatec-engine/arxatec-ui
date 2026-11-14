import { cn } from "@/utilities/class";

import { HEADER_HEIGHT, ROW_HEADER_WIDTH } from "../../constants/grid";
import { columnLabel } from "../../utilities/column_label";
import type { SpreadsheetGridLayout } from "../../types";

interface Props {
  layout: SpreadsheetGridLayout;
  className?: string;
}

export const SpreadsheetGridHeader = ({
  layout: { virtualColumns, columns },
  className,
}: Props) => (
  <div
    data-slot="spreadsheet-header"
    role="row"
    aria-rowindex={1}
    className={cn(
      "sticky top-0 z-30 bg-muted text-muted-foreground",
      className,
    )}
    style={{ height: HEADER_HEIGHT }}
  >
    {virtualColumns.map(({ index, size }) => (
      <div
        key={index}
        role="columnheader"
        aria-colindex={columns.indices[index] + 2}
        className="absolute top-0 flex items-center justify-center border-b border-r border-border text-xs select-none"
        style={{
          left: ROW_HEADER_WIDTH + columns.offsets[index],
          width: size,
          height: HEADER_HEIGHT,
        }}
      >
        {columnLabel(columns.indices[index])}
      </div>
    ))}
    <div
      role="columnheader"
      aria-colindex={1}
      className="sticky left-0 z-40 border-b border-r border-border bg-muted"
      style={{ width: ROW_HEADER_WIDTH, height: HEADER_HEIGHT }}
    />
  </div>
);
