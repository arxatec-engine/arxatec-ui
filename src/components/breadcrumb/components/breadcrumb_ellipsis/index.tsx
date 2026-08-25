import * as React from "react";
import { MoreHorizontal } from "lucide-react";

import { cn } from "@/utilities/index";

const BreadcrumbEllipsis = ({
  className,
  srLabel = "More",
  ...props
}: React.ComponentProps<"span"> & {
  /** Texto que anuncian los lectores de pantalla en lugar de los puntos. */
  srLabel?: string;
}) => {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">{srLabel}</span>
    </span>
  );
};

export { BreadcrumbEllipsis };
