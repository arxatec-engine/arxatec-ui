import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const CollapsibleTrigger = ({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) => {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
};

export { CollapsibleTrigger };
