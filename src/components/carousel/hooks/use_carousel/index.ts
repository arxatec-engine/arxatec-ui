import * as React from "react";

import type { CarouselContextProps } from "../../types";

/**
 * Context interno del compound (R15): es como `Carousel` comparte la API de
 * embla con sus partes sin obligar al consumidor a cablear nada. No se exporta
 * desde el `index.tsx`.
 */
export const CarouselContext = React.createContext<CarouselContextProps | null>(
  null
);

export const useCarousel = () => {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
};
