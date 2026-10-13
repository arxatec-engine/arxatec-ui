import type { MouseEvent } from "react";

export const stopEvent = (event: MouseEvent) => {
  event.stopPropagation();
};
