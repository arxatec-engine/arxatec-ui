import { useEffect, useState } from "react";

export const useGuideAppearance = (initialTheme?: "light" | "dark") => {
  const [isDark, setIsDark] = useState(() =>
    initialTheme
      ? initialTheme === "dark"
      : document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    const root = document.documentElement;
    const previousScale = root.style.getPropertyValue("--font-scale");
    const previousPriority = root.style.getPropertyPriority("--font-scale");
    const previousLanguage = root.lang;
    const previousGuideAttribute = root.getAttribute("data-style-guide");
    const wasDark = root.classList.contains("dark");
    // Set the scale where derived tokens are computed, including portals.
    root.style.setProperty("--font-scale", "1.1");
    root.setAttribute("data-style-guide", "");
    root.lang = "es";
    return () => {
      if (previousScale)
        root.style.setProperty("--font-scale", previousScale, previousPriority);
      else root.style.removeProperty("--font-scale");
      root.lang = previousLanguage;
      if (previousGuideAttribute === null)
        root.removeAttribute("data-style-guide");
      else root.setAttribute("data-style-guide", previousGuideAttribute);
      root.classList.toggle("dark", wasDark);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return { isDark, setIsDark };
};
