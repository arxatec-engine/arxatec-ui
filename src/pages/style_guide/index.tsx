import { MotionConfig } from "motion/react";

import { Toaster } from "@/components/sonner";
import { TooltipProvider } from "@/components/tooltip";

import {
  ActionsSection,
  BrandingFeedbackSection,
  DataListsSection,
  FormsSection,
  GuideHeader,
  HeroSection,
  MediaGeoSection,
  NavigationSection,
  StyleGuideFooter,
  TablesPaginationSection,
} from "./components";
import { useGuideAppearance } from "./hooks/use_guide_appearance";
import "./styles.css";

interface Props {
  initialTheme?: "light" | "dark";
}

export const StyleGuide = ({ initialTheme }: Props) => {
  const { isDark, setIsDark } = useGuideAppearance(initialTheme);

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <div className="style-guide min-h-screen bg-background font-sans text-foreground antialiased">
          <a className="guide-skip-link" href="#contenido">
            Saltar al contenido
          </a>
          <Toaster position="bottom-right" />
          <GuideHeader isDark={isDark} onDarkChange={setIsDark} />
          <main
            id="contenido"
            className="mx-auto w-full min-w-0 max-w-6xl space-y-20 px-5 pb-16 pt-8 sm:px-10 lg:pt-12"
            tabIndex={-1}
          >
            <HeroSection />
            <ActionsSection />
            <FormsSection />
            <BrandingFeedbackSection />
            <NavigationSection />
            <DataListsSection />
            <MediaGeoSection />
            <TablesPaginationSection />
            <StyleGuideFooter />
          </main>
        </div>
      </TooltipProvider>
    </MotionConfig>
  );
};
