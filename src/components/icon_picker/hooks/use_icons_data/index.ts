import { useEffect, useState } from "react";
import { dynamicIconImports } from "lucide-react/dynamic";

import type { IconData } from "../../types";

/**
 * El catálogo son cientos de KB: se carga con `import()` en cuanto el picker se
 * monta, no en el bundle inicial. Se filtran los iconos que el `DynamicIcon` de
 * lucide no sabe resolver.
 */
export const useIconsData = () => {
  const [icons, setIcons] = useState<IconData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadIcons = async () => {
      setIsLoading(true);

      const { iconsData } = await import("../../icons_data");
      if (isMounted) {
        setIcons(
          iconsData.filter((icon: IconData) => {
            return icon.name in dynamicIconImports;
          })
        );
        setIsLoading(false);
      }
    };

    loadIcons();

    return () => {
      isMounted = false;
    };
  }, []);

  return { icons, isLoading };
};
