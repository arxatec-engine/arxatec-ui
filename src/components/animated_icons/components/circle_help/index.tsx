"use client";

import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/utilities/index";

import { VARIANTS } from "./constants";

import type { AnimatedIconHandle } from "../../hooks/use_animated_icon";
import { useAnimatedIconHandle } from "../../hooks/use_animated_icon_handle";

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CircleHelpIcon = forwardRef<AnimatedIconHandle, Props>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const hoverHandlers = useAnimatedIconHandle({
      ref,
      onMouseEnter,
      onMouseLeave,
      start: () => controls.start("animate"),
      stop: () => controls.start("normal"),
    });

    return (
      <div
        data-slot="animated-icon"
        className={cn(className)}
        {...hoverHandlers}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" />
          <motion.g
            animate={controls}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            variants={VARIANTS}
          >
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

CircleHelpIcon.displayName = "CircleHelpIcon";

export { CircleHelpIcon };
