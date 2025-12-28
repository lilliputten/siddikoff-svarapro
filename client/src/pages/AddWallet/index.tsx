import { useState } from "react";
import { useTranslation } from "react-i18next";

import { YellowButton } from "@/components/Button/YellowButton";
import { Notification } from "@/components/Notification";
import tetherIcon from "@/assets/tether.png";
import warningIcon from "@/assets/warning.svg";
import { apiService } from "@/services/api/api";
import { AddWalletProps } from "@/types/components";
import { ApiError } from "@/types/entities";

export function AddWallet({
  setCurrentPage,
  setWalletAddress,
}: AddWalletProps) {
  const [address, setAddress] = useState("");
  const [notification, setNotification] = useState<
    "invalidAddress" | "addressAlreadyUsed" | "addressAdded" | null
  >(null);
  const { t } = useTranslation("common");

  const handleAddWallet = async () => {
    if (address.length !== 48) {
      setNotification("invalidAddress");
      return;
    }

    try {
      await apiService.addWalletAddress(address);
      setNotification("addressAdded");

      // Обновляем состояние кошелька и переходим на страницу вывода
      setWalletAddress(address);
      setTimeout(() => {
        setCurrentPage("withdraw");
      }, 2000); // Даем время пользователю увидеть уведомление
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (typeof apiError === "string") {
        setNotification("invalidAddress");
      } else {
        const errorMessage = (
          apiError as { response?: { data?: { message: string } } }
        ).response?.data?.message;
        if (errorMessage === "Wallet address already in use") {
          setNotification("addressAlreadyUsed");
        } else if (errorMessage === "Invalid TON address format") {
          setNotification("invalidAddress");
        } else {
          setNotification("invalidAddress");
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-primary px-4 pt-4">
      <div className="w-[93vw]">
        <h2 className="mb-2 flex items-center text-left text-xl font-semibold leading-tight tracking-tighter text-white">
          {t("add_wallet_title")}{" "}
          <img src={tetherIcon} alt="USDT-TON" className="ml-2 h-6 w-6" />
        </h2>
        <p className="mb-4 text-left text-xl font-semibold leading-tight tracking-tighter text-white">
          {t("add_wallet_subtitle")}
        </p>
      </div>

      <div className="mb-4 flex h-[53px] w-[93vw] items-center rounded-lg bg-black bg-opacity-30 px-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t("usdt_ton_address_placeholder")}
          className="w-full bg-transparent text-left font-inter text-[17px] text-white placeholder-white placeholder-opacity-60 focus:outline-none"
          maxLength={48}
        />
      </div>

      <div className="mb-4 flex w-[93vw] items-center rounded-lg bg-red-900 bg-opacity-30 p-3 text-left">
        <img src={warningIcon} alt="Warning" className="mr-2 h-6 w-6" />
        <span className="font-inter text-xs text-white">
          {t("memo_warning")}
        </span>
      </div>

      <YellowButton
        size="lg"
        onClick={handleAddWallet}
        className="w-[93vw]"
        isActive={address.length === 48}
      >
        {t("add")}
      </YellowButton>

      <Notification type={notification} onClose={() => setNotification(null)} />
    </div>
  );
}
