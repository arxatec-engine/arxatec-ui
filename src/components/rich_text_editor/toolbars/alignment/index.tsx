import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Check,
  ChevronDown,
} from "lucide-react";
import { useMediaQuery } from "@/hooks";
import { MobileToolbarGroup, MobileToolbarItem } from "../mobile_toolbar_group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "arxatec-ui";
import { useToolbar } from "../toolbar_provider";

export const AlignmentToolbar = () => {
  const { editor } = useToolbar();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const handleAlign = (value: string) => {
    editor?.chain().focus().setTextAlign(value).run();
  };

  const isDisabled =
    editor?.isActive("image") || editor?.isActive("video") || !editor;

  const currentTextAlign = () => {
    if (editor?.isActive({ textAlign: "left" })) {
      return "left";
    }
    if (editor?.isActive({ textAlign: "center" })) {
      return "center";
    }
    if (editor?.isActive({ textAlign: "right" })) {
      return "right";
    }
    if (editor?.isActive({ textAlign: "justify" })) {
      return "justify";
    }

    return "left";
  };

  const alignmentOptions = [
    {
      name: "Izquierda",
      value: "left",
      icon: <AlignLeft className="h-4 w-4" />,
    },
    {
      name: "Centrar",
      value: "center",
      icon: <AlignCenter className="h-4 w-4" />,
    },
    {
      name: "Derecha",
      value: "right",
      icon: <AlignRight className="h-4 w-4" />,
    },
    {
      name: "Justificar",
      value: "justify",
      icon: <AlignJustify className="h-4 w-4" />,
    },
  ];

  const findIndex = (value: string) => {
    return alignmentOptions.findIndex((option) => option.value === value);
  };

  if (isMobile) {
    return (
      <MobileToolbarGroup
        label={
          alignmentOptions[findIndex(currentTextAlign())]?.name ?? "Izquierda"
        }
      >
        {alignmentOptions.map((option, index) => (
          <MobileToolbarItem
            key={index}
            onClick={() => handleAlign(option.value)}
            active={currentTextAlign() === option.value}
          >
            <span className="mr-2">{option.icon}</span>
            {option.name}
          </MobileToolbarItem>
        ))}
      </MobileToolbarGroup>
    );
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger disabled={isDisabled} asChild>
            <Button variant="ghost" size="sm" className="h-8 w-max font-normal">
              <span className="mr-2">
                {alignmentOptions[findIndex(currentTextAlign())]?.icon}
              </span>
              {alignmentOptions[findIndex(currentTextAlign())]?.name}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Alineación de texto</TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        loop
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DropdownMenuGroup className=" w-40">
          {alignmentOptions.map((option, index) => (
            <DropdownMenuItem
              onSelect={() => {
                handleAlign(option.value);
              }}
              key={index}
            >
              <span className="mr-2">{option.icon}</span>
              {option.name}

              {option.value === currentTextAlign() && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
