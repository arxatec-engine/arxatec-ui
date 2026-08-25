"use client";

import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/utilities/index";

import { DEFAULT_TRANSITION, PATH_VARIANTS } from "./constants";

import type { AnimatedIconHandle } from "../../hooks/use_animated_icon";
import { useAnimatedIconHandle } from "../../hooks/use_animated_icon_handle";

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const PanelLeftCloseIcon = forwardRef<AnimatedIconHandle, Props>(
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
          <rect height="18" rx="2" width="18" x="3" y="3" />
          <path d="M9 3v18" />
          <motion.path
            animate={controls}
            d="m16 15-3-3 3-3"
            transition={DEFAULT_TRANSITION}
            variants={PATH_VARIANTS}
          />
        </svg>
      </div>
    );
  }
);

PanelLeftCloseIcon.displayName = "PanelLeftCloseIcon";

export { PanelLeftCloseIcon };
