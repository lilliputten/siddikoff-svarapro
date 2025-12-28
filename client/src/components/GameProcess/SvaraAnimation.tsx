import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import starIcon from "@/assets/game/star.png";

interface SvaraAnimationProps {
  onAnimationComplete: () => void;
}

export function SvaraAnimation({ onAnimationComplete }: SvaraAnimationProps) {
  const { t } = useTranslation("common");
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 3000); // Длительность анимации

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="animate-pulse-svara">
        <div className="mx-2 flex items-center">
          <img src={starIcon} alt="*" className="h-8 w-8" />
          <h1 className="mx-2 text-3xl font-semibold text-white">
            {t("svara")}
          </h1>
          <img src={starIcon} alt="*" className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
