import { useEditableFields } from "@/components/editable_fields/hooks";
import { Button } from "@/components/button";
import { AlertCircle, Check, CloudOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/utilities/class";
import { SAVED_LINGER_MS } from "./constants";
import type { AutosaveStatusValue } from "./types";

export interface AutosaveStatusProps {
  status: AutosaveStatusValue;
  errorMessage: string | null;
  isRetryable: boolean;
  onRetry: () => void;
  className?: string;
}

const SavedStatusCopy = () => {
  const { labels } = useEditableFields();
  const [hasLingered, setHasLingered] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setHasLingered(true), SAVED_LINGER_MS);
    return () => clearTimeout(timer);
  }, []);
  return <>{hasLingered ? labels.savedAgo : labels.saved}</>;
};

export const AutosaveStatus = ({
  status,
  errorMessage,
  isRetryable,
  onRetry,
  className,
}: AutosaveStatusProps) => {
  const { labels } = useEditableFields();

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-5 max-w-[55%] items-center gap-1.5 text-xs text-muted-foreground",
        status === "error" && "text-destructive",
        className,
      )}
    >
      {status === "saving" ? (
        <>
          <Loader2 className="size-3.5 shrink-0 animate-spin" />
          {labels.saving}
        </>
      ) : null}

      {status === "saved" ? (
        <>
          <Check className="size-3.5 shrink-0" />
          <SavedStatusCopy />
        </>
      ) : null}

      {status === "offline" ? (
        <>
          <CloudOff className="size-3.5 shrink-0" />
          {labels.offline}
        </>
      ) : null}

      {status === "error" ? (
        <>
          <AlertCircle className="size-3.5 shrink-0" />
          <span className="truncate">
            {errorMessage || labels.genericError}
          </span>
          {isRetryable ? (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs text-destructive underline"
              onClick={onRetry}
            >
              {labels.retry}
            </Button>
          ) : null}
        </>
      ) : null}
    </p>
  );
};
