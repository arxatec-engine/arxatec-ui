import * as React from "react";

import { cn } from "@/utilities/index";

const Card = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-4 rounded-md border py-4",
        className
      )}
      {...props}
    />
  );
};

export { Card };
