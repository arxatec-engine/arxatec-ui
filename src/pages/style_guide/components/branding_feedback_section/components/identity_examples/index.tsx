import { Isotype } from "@/components/isotype";
import { Logo } from "@/components/logo";

import { ComponentPreview } from "../../../component_preview";

export const IdentityExamples = () => (
  <ComponentPreview
    title="Logo · Isotype"
    description="El logotipo identifica la marca. El isotipo conserva su reconocimiento en espacios pequeños."
  >
    <div className="flex flex-wrap items-center justify-center gap-6 py-5">
      <span role="img" aria-label="Isotipo de Arxatec">
        <Isotype className="size-10" />
      </span>
      <span role="img" aria-label="Arxatec Design">
        <Logo variant="design" className="h-auto w-48 max-w-full" />
      </span>
    </div>
  </ComponentPreview>
);
