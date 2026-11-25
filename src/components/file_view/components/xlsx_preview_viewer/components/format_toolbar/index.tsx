import { Eraser, Merge, Paintbrush, Split } from "lucide-react";

import { Button } from "@/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { cn } from "@/utilities/class";

import { useSpreadsheetEditing } from "../../contexts/editing";
import type { SpreadsheetSelection, SpreadsheetSheet } from "../../types";
import type { SpreadsheetCellFormat } from "../../types/editing";
import { selectionLabel, selectionRange } from "../../utilities/selection";
import { SpreadsheetAlignmentControls } from "../alignment_controls";
import { SpreadsheetDimensionControls } from "../dimension_controls";
import { SpreadsheetFontControls } from "../font_controls";
import { SpreadsheetNumberControls } from "../number_controls";

interface Props {
  sheet: SpreadsheetSheet;
  selection: SpreadsheetSelection | null;
  className?: string;
}

export const SpreadsheetFormatToolbar = ({
  sheet,
  selection,
  className,
}: Props) => {
  const editor = useSpreadsheetEditing();
  if (!editor) return null;
  const { labels } = editor;
  const range = selection ? selectionRange(selection, sheet.merges) : null;
  const cell = range
    ? sheet.cells[`${range.startRow}:${range.startColumn}`]
    : undefined;
  const format = cell?.format ?? {};
  const apply = (patch: SpreadsheetCellFormat) => {
    if (range)
      editor.apply({ kind: "format", sheet: sheet.name, range, format: patch });
  };
  return (
    <div
      data-slot="spreadsheet-format-toolbar"
      className={cn(
        "flex shrink-0 items-center gap-2 border-b px-3 py-1.5",
        className,
      )}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" disabled={!range}>
            <Paintbrush className="size-4" />
            {labels.formatting}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="grid w-[min(24rem,calc(100vw-2rem))] gap-3"
        >
          <SpreadsheetFontControls
            format={format}
            labels={labels}
            onChange={apply}
          />
          <SpreadsheetAlignmentControls
            format={format}
            labels={labels}
            onChange={apply}
          />
          <SpreadsheetNumberControls
            currencyFormat={editor.currencyFormat}
            format={format}
            labels={labels}
            onChange={apply}
          />
          {range && (
            <SpreadsheetDimensionControls
              labels={labels}
              rowHeight={
                sheet.rows[range.startRow]?.size ?? sheet.defaultRowHeight
              }
              columnWidth={
                sheet.columns[range.startColumn]?.size ??
                sheet.defaultColumnWidth
              }
              onChange={(axis, size) =>
                editor.apply({
                  kind: "dimension",
                  sheet: sheet.name,
                  axis,
                  index: axis === "row" ? range.startRow : range.startColumn,
                  size,
                })
              }
            />
          )}
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={labels.merge}
        disabled={
          !range ||
          (range.startRow === range.endRow &&
            range.startColumn === range.endColumn)
        }
        onClick={() => {
          if (range)
            editor.apply({
              kind: "merge",
              sheet: sheet.name,
              range,
              merge: true,
            });
        }}
      >
        <Merge className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={labels.unmerge}
        disabled={!range}
        onClick={() => {
          if (range)
            editor.apply({
              kind: "merge",
              sheet: sheet.name,
              range,
              merge: false,
            });
        }}
      >
        <Split className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={labels.clear}
        disabled={!range}
        onClick={() => {
          if (range) editor.apply({ kind: "clear", sheet: sheet.name, range });
        }}
      >
        <Eraser className="size-4" />
      </Button>
      {range && (
        <span className="text-xs text-muted-foreground">
          {selectionLabel(range)}
        </span>
      )}
    </div>
  );
};
