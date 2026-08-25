import type { Transition } from "motion/react";

export const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 14,
  mass: 1,
};
