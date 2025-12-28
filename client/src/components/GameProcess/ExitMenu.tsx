import React from "react";
import { useTranslation } from "react-i18next";

import { ExitMenuProps } from "@/types/components";

export const ExitMenu: React.FC<ExitMenuProps> = ({ onClose, onConfirm }) => {
  const { t } = useTranslation("common");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative flex h-[172px] w-[316px] flex-col items-center rounded-lg bg-[#47444C] px-4 py-4">
        <div className="flex h-[91px] items-center justify-center text-center">
          <p className="px-[16px] text-lg font-semibold leading-relaxed text-white">
            {t("exit_confirmation_text")}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 flex w-full">
          <button
            className="h-[49px] w-[164px] border-r border-t border-white border-opacity-10 font-semibold text-white transition-colors duration-200 hover:bg-white hover:bg-opacity-5"
            onClick={onConfirm}
          >
            {t("yes")}
          </button>
          <button
            className="h-[49px] w-[164px] border-t border-white border-opacity-10 font-semibold text-white transition-colors duration-200 hover:bg-white hover:bg-opacity-5"
            onClick={onClose}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};
