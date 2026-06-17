import { Skeleton } from "@/components/skeleton";
import { cn } from "@/utilities/class";

interface Props {
  className?: string;
}
export const LoadingState = ({ className }: Props) => {
  return <Skeleton className={cn("w-full h-full", className)} />;
};
