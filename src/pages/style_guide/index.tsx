import { MotionConfig } from "motion/react";

import { Toaster } from "@/components/sonner";
import { TooltipProvider } from "@/components/tooltip";

import {
  ActionsSection,
  BrandingFeedbackSection,
  FormsSection,
  GuideHeader,
  HeroSection,
  NavigationSection,
  StyleGuideFooter,
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
            className="mx-auto w-full min-w-0 max-w-6xl divide-y"
            tabIndex={-1}
          >
            <div className="flex flex-col items-center justify-center px-6 py-4">
              <HeroSection />
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-4">
              <ActionsSection />
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-4">
              <FormsSection />
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-4">
              <BrandingFeedbackSection />
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-4">
              <NavigationSection />
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-4">
              <StyleGuideFooter />
            </div>
          </main>
        </div>
      </TooltipProvider>
    </MotionConfig>
  );
};
