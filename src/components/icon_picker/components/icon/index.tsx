import * as React from "react";
import { type LucideIcon, type LucideProps } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

import { cn } from "@/utilities/index";

interface IconProps extends Omit<LucideProps, "ref"> {
  name: IconName;
}

const Icon = React.forwardRef<React.ComponentRef<LucideIcon>, IconProps>(
  ({ name, ...props }, ref) => {
    return (
      <DynamicIcon
        name={name}
        strokeWidth={2}
        {...props}
        ref={ref}
        className={cn(props.className)}
      />
    );
  }
);
Icon.displayName = "Icon";

export { Icon };
