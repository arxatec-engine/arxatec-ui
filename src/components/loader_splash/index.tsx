import { useState, useEffect } from "react";
import { Logo } from "../logo";

const INITIAL_PHRASE = "Estamos cargando la aplicación...";
const INITIAL_DELAY_MS = 1000;

const phrases = [
  "cargando la plataforma...",
  "cargando los casos...",
  "cargando usuarios...",
  "preparando todo para ti...",
];

export const LoaderSplash = () => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [characterIndex, setCharacterIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationStarted(true), INITIAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!animationStarted) return;

    const interval = setInterval(
      () => {
        const fullPhrase = phrases[currentPhrase];

        if (isTyping) {
          if (characterIndex < fullPhrase.length) {
            setDisplayedText(fullPhrase.substring(0, characterIndex + 1));
            setCharacterIndex(characterIndex + 1);
          } else {
            setTimeout(() => setIsTyping(false), 500);
          }
        } else {
          if (characterIndex > 0) {
            setDisplayedText(fullPhrase.substring(0, characterIndex - 1));
            setCharacterIndex(characterIndex - 1);
          } else {
            setCurrentPhrase((prev) => (prev + 1) % phrases.length);
            setIsTyping(true);
          }
        }
      },
      isTyping ? 100 : 50
    );

    return () => clearInterval(interval);
  }, [animationStarted, currentPhrase, characterIndex, isTyping]);

  return (
    <div className="w-screen h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Logo className="w-32 h-10 text-primary mx-auto" />
        <p className="text-foreground text-sm font-normal h-6">
          {animationStarted ? (
            <>
              Estamos {displayedText}
              <span className="animate-pulse text-secondary-foreground">|</span>
            </>
          ) : (
            INITIAL_PHRASE
          )}
        </p>
      </div>
    </div>
  );
};
