import { useState } from "react";
import { TableProperties } from "lucide-react";

import { StatusMessage } from "@/components/status_message";
import { cn } from "@/utilities/class";

import { useSpreadsheetClipboard } from "../../hooks/use_spreadsheet_clipboard";
import type {
  FileXlsxPreviewViewerLabels,
  SpreadsheetWorkbook,
} from "../../types";
import { SpreadsheetGrid } from "../spreadsheet_grid";
import { SpreadsheetSheetTabs } from "../sheet_tabs";
import { SpreadsheetToolbar } from "../toolbar";

interface Props {
  workbook: SpreadsheetWorkbook;
  labels: FileXlsxPreviewViewerLabels;
  onDownload: () => void;
  className?: string;
}

export const SpreadsheetWorkspace = ({
  workbook,
  labels,
  onDownload,
  className,
}: Props) => {
  const [activeSheet, setActiveSheet] = useState("0");
  const [scale, setScale] = useState(1);
  const sheet = workbook.sheets[Number(activeSheet)];
  const clipboard = useSpreadsheetClipboard(sheet, labels);
  return (
    <div
      data-slot="spreadsheet-workspace"
      className={cn("contents", className)}
    >
      {workbook.basic && (
        <p className="shrink-0 border-b border-border px-3 py-2 text-xs text-muted-foreground">
          {labels.basicView}
        </p>
      )}
      <div className="relative min-h-0 flex-1 p-3">
        {sheet ? (
          <SpreadsheetGrid
            key={activeSheet}
            sheet={sheet}
            scale={scale}
            selection={clipboard.selection}
            onSelectionChange={clipboard.select}
            onCopyResult={clipboard.reportCopy}
            labels={labels}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4">
            <StatusMessage
              title={labels.emptyTitle}
              description={labels.emptyDescription}
              icon={TableProperties}
            />
          </div>
        )}
      </div>
      {workbook.sheets.length > 0 && (
        <SpreadsheetSheetTabs
          sheets={workbook.sheets}
          value={activeSheet}
          label={labels.sheets}
          onValueChange={(value) => {
            setActiveSheet(value);
            clipboard.select(null);
          }}
        />
      )}
      <SpreadsheetToolbar
        scale={scale}
        setScale={setScale}
        clipboard={clipboard}
        labels={labels}
        onDownload={onDownload}
      />
    </div>
  );
};
