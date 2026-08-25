import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";

const CommandEmpty = ({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) => {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  );
};

export { CommandEmpty };
