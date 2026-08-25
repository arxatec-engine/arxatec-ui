import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const CollapsibleContent = ({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) => {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
};

export { CollapsibleContent };
