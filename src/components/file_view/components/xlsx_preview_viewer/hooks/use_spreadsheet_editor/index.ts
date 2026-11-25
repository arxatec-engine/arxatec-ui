import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  SPREADSHEET_EDITOR_LABELS,
  SPREADSHEET_EDITOR_LIMITS,
} from "../../constants/editor";
import type { SpreadsheetWorkbook } from "../../types";
import type {
  FileXlsxDocumentEditorProps,
  SpreadsheetEdit,
  SpreadsheetEditorHandle,
} from "../../types/editing";
import type { SpreadsheetEditorController } from "../../types/interaction";
import { applySpreadsheetEdit } from "../../utilities/editing/apply";
import { readWorkbook } from "../../utilities/read_workbook";
import { SPREADSHEET_LIMITS } from "../../utilities/constants";

interface Session {
  file: File;
  bytes: ArrayBuffer;
  workbook: SpreadsheetWorkbook;
  edits: SpreadsheetEdit[];
  revision: number;
}

export const useSpreadsheetEditor = (props: FileXlsxDocumentEditorProps) => {
  const { file } = props;
  const callbacks = useRef(props);
  useLayoutEffect(() => {
    callbacks.current = props;
  }, [props]);
  const session = useRef<Session | null>(null);
  const draft = useRef<{ commit: (() => void) | null; dirty: boolean }>({
    commit: null,
    dirty: false,
  });
  const exports = useRef(new Set<AbortController>());
  const containerRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<{
    file: File;
    workbook?: SpreadsheetWorkbook;
    error?: Error;
  }>();
  const [editError, setEditError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const labels = { ...SPREADSHEET_EDITOR_LABELS, ...props.labels };
  const current = result?.file === file ? result : undefined;
  useEffect(() => {
    const abort = new AbortController();
    session.current = null;
    draft.current = { commit: null, dirty: false };
    callbacks.current.onReady?.(false);
    callbacks.current.onChange?.(0);
    const load = async () => {
      if (
        (!/\.xlsx$/i.test(file.name) &&
          file.type !==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
        !file.size ||
        file.size > SPREADSHEET_LIMITS.inputBytes
      )
        throw new Error("SPREADSHEET_FILE_UNSUPPORTED");
      const bytes = await file.arrayBuffer();
      const workbook = await readWorkbook(
        bytes.slice(0),
        "xlsx",
        abort.signal,
        true,
      );
      if (abort.signal.aborted) return;
      session.current = { file, bytes, workbook, edits: [], revision: 0 };
      setResult({ file, workbook });
      setEditError(false);
      callbacks.current.onReady?.(true);
    };
    void load().catch((cause: unknown) => {
      if (abort.signal.aborted) return;
      const error =
        cause instanceof Error ? cause : new Error("SPREADSHEET_OPEN_FAILED");
      setResult({ file, error });
      callbacks.current.onError?.(error);
    });
    return () => {
      abort.abort();
      for (const controller of exports.current) controller.abort();
    };
  }, [file, attempt]);
  const controller: SpreadsheetEditorController = {
    currencyFormat: props.currencyFormat,
    labels,
    registerDraft: (commit, dirty) => {
      draft.current = { commit, dirty };
      callbacks.current.onChange?.(
        (session.current?.revision ?? 0) + (dirty ? 1 : 0),
      );
    },
    apply: (edit) => {
      const active = session.current;
      if (!active || active.file !== file) return false;
      try {
        if (active.edits.length >= SPREADSHEET_EDITOR_LIMITS.operations)
          throw new Error("SPREADSHEET_OPERATION_LIMIT");
        const workbook = applySpreadsheetEdit(active.workbook, edit);
        if (workbook !== active.workbook) {
          session.current = {
            ...active,
            workbook,
            edits: [...active.edits, edit],
            revision: active.revision + 1,
          };
          setResult({ file, workbook });
          callbacks.current.onChange?.(active.revision + 1);
        }
        setEditError(false);
        return true;
      } catch {
        setEditError(true);
        return false;
      }
    },
  };
  const handle: SpreadsheetEditorHandle = {
    getRevision: () => {
      draft.current.commit?.();
      return session.current?.file === file ? session.current.revision : null;
    },
    focus: () =>
      containerRef.current
        ?.querySelector<HTMLElement>('[role="grid"]')
        ?.focus(),
    save: async () => {
      draft.current.commit?.();
      const active = session.current;
      if (!active || active.file !== file || draft.current.dirty)
        throw new Error("SPREADSHEET_NOT_READY");
      const abort = new AbortController();
      exports.current.add(abort);
      try {
        const { serializeSpreadsheet } =
          await import("../../utilities/editing/serialize");
        return await serializeSpreadsheet(
          active.bytes.slice(0),
          [...active.edits],
          abort.signal,
        );
      } finally {
        exports.current.delete(abort);
      }
    },
  };
  return {
    containerRef,
    controller,
    handle,
    labels,
    workbook: current?.workbook,
    error: current?.error,
    editError,
    retry: () => setAttempt((value) => value + 1),
  };
};
