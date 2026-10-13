import "./styles.css";
import { Wifi, WifiOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/utilities/class";

const TRANSITION_MS = 300;
type Status = "offline" | "reconnected";

export interface OfflineBannerLabels {
  offline: string;
  reconnected: string;
  close: string;
}

export interface OfflineBannerProps {
  isOnline: boolean;
  labels?: Partial<OfflineBannerLabels>;
  className?: string;
  reconnectedDurationMs?: number;
}

interface ConnectionState {
  isOnline: boolean;
  status: Status | null;
  lastStatus: Status;
  mounted: boolean;
}

export function OfflineBanner({
  isOnline,
  labels,
  className,
  reconnectedDurationMs = 3000,
}: OfflineBannerProps) {
  const copy = {
    offline: "No tienes internet",
    reconnected: "Vuelves a estar conectado",
    close: "Cerrar",
    ...labels,
  };
  const [connection, setConnection] = useState<ConnectionState>(() => ({
    isOnline,
    status: isOnline ? null : "offline",
    lastStatus: "offline",
    mounted: !isOnline,
  }));

  if (connection.isOnline !== isOnline) {
    const status = isOnline ? "reconnected" : "offline";
    setConnection({ isOnline, status, lastStatus: status, mounted: true });
  }

  const { status, lastStatus, mounted } = connection;

  useEffect(() => {
    if (status !== "reconnected") return;
    const timer = setTimeout(
      () => setConnection((current) => ({ ...current, status: null })),
      reconnectedDurationMs,
    );
    return () => clearTimeout(timer);
  }, [status, reconnectedDurationMs]);

  useEffect(() => {
    if (status !== null || !mounted) return;
    const timer = setTimeout(
      () => setConnection((current) => ({ ...current, mounted: false })),
      TRANSITION_MS,
    );
    return () => clearTimeout(timer);
  }, [status, mounted]);

  if (!mounted) return null;
  const isOffline = lastStatus === "offline";
  const Icon = isOffline ? WifiOff : Wifi;

  return (
    <div
      role="status"
      aria-live="polite"
      data-state={status === null ? "closed" : "open"}
      className={cn(
        "arxatec-offline-banner fixed inset-x-0 top-0 z-[100]",
        "flex items-center justify-center gap-2",
        "py-2 pr-10 pl-4 text-center text-sm font-medium",
        "transition-all duration-300 ease-out border-border border-b",
        isOffline ? "bg-sidebar text-foreground" : "bg-primary text-background",
        status !== null
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0",
        className,
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      <span>{isOffline ? copy.offline : copy.reconnected}</span>
      {isOffline ? (
        <button
          type="button"
          onClick={() =>
            setConnection((current) => ({ ...current, status: null }))
          }
          aria-label={copy.close}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 opacity-80 transition-opacity hover:opacity-100"
        >
          <X className="size-4" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
