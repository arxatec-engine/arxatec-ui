import { ShowcaseBlock } from "../showcase_block";

import { ChoiceExamples } from "./components/choice_examples";
import { TextFieldExamples } from "./components/text_field_examples";

export const FormsSection = () => (
  <ShowcaseBlock
    id="formularios"
    title="Formularios"
    description="Pedir lo necesario, con etiquetas claras y el control adecuado para cada dato."
  >
    <TextFieldExamples />
    <ChoiceExamples />
  </ShowcaseBlock>
);
