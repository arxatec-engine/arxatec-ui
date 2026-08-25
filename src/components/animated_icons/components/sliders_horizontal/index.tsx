"use client";

import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/utilities/index";

import { DEFAULT_TRANSITION, SLIDER_LINES } from "./constants";

import type { AnimatedIconHandle } from "../../hooks/use_animated_icon";
import { useAnimatedIconHandle } from "../../hooks/use_animated_icon_handle";

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SlidersHorizontalIcon = forwardRef<AnimatedIconHandle, Props>(
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
          {SLIDER_LINES.map(({ variants, ...line }) => (
            <motion.line
              key={`${line.x1}-${line.x2}-${line.y1}-${line.y2}`}
              animate={controls}
              transition={DEFAULT_TRANSITION}
              variants={variants}
              {...line}
            />
          ))}
        </svg>
      </div>
    );
  }
);

SlidersHorizontalIcon.displayName = "SlidersHorizontalIcon";

export { SlidersHorizontalIcon };
