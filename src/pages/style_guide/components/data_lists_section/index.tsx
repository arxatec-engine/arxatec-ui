import { ShowcaseBlock } from "../showcase_block";

import { ChartExample } from "./components/chart_example";
import { CompositionExamples } from "./components/composition_examples";
import { ListExamples } from "./components/list_examples";

export const DataListsSection = () => (
  <ShowcaseBlock
    id="datos"
    title="Datos y composición"
    description="Encontrar información, leer patrones y adaptar el espacio a cada tarea."
  >
    <ListExamples />
    <CompositionExamples />
    <ChartExample />
  </ShowcaseBlock>
);
