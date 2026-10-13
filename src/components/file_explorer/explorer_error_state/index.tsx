import { StatusMessage } from "../../status_message";
import { FolderX } from "lucide-react";
import { cn } from "../../../utilities/class";

export interface ExplorerErrorStateProps {
  title: string;
  description: string;
  className?: string;
}

export const ExplorerErrorState = ({
  title,
  description,
  className,
}: ExplorerErrorStateProps) => (
  <StatusMessage
    title={title}
    description={description}
    icon={FolderX}
    classNameCard={cn(
      "w-full h-[calc(100vh-80px)] flex-col items-center justify-center",
      className,
    )}
    classNameIconCard="mx-auto"
    classNameDescription="text-center w-full"
    classNameTitle="text-center w-full"
  />
);
