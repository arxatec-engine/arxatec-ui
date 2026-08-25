import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

const ContextMenuSub = ({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) => {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
};

export { ContextMenuSub };
