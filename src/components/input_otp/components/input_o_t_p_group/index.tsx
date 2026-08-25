import * as React from "react";
import { cn } from "@/utilities/index";

const InputOTPGroup = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
};

export { InputOTPGroup };
