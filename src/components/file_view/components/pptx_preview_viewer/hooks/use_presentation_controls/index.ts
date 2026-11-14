import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
} from "react";

export function usePresentationControls(presenting: boolean) {
  // A new presentation starts visible, even if the previous one ended idle.
  const session = useMemo(() => ({ presenting }), [presenting]);
  const [hiddenFor, setHiddenFor] = useState<typeof session | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hovering = useRef(false);
  const focused = useRef(false);

  const scheduleHide = useCallback(() => {
    clearTimeout(timeout.current);
    if (presenting && !hovering.current && !focused.current)
      timeout.current = setTimeout(() => setHiddenFor(session), 2500);
  }, [presenting, session]);

  const reveal = useCallback(() => {
    setHiddenFor(null);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    hovering.current = false;
    focused.current = false;
    scheduleHide();
    return () => clearTimeout(timeout.current);
  }, [scheduleHide]);

  return {
    visible: !presenting || hiddenFor !== session,
    reveal,
    onPointerEnter: () => {
      if (!presenting) return;
      hovering.current = true;
      reveal();
    },
    onPointerLeave: () => {
      hovering.current = false;
      reveal();
    },
    onFocusCapture: () => {
      if (!presenting) return;
      focused.current = true;
      reveal();
    },
    onBlurCapture: (event: FocusEvent<HTMLDivElement>) => {
      if (event.currentTarget.contains(event.relatedTarget)) return;
      focused.current = false;
      reveal();
    },
  };
}
