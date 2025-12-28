import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import completeIcon from "@/assets/completeSmallGreen.png";
import incompleteIcon from "@/assets/completeSmallGrey.png";
import dollarIcon from "@/assets/dollar.png";
import lockIcon from "@/assets/lock.png";
import { apiService } from "@/services/api/api";
import { CreatePrivateProps } from "@/types/components";

export const CreatePrivate: React.FC<CreatePrivateProps> = ({
  onClose,
  openModal,
  setCurrentPage,
  balance,
  setNotification,
  setIsCreatingRoom,
}) => {
  const { t } = useTranslation("common");
  const [password, setPassword] = useState("");
  const [stake, setStake] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isStakeValid, setIsStakeValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPassword(value);
      setIsPasswordValid(value.length >= 6);
    }
  };

  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setStake(value);
      const numValue = parseFloat(value);
      setIsStakeValid(!isNaN(numValue) && numValue >= 1);
    }
  };

  const hasEnoughBalance = parseFloat(balance) >= parseFloat(stake) * 10;

  const handleCreate = async () => {
    const bet = parseFloat(stake);
    const userBalance = parseFloat(balance);

    if (userBalance < bet * 10) {
      setNotification("insufficientBalance");
      return;
    }

    if (!isPasswordValid || !isStakeValid) return;

    setIsProcessing(true);
    setError(null);
    setIsCreatingRoom(true);
    onClose(); // Close the modal

    const startTime = Date.now();
    try {
      const room = await apiService.createRoom(bet, "private", password);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = 3000 - elapsedTime;

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      setCurrentPage("gameRoom", { roomId: room.roomId, autoSit: true });
    } catch (error: unknown) {
      setError(
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
          "Failed to create room",
      );
      setIsCreatingRoom(false); // Hide loading on error
    }
  };

  const handleCancel = () => {
    onClose();
    openModal();
  };

  const isFormValid = isPasswordValid && isStakeValid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative flex h-[215px] w-[316px] flex-col items-center rounded-lg bg-[#47444C] px-4 py-4">
        <h2 className="mb-4 text-lg font-semibold text-white">{t("create_private_room")}</h2>
        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
        <div className="relative mb-4 w-full">
          <img
            src={lockIcon}
            alt="lock"
            className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2"
          />
          <input
            type="text"
            inputMode="numeric"
            value={password}
            onChange={handlePasswordChange}
            placeholder={t("come_up_with_a_password")}
            className="h-[36px] w-full rounded-lg bg-[#13121780] pl-10 pr-10 text-center text-base font-normal text-white"
          />
          <img
            src={isPasswordValid ? completeIcon : incompleteIcon}
            alt="complete"
            className="absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2"
          />
        </div>
        <div className="relative mb-4 w-full">
          <img
            src={dollarIcon}
            alt="dollar"
            className="absolute left-3 top-1/2 h-[17px] w-[11px] -translate-y-1/2"
          />
          <input
            type="text"
            inputMode="decimal"
            value={stake}
            onChange={handleStakeChange}
            placeholder={t("min_stake")}
            className="h-[36px] w-full rounded-lg bg-[#13121780] pl-10 pr-10 text-center text-base font-normal text-white"
          />
          <img
            src={hasEnoughBalance ? completeIcon : incompleteIcon}
            alt="complete"
            className="absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2"
          />
        </div>
        <div className="absolute bottom-0 left-0 flex w-full">
          <button
            className="h-[49px] w-[164px] border-r border-t border-white border-opacity-10 text-[#5F8BE7] disabled:opacity-50"
            onClick={handleCreate}
            disabled={!isFormValid || isProcessing}
          >
            {t("create")}
          </button>
          <button
            className="h-[49px] w-[164px] border-t border-white border-opacity-10 text-[#5F8BE7]"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};
