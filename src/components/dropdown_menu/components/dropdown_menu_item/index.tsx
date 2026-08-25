import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/utilities/index";
import { dropdownMenuItemVariants } from "../../constants";

const DropdownMenuItem = ({
  className,
  inset,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
} & VariantProps<typeof dropdownMenuItemVariants>) => {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      data-size={size}
      className={cn(dropdownMenuItemVariants({ size }), className)}
      {...props}
    />
  );
};

export { DropdownMenuItem };
