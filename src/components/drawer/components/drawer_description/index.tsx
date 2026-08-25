import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/utilities/index";

const DrawerDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) => {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
};

export { DrawerDescription };
