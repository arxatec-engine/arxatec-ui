import type { CSSProperties } from "react";
import { Isotype } from "../isotype";
import styles from "./index.module.css";

interface LoaderSplashProps {
  shimmerOpacity?: number;
}

export const LoaderSplash = ({ shimmerOpacity = 1 }: LoaderSplashProps) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div
        className="relative size-14 text-primary"
        role="status"
        aria-busy="true"
        aria-label="Cargando"
        style={
          {
            "--loader-shimmer-opacity": shimmerOpacity,
          } as CSSProperties
        }
      >
        <Isotype className="size-full opacity-30" aria-hidden />
        <div className={styles.shimmer} aria-hidden>
          <Isotype className="size-full" />
        </div>
      </div>
    </div>
  );
};
