import { type VariantProps } from "class-variance-authority";

import { cn } from "@/utilities/index";

import { buttonGroupVariants } from "../../constants";

const ButtonGroup = ({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) => {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
};

export { ButtonGroup };
