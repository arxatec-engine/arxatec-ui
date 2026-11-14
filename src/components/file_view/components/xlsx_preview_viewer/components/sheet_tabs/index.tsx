import { ScrollArea, ScrollBar } from "@/components/scroll_area";
import { Tabs, TabsList, TabsTrigger } from "@/components/tabs";
import { cn } from "@/utilities/class";

import type { SpreadsheetSheet } from "../../types";

interface Props {
  sheets: SpreadsheetSheet[];
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  className?: string;
}

export const SpreadsheetSheetTabs = ({
  sheets,
  value,
  onValueChange,
  label,
  className,
}: Props) => (
  <ScrollArea
    data-slot="spreadsheet-sheet-tabs"
    className={cn(
      "shrink-0 border-t border-border bg-background pb-1",
      className,
    )}
  >
    <Tabs
      value={value}
      onValueChange={onValueChange}
      className="w-max min-w-full px-3 py-2"
    >
      <TabsList aria-label={label} className="h-auto bg-muted">
        {sheets.map((sheet, index) => (
          <TabsTrigger key={index} value={String(index)}>
            {sheet.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
);
