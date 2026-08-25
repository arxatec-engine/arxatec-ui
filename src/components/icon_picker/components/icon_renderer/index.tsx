import * as React from "react";
import { type IconName } from "lucide-react/dynamic";

import { Icon } from "../icon";

const IconRenderer = React.memo(({ name }: { name: IconName }) => {
  return <Icon name={name} className="size-full" />;
});
IconRenderer.displayName = "IconRenderer";

export { IconRenderer };
