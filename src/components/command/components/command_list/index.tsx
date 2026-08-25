import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/utilities/index";
import { ScrollArea } from "@/components/scroll_area";

const CommandList = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) => {
  return (
    <ScrollArea className="h-[300px] w-full min-w-0 overflow-x-hidden">
      <CommandPrimitive.List
        data-slot="command-list"
        className={cn(
          "scroll-py-1 overflow-x-hidden overflow-y-auto w-full max-w-full min-w-0",
          className
        )}
        {...props}
      />
    </ScrollArea>
  );
};

export { CommandList };
