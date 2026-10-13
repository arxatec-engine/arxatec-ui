import { useEditableFields } from "@/components/editable_fields/hooks";
import { DescriptionMarkdownEditor } from "@/components/description_markdown_editor";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
} from "react";
import { cn } from "@/utilities/class";
import { INLINE_FIELD_ROW } from "../inline_editable_text/constants";

export interface InlineMarkdownFieldProps {
  value: string;
  onCommit: (value: string) => void;
  onChange?: (value: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  collapsible?: boolean;
  testId?: string;
  ariaLabel?: string;
  editorClassName?: string;
}

function focusEditor(container: HTMLElement | null) {
  const editable = container?.querySelector<HTMLElement>(
    '[contenteditable="true"]',
  );
  if (!editable) return;

  editable.focus();
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(editable);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

export const InlineMarkdownField = ({
  value,
  onCommit,
  onChange,
  onCancel,
  placeholder,
  emptyText,
  disabled = false,
  collapsible = false,
  testId,
  ariaLabel,
  editorClassName = "min-h-[120px] text-sm",
}: InlineMarkdownFieldProps) => {
  const { labels } = useEditableFields();

  const [draft, setDraft] = useState(value);
  const [isEditing, setIsEditing] = useState(!collapsible);
  const serverRef = useRef(value);
  const isFocusedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value === serverRef.current) return;
    serverRef.current = value;
    if (isFocusedRef.current) return;
    setDraft(value);
  }, [value]);

  useLayoutEffect(() => {
    if (!collapsible || !isEditing) return;
    focusEditor(containerRef.current);
  }, [collapsible, isEditing]);

  const close = () => {
    if (collapsible) setIsEditing(false);
  };

  const commit = () => {
    close();
    if (draft === value) return;
    onCommit(draft);
  };

  const cancel = () => {
    onCancel?.();
    setDraft(value);
    close();
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    isFocusedRef.current = false;
    commit();
  };

  if (collapsible && !isEditing) {
    const isEmpty = value.trim() === "";

    return (
      <button
        type="button"
        aria-label={ariaLabel}
        data-testid={testId}
        disabled={disabled}
        onClick={() => {
          setDraft(value);
          setIsEditing(true);
        }}
        className={cn(
          INLINE_FIELD_ROW,
          "line-clamp-3 whitespace-pre-wrap break-words",
          "disabled:pointer-events-none disabled:opacity-50",
          isEmpty && "text-muted-foreground",
        )}
      >
        {isEmpty ? (emptyText ?? placeholder ?? labels.empty) : value}
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      data-testid={testId}
      onFocus={() => {
        isFocusedRef.current = true;
      }}
      onBlur={handleBlur}
    >
      <DescriptionMarkdownEditor
        value={draft}
        onChange={(markdown) => {
          setDraft(markdown);
          onChange?.(markdown);
        }}
        onSubmit={commit}
        onEscape={cancel}
        placeholder={placeholder}
        disabled={disabled}
        editorClassName={editorClassName}
      />
    </div>
  );
};
