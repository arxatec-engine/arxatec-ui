import { Skeleton } from "../../skeleton";
import { cn } from "../../../utilities/class";

export interface ExplorerLoadingStateProps {
  className?: string;
}

export const ExplorerLoadingState = ({
  className,
}: ExplorerLoadingStateProps) => (
  <Skeleton className={cn("w-full h-[calc(100vh-80px)]", className)} />
);
