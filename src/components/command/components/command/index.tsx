import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/utilities/index";

const Command = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) => {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-popover/70 backdrop-blur-lg text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className
      )}
      {...props}
    />
  );
};

export { Command };
