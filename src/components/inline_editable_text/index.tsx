import { useEditableFields } from "@/components/editable_fields/hooks";
import {
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { cn } from "@/utilities/class";
import { INLINE_FIELD_ROW, SHARED_BOX } from "./constants";

export interface InlineEditableTextProps {
  value: string;
  onCommit: (value: string) => void;
  onChange?: (value: string) => void;
  onCancel?: () => void;
  ariaLabel: string;
  placeholder?: string;
  emptyText?: string;
  multiline?: boolean;
  disabled?: boolean;
  validate?: (value: string) => string | null;
  selectOnEdit?: boolean;
  className?: string;
  testId?: string;
}

const TEXTAREA_MAX_HEIGHT_PX = 320;

function resizeToContent(element: HTMLTextAreaElement) {
  element.style.height = "auto";
  element.style.height = `${Math.min(element.scrollHeight, TEXTAREA_MAX_HEIGHT_PX)}px`;
}

export function InlineEditableText({
  value,
  onCommit,
  onChange,
  onCancel,
  ariaLabel,
  placeholder,
  emptyText,
  multiline = false,
  disabled = false,
  validate,
  selectOnEdit = false,
  className,
  testId,
}: InlineEditableTextProps) {
  const { labels } = useEditableFields();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const skipNextBlurRef = useRef(false);

  useLayoutEffect(() => {
    if (!isEditing) return;
    const element = inputRef.current;
    if (!element) return;

    element.focus();
    if (selectOnEdit) {
      element.select();
    } else {
      const end = element.value.length;
      element.setSelectionRange(end, end);
    }
    if (element instanceof HTMLTextAreaElement) resizeToContent(element);
  }, [isEditing, selectOnEdit]);

  const startEditing = () => {
    if (disabled) return;
    setDraft(value);
    setError(null);
    setIsEditing(true);
  };

  const cancel = () => {
    skipNextBlurRef.current = true;
    onCancel?.();
    setDraft(value);
    setError(null);
    setIsEditing(false);
  };

  const commit = () => {
    const next = draft.trim();

    const invalid = validate?.(next) ?? null;
    if (invalid !== null) {
      setError(invalid);
      skipNextBlurRef.current = true;
      inputRef.current?.focus();
      return;
    }

    setIsEditing(false);
    setError(null);
    if (next === value) return;
    setDraft(next);
    onCommit(next);
  };

  const handleChange = (next: string) => {
    setDraft(next);
    onChange?.(next);
  };

  const onKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      cancel();
      return;
    }

    if (event.key !== "Enter") return;

    if (multiline && !event.metaKey && !event.ctrlKey) return;

    event.preventDefault();
    commit();
  };

  const onBlur = () => {
    if (skipNextBlurRef.current) {
      skipNextBlurRef.current = false;
      return;
    }
    commit();
  };

  if (isEditing) {
    const editClassName = cn(
      SHARED_BOX,
      "border-input bg-card outline-none transition-colors",
      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
      error && "border-destructive",
      className,
    );

    return (
      <div>
        {multiline ? (
          <textarea
            ref={(node) => {
              inputRef.current = node;
            }}
            aria-label={ariaLabel}
            aria-invalid={error !== null}
            data-testid={testId}
            rows={1}
            value={draft}
            placeholder={placeholder ?? labels.empty}
            className={cn(editClassName, "resize-none overflow-y-auto")}
            onChange={(event) => {
              handleChange(event.target.value);
              resizeToContent(event.target);
            }}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
          />
        ) : (
          <input
            ref={(node) => {
              inputRef.current = node;
            }}
            aria-label={ariaLabel}
            aria-invalid={error !== null}
            data-testid={testId}
            value={draft}
            placeholder={placeholder ?? labels.empty}
            className={editClassName}
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
          />
        )}
        {error ? (
          <p
            className="mt-1 text-xs text-destructive"
            data-testid={testId ? `${testId}-error` : undefined}
          >
            {error}
          </p>
        ) : null}
        <p className="sr-only">{labels.hint}</p>
      </div>
    );
  }

  const isEmpty = value.trim() === "";

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      data-testid={testId}
      disabled={disabled}
      onClick={startEditing}
      className={cn(
        INLINE_FIELD_ROW,
        "disabled:pointer-events-none disabled:opacity-50",
        multiline ? "whitespace-pre-wrap break-words" : "truncate",
        isEmpty && "text-muted-foreground",
        className,
      )}
    >
      {isEmpty ? (emptyText ?? placeholder ?? labels.empty) : value}
    </button>
  );
}
