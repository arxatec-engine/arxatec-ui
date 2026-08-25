import type { MouseEvent as ReactMouseEvent } from "react";

/** Evita que el clic en la barra robe el foco al editor de la anotación. */
export const toolbarMouseDown = (e: ReactMouseEvent) => {
  e.preventDefault();
};

/** Los mismos props de foco, en la forma que esperan los toolbars de fuente. */
export const keepEditorFocusProps = () => {
  return {
    onMouseDown: (e: ReactMouseEvent) => {
      e.preventDefault();
    },
  };
};

export const parsePresetPx = (size: string): number => {
  return Number.parseInt(size.replace("px", ""), 10);
};
