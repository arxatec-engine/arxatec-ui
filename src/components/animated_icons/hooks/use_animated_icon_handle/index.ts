import type { ForwardedRef, HTMLAttributes } from "react";
import { useImperativeHandle, useRef } from "react";

import type { AnimatedIconHandle } from "../use_animated_icon";

interface Params {
  ref: ForwardedRef<AnimatedIconHandle>;
  start: () => void;
  stop: () => void;
  onMouseEnter?: HTMLAttributes<HTMLDivElement>["onMouseEnter"];
  onMouseLeave?: HTMLAttributes<HTMLDivElement>["onMouseLeave"];
}

type HoverHandlers = Pick<
  HTMLAttributes<HTMLDivElement>,
  "onMouseEnter" | "onMouseLeave"
>;

/**
 * Publica el handle imperativo del icono y devuelve los handlers del contenedor.
 *
 * El icono se anima solo al hover mientras nadie le pase un `ref`. En cuanto un
 * consumidor lo hace, la animación pasa a ser suya —típicamente para dispararla
 * desde el hover del botón que lo envuelve— y el icono se limita a reenviarle
 * los eventos de ratón. React solo ejecuta el factory de `useImperativeHandle`
 * cuando hay `ref`, y eso es justo lo que marca el cambio de dueño.
 */
export const useAnimatedIconHandle = ({
  ref,
  start,
  stop,
  onMouseEnter,
  onMouseLeave,
}: Params): HoverHandlers => {
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return { startAnimation: start, stopAnimation: stop };
  });

  return {
    onMouseEnter: (event) => {
      if (isControlledRef.current) onMouseEnter?.(event);
      else start();
    },
    onMouseLeave: (event) => {
      if (isControlledRef.current) onMouseLeave?.(event);
      else stop();
    },
  };
};
