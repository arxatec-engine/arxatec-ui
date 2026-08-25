
import { cn } from "@/utilities/index";
import { Separator } from "@/components/separator";


const ButtonGroupSeparator = ({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) => {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto",
        className
      )}
      {...props}
    />
  );
};

export { ButtonGroupSeparator };
