import { AlertCircle, Check, Loader2 } from "lucide-react";
import type { AutosaveFieldState } from "../autosave_status/types";

export interface AutosaveFieldStatusProps {
  state?: AutosaveFieldState;
}

export const AutosaveFieldStatus = ({ state }: AutosaveFieldStatusProps) => (
  <>
    {state === "saving" ? <Loader2 className="size-3.5 animate-spin" /> : null}
    {state === "saved" ? <Check className="size-3.5" /> : null}
    {state === "error" ? (
      <AlertCircle className="size-3.5 text-destructive" />
    ) : null}
  </>
);
