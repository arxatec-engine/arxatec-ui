import { MotionConfig } from "motion/react";

import { Toaster } from "@/components/sonner";
import { TooltipProvider } from "@/components/tooltip";

import {
  ActionsSection,
  BrandingFeedbackSection,
  DataListsSection,
  FormsSection,
  GuideHeader,
  GuideNavigation,
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
          <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-8 sm:px-10 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-16 lg:pt-12">
            <GuideNavigation />
            <main id="contenido" className="min-w-0 space-y-20" tabIndex={-1}>
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
        </div>
      </TooltipProvider>
    </MotionConfig>
  );
};
