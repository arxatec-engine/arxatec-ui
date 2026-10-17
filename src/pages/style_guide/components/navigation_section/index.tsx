import { ShowcaseBlock } from "../showcase_block";

import { NavigationExamples } from "./components/navigation_examples";
import { OverlayExamples } from "./components/overlay_examples";

export const NavigationSection = () => (
  <ShowcaseBlock
    id="navegacion"
    title="Navegación y diálogos"
    description="Alternar entre vistas y resolver una tarea puntual sin perder el contexto."
  >
    <NavigationExamples />
    <OverlayExamples />
  </ShowcaseBlock>
);
