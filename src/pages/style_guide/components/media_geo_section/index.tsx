import { ShowcaseBlock } from "../showcase_block";

import { LocationExamples } from "./components/location_examples";
import { MediaExamples } from "./components/media_examples";
import { ProfileExamples } from "./components/profile_examples";

export const MediaGeoSection = () => (
  <ShowcaseBlock
    id="media"
    title="Media y ubicación"
    description="Poner cara a las personas, trabajar con archivos y dar contexto a un lugar."
  >
    <ProfileExamples />
    <MediaExamples />
    <LocationExamples />
  </ShowcaseBlock>
);
