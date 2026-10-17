import { ShowcaseBlock } from "../showcase_block";

import { ContextExamples } from "./components/context_examples";
import { NavigationExamples } from "./components/navigation_examples";
import { OverlayExamples } from "./components/overlay_examples";
import { SidebarExample } from "./components/sidebar_example";

export const NavigationSection = () => (
  <ShowcaseBlock
    id="navegacion"
    title="Navegación y superficies"
    description="Orientar, organizar y mostrar más información sin perder el contexto."
  >
    <NavigationExamples />
    <SidebarExample />
    <OverlayExamples />
    <ContextExamples />
  </ShowcaseBlock>
);
