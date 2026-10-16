import { AlertCircle } from "lucide-react";

export interface InlineErrorMessageProps {
  message: string;
}

export const InlineErrorMessage = ({ message }: InlineErrorMessageProps) => (
  <p className="flex items-center gap-2 text-sm text-destructive">
    <AlertCircle className="size-4 shrink-0" />
    {message}
  </p>
);
