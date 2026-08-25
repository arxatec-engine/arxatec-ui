import * as React from "react";
import { MinusIcon } from "lucide-react";

const InputOTPSeparator = ({ ...props }: React.ComponentProps<"div">) => {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
};

export { InputOTPSeparator };
