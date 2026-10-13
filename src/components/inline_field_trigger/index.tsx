import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utilities/class";
import { INLINE_FIELD_ROW } from "../inline_editable_text/constants";

export type InlineFieldTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const InlineFieldTrigger = forwardRef<
  HTMLButtonElement,
  InlineFieldTriggerProps
>(({ className, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(INLINE_FIELD_ROW, className)}
    {...props}
  />
));
InlineFieldTrigger.displayName = "InlineFieldTrigger";
