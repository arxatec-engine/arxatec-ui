import { Skeleton } from "@/components/skeleton";

const LoadingState = () => (
  <div className="p-4 h-full w-full">
    <Skeleton className="w-full h-full" />
  </div>
);

export { LoadingState };
