import { Skeleton } from "@/components/skeleton";

export const LoadingState = () => {
  return (
    <div className="p-4 h-full w-full">
      <Skeleton className="w-full h-full" />
    </div>
  );
};
