import * as React from "react";

import { cn } from "@/utilities/index";

const CardTitle = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none text-base font-normal", className)}
      {...props}
    />
  );
};

export { CardTitle };
