import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip";

interface Props {
  info: string;
}

export const InfoTooltip: React.FC<Props> = ({ info }) => {
  return (
    <Tooltip>
      <TooltipTrigger className="p-1! bg-secondary rounded-md">
        <Info className="size-3 text-secondary-foreground" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs w-full">
        <p className="text-pretty">{info}</p>
      </TooltipContent>
    </Tooltip>
  );
};
