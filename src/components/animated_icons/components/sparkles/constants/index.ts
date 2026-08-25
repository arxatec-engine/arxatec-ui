import type { Variants } from "motion/react";

export const SPARKLE_VARIANTS: Variants = {
  initial: {
    y: 0,
    fill: "none",
  },
  hover: {
    y: [0, -1, 0, 0],
    fill: "currentColor",
    transition: {
      duration: 1,
      bounce: 0.3,
    },
  },
};

export const STAR_VARIANTS: Variants = {
  initial: {
    opacity: 1,
    x: 0,
    y: 0,
  },
  blink: () => ({
    opacity: [0, 1, 0, 0, 0, 0, 1],
    transition: {
      duration: 2,
      type: "spring",
      stiffness: 70,
      damping: 10,
      mass: 0.4,
    },
  }),
};
