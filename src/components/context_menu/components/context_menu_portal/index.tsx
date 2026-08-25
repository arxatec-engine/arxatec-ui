import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

const ContextMenuPortal = ({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) => {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
};

export { ContextMenuPortal };
