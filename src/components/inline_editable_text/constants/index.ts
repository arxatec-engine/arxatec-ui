import { cn } from "@/utilities/class";

export const SHARED_BOX =
  "-mx-2 w-full rounded-md border px-2 py-1 text-left text-sm";

export const INLINE_FIELD_ROW = cn(
  SHARED_BOX,
  "min-h-8 border-transparent transition-colors",
  "hover:border-input hover:bg-muted/40",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
);
