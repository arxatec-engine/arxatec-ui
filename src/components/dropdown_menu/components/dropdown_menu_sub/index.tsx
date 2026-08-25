import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

const DropdownMenuSub = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) => {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
};

export { DropdownMenuSub };
