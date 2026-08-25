"use client";

import { AnimatePresence, motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/utilities/index";

import { DOTS, VARIANTS } from "./constants";

import type { AnimatedIconHandle } from "../../hooks/use_animated_icon";
import { useAnimatedIconHandle } from "../../hooks/use_animated_icon_handle";

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CalendarDaysIcon = forwardRef<AnimatedIconHandle, Props>(
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
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect height="18" rx="2" width="18" x="3" y="4" />
          <path d="M3 10h18" />
          <AnimatePresence>
            {DOTS.map((dot, index) => (
              <motion.circle
                animate={controls}
                custom={index}
                cx={dot.cx}
                cy={dot.cy}
                fill="currentColor"
                initial="normal"
                key={`${dot.cx}-${dot.cy}`}
                r="1"
                stroke="none"
                variants={VARIANTS}
              />
            ))}
          </AnimatePresence>
        </svg>
      </div>
    );
  }
);

CalendarDaysIcon.displayName = "CalendarDaysIcon";

export { CalendarDaysIcon };
