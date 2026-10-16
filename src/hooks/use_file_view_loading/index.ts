import { useCallback, useMemo, useState } from "react";

export const useFileViewLoading = () => {
  const [sources, setSources] = useState<Record<string, boolean>>({});

  const setSourceLoading = useCallback((source: string, isLoading: boolean) => {
    setSources((current) => {
      if (current[source] === isLoading) return current;
      return { ...current, [source]: isLoading };
    });
  }, []);

  const isLoading = useMemo(
    () => Object.values(sources).some(Boolean),
    [sources],
  );

  return { isLoading, setSourceLoading };
};
