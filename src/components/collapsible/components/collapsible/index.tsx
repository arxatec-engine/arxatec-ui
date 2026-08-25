import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = ({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) => {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
};

export { Collapsible };
