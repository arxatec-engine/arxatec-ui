import * as React from "react";

import type { ChartContextProps } from "../../types";

/**
 * Context interno del compound (R15): `ChartContainer` reparte la `config` a
 * tooltip y leyenda sin que el consumidor tenga que pasarla dos veces.
 */
export const ChartContext = React.createContext<ChartContextProps | null>(null);

export const useChart = () => {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
};
