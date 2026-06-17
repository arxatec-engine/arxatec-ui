import type { CSSProperties } from "react";
import { Isotype } from "../isotype";
import styles from "./index.module.css";
import { cn } from "@/utilities/class";

interface LoaderSplashProps {
  shimmerOpacity?: number;
  size?: number;
}

export const LoaderSplash = ({
  shimmerOpacity = 1,
  size = 2.5,
}: LoaderSplashProps) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background ">
      <div
        className={cn(`relative text-primary`)}
        role="status"
        aria-busy="true"
        aria-label="Cargando"
        style={
          {
            "--loader-shimmer-opacity": shimmerOpacity,
            width: `${size}rem`,
            height: `${size}rem`,
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
