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
            className="mx-auto w-full min-w-0 max-w-6xl space-y-20 pb-16 pt-8 lg:pt-12"
            tabIndex={-1}
          >
            <div className="px-6">
              <HeroSection />
            </div>
            <div className="px-6">
              <ActionsSection />
            </div>
            <div className="px-6">
              <FormsSection />
            </div>
            <div className="px-6">
              <BrandingFeedbackSection />
            </div>
            <div className="px-6">
              <NavigationSection />
            </div>
            <div className="px-6">
              <DataListsSection />
            </div>
            <div className="px-6">
              <MediaGeoSection />
            </div>
            <div className="px-6">
              <TablesPaginationSection />
            </div>
            <div className="px-6">
              <StyleGuideFooter />
            </div>
          </main>
        </div>
      </TooltipProvider>
    </MotionConfig>
  );
};
