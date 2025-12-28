import { useState } from "react";
import { useTranslation } from "react-i18next";

import completeIcon from "@/assets/complete.png";
import cupIcon from "@/assets/cup.png";
import errorIcon from "@/assets/error.png";
import { NotificationProps } from "@/types/components";

const notificationContent = {
  invalidAddress: {
    icon: errorIcon,
    textKey: "invalid_address",
  },
  addressAlreadyUsed: {
    icon: errorIcon,
    textKey: "address_already_used",
  },
  addressAdded: {
    icon: completeIcon,
    textKey: "address_added",
  },
  comingSoon: {
    icon: cupIcon,
    textKey: "coming_soon",
  },
  insufficientBalance: {
    icon: errorIcon,
    textKey: "insufficient_balance_x3_error",
  },
  gameJoinError: {
    icon: errorIcon,
    textKey: "game_join_error",
  },
};

export function Notification({ type, onClose }: NotificationProps) {
  const { t } = useTranslation("common");
  const [isPressed, setIsPressed] = useState(false);

  if (!type) {
    return null;
  }

  const { icon, textKey } = notificationContent[type];

  const background = isPressed ? "#bebebe" : "transparent";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative flex h-[155px] w-[277px] flex-col items-center rounded-lg bg-[#47444C] px-4 py-4">
        <div className="mt-2 flex flex-col items-center text-center">
          <img src={icon} alt={type} className="mb-4 h-8 w-8" />
          <p className="text-sm font-semibold text-white">{t(textKey)}</p>
        </div>
        <div className="absolute bottom-[41px] left-1/2 h-px w-[270px] -translate-x-1/2 bg-white opacity-50" />
        <button
          onClick={onClose}
          className="absolute bottom-0 left-0 flex h-[39px] w-full items-center justify-center text-[17px] font-semibold text-white"
          style={{
            background: background,
            transition: "background 0.2s",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
        >
          {t("ok")}
        </button>
      </div>
    </div>
  );
}
