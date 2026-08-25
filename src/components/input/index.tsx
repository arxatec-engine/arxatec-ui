/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/utilities/index";

import { inputVariants } from "./constants";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Input = ({
  className,
  type,
  size,
  ref,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) => {
  const [showPassword, setShowPassword] = React.useState(false);

  if (type === "password") {
    return (
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(inputVariants({ size, className }))}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-muted-foreground focus:outline-none"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeIcon className="w-4 h-4" />
          ) : (
            <EyeOffIcon className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  }
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, className }))}
      ref={ref}
      {...props}
    />
  );
};

export { Input };
export { inputVariants } from "./constants";
