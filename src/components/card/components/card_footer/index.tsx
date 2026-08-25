import * as React from "react";

import { cn } from "@/utilities/index";

const CardFooter = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-4 [.border-t]:pt-4", className)}
      {...props}
    />
  );
};

export { CardFooter };
