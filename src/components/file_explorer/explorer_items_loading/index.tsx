import { Skeleton } from "../../skeleton";
export interface ExplorerItemsLoadingProps {
  count: number;
  isGrid?: boolean;
}
export function ExplorerItemsLoading({
  count,
  isGrid = true,
}: ExplorerItemsLoadingProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className={isGrid ? "h-45 rounded-md" : "h-9 rounded-md"}
        />
      ))}
    </>
  );
}
