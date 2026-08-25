"use client";

import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/utilities/index";

import { HAMMER_VARIANTS } from "./constants";

import type { AnimatedIconHandle } from "../../hooks/use_animated_icon";
import { useAnimatedIconHandle } from "../../hooks/use_animated_icon_handle";

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const HammerIcon = forwardRef<AnimatedIconHandle, Props>(
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
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          initial="normal"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          style={{ transformOrigin: "0% 100%", transformBox: "fill-box" }}
          variants={HAMMER_VARIANTS}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9" />
          <path d="m18 15 4-4" />
          <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
        </motion.svg>
      </div>
    );
  }
);

HammerIcon.displayName = "HammerIcon";

export { HammerIcon };
