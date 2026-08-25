import type { Transition } from "motion/react";

import type { SliderLine } from "../types";

export const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 12,
  mass: 0.4,
};

/**
 * Tres controles deslizantes: por cada fila, los dos tramos de la guía y el
 * tirador vertical que los separa. Al animar, el tirador se desplaza y ambos
 * tramos se recortan o alargan para seguirlo, de ahí que cada línea mueva solo
 * el extremo que da al tirador.
 */
export const SLIDER_LINES: SliderLine[] = [
  // Fila superior: tirador de x=14 a x=9.
  { x1: 21, x2: 14, y1: 4, y2: 4, variants: { normal: { x2: 14 }, animate: { x2: 10 } } },
  { x1: 10, x2: 3, y1: 4, y2: 4, variants: { normal: { x1: 10 }, animate: { x1: 5 } } },
  { x1: 14, x2: 14, y1: 2, y2: 6, variants: { normal: { x1: 14, x2: 14 }, animate: { x1: 9, x2: 9 } } },
  // Fila central: tirador de x=8 a x=14.
  { x1: 21, x2: 12, y1: 12, y2: 12, variants: { normal: { x2: 12 }, animate: { x2: 18 } } },
  { x1: 8, x2: 3, y1: 12, y2: 12, variants: { normal: { x1: 8 }, animate: { x1: 13 } } },
  { x1: 8, x2: 8, y1: 10, y2: 14, variants: { normal: { x1: 8, x2: 8 }, animate: { x1: 14, x2: 14 } } },
  // Fila inferior: tirador de x=16 a x=8.
  { x1: 3, x2: 12, y1: 20, y2: 20, variants: { normal: { x2: 12 }, animate: { x2: 4 } } },
  { x1: 16, x2: 21, y1: 20, y2: 20, variants: { normal: { x1: 16 }, animate: { x1: 8 } } },
  { x1: 16, x2: 16, y1: 18, y2: 22, variants: { normal: { x1: 16, x2: 16 }, animate: { x1: 8, x2: 8 } } },
];
