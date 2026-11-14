import { forwardRef, type ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";
import { cn } from "@/utilities/class";

interface Props extends ComponentProps<typeof Button> {
  label: string;
  icon: LucideIcon;
  showTooltip?: boolean;
}

export const ViewerFloatingBarButton = forwardRef<HTMLButtonElement, Props>(
  ({ label, icon: Icon, className, showTooltip = true, ...props }, ref) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          data-slot="viewer-floating-bar-button"
          type="button"
          variant="ghost"
          size="icon"
          aria-label={label}
          className={cn("size-8 shrink-0", className)}
          {...props}
        >
          <Icon className="size-4" aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      {showTooltip && <TooltipContent>{label}</TooltipContent>}
    </Tooltip>
  ),
);

ViewerFloatingBarButton.displayName = "ViewerFloatingBarButton";
