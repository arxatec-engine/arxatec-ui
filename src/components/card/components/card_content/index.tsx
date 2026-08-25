import * as React from "react";

import { cn } from "@/utilities/index";

const CardContent = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4", className)}
      {...props}
    />
  );
};

export { CardContent };
