import { ShowcaseBlock } from "../showcase_block";

import { FeedbackExamples } from "./components/feedback_examples";
import { IdentityExamples } from "./components/identity_examples";

export const BrandingFeedbackSection = () => (
  <ShowcaseBlock
    id="estados"
    title="Identidad y estados"
    description="Reconocer la marca y entender qué está pasando en cada momento."
  >
    <IdentityExamples />
    <FeedbackExamples />
  </ShowcaseBlock>
);
