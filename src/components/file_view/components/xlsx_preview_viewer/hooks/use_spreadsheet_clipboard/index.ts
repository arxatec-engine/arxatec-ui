import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  selectionClipboard,
  selectionRange,
  writeSelectionClipboard,
} from "../../utilities/selection";
import type {
  FileXlsxPreviewViewerLabels,
  SpreadsheetSheet,
  SpreadsheetSelection,
} from "../../types";

export const useSpreadsheetClipboard = (
  sheet: SpreadsheetSheet | undefined,
  labels: FileXlsxPreviewViewerLabels,
) => {
  const [selection, setSelection] = useState<SpreadsheetSelection | null>(null);
  const copyRequest = useRef(0);
  useEffect(
    () => () => {
      copyRequest.current++;
    },
    [],
  );
  const [copyNotice, setCopyNotice] = useState<{
    message: string;
    success: boolean;
  } | null>(null);
  useEffect(() => {
    if (!copyNotice) return;
    const timeout = setTimeout(() => setCopyNotice(null), 2500);
    return () => clearTimeout(timeout);
  }, [copyNotice]);
  const select = useCallback((next: SpreadsheetSelection | null) => {
    copyRequest.current++;
    setSelection((current) =>
      current?.anchor.row === next?.anchor.row &&
      current?.anchor.column === next?.anchor.column &&
      current?.focus.row === next?.focus.row &&
      current?.focus.column === next?.focus.column
        ? current
        : next,
    );
    setCopyNotice(null);
  }, []);
  const reportCopy = useCallback(
    (message: string, success: boolean) => setCopyNotice({ message, success }),
    [],
  );
  const selectedRange = useMemo(
    () => (sheet && selection ? selectionRange(selection, sheet.merges) : null),
    [sheet, selection],
  );
  const copySelection = async () => {
    if (!sheet || !selection) return;
    const currentCopy = ++copyRequest.current;
    try {
      await writeSelectionClipboard(selectionClipboard(sheet, selection));
      if (currentCopy === copyRequest.current) reportCopy(labels.copied, true);
    } catch (cause) {
      if (currentCopy === copyRequest.current)
        reportCopy(
          cause instanceof Error ? cause.message : labels.copyError,
          false,
        );
    }
  };
  return {
    selection,
    select,
    copyNotice,
    selectedRange,
    copySelection,
    reportCopy,
  };
};
