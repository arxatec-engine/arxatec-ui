import { iconNames } from "lucide-react/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { PAGE_SIZE, SCROLL_THRESHOLD } from "../../constants";

export const useIconPagination = () => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return iconNames;
    return iconNames.filter((name) => name.includes(term));
  }, [query]);

  const search = (next: string) => {
    setQuery(next);
    setLimit(PAGE_SIZE);
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || limit >= results.length) return;

    const loadMore = () => setLimit((current) => current + PAGE_SIZE);

    if (
      viewport.clientHeight > 0 &&
      viewport.scrollHeight <= viewport.clientHeight
    ) {
      loadMore();
      return;
    }

    const onScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = viewport;
      if (scrollTop + clientHeight < scrollHeight - SCROLL_THRESHOLD) return;
      loadMore();
    };

    viewport.addEventListener("scroll", onScroll);

    return () => viewport.removeEventListener("scroll", onScroll);
  }, [limit, results]);

  return {
    query,
    search,
    visible: results.slice(0, limit),
    isEmpty: results.length === 0,
    viewportRef,
  };
};
