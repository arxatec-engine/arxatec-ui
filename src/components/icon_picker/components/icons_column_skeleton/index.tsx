import { Skeleton } from "@/components/skeleton";

import { ICONS_PER_ROW } from "../../constants";

const IconsColumnSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full px-2">
      <Skeleton className="h-4 w-1/2 rounded-md" />
      <div
        className="grid gap-2 w-full"
        style={{
          gridTemplateColumns: `repeat(${ICONS_PER_ROW}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-md" />
        ))}
      </div>
    </div>
  );
};

export { IconsColumnSkeleton };
