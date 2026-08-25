import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

const DrawerClose = ({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) => {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
};

export { DrawerClose };
