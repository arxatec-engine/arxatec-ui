import { useEffect, useState, useSyncExternalStore } from "react";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const subscribeToColorScheme = (onChange: () => void) => {
  const media = window.matchMedia(COLOR_SCHEME_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

const prefersDarkColorScheme = () =>
  window.matchMedia(COLOR_SCHEME_QUERY).matches;

export const useGuideAppearance = (initialTheme?: "light" | "dark") => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(
    initialTheme ?? "system",
  );
  const systemIsDark = useSyncExternalStore(
    subscribeToColorScheme,
    prefersDarkColorScheme,
  );
  const isDark = theme === "dark" || (theme === "system" && systemIsDark);

  useEffect(() => {
    const root = document.documentElement;
    const previousScale = root.style.getPropertyValue("--font-scale");
    const previousPriority = root.style.getPropertyPriority("--font-scale");
    const previousLanguage = root.lang;
    const previousGuideAttribute = root.getAttribute("data-style-guide");
    const previousColorScheme = root.style.colorScheme;
    const favicon = document.querySelector<HTMLLinkElement>("#app-favicon");
    const previousFavicon = favicon?.getAttribute("href");
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
      root.style.colorScheme = previousColorScheme;
      if (favicon && previousFavicon !== undefined) {
        if (previousFavicon === null) favicon.removeAttribute("href");
        else favicon.setAttribute("href", previousFavicon);
      }
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
    const favicon = document.querySelector<HTMLLinkElement>("#app-favicon");
    if (favicon)
      favicon.href = new URL(
        isDark ? "favicon_dark.svg" : "favicon_light.svg",
        favicon.href,
      ).href;
  }, [isDark]);

  return {
    isDark,
    setIsDark: (isDark: boolean) => setTheme(isDark ? "dark" : "light"),
  };
};
