import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import completeIcon from "@/assets/completeSmallGreen.png";
import incompleteIcon from "@/assets/completeSmallGrey.png";
import dollarIcon from "@/assets/dollar.png";
import { apiService } from "@/services/api/api";
import { CreatePublicProps } from "@/types/components";

export const CreatePublic: React.FC<CreatePublicProps> = ({
  onClose,
  openModal,
  setCurrentPage,
  balance,
  setNotification,
  setIsCreatingRoom,
}) => {
  const { t } = useTranslation("common");
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setInputValue(value);
      const numValue = parseFloat(value);
      setIsValid(!isNaN(numValue) && numValue >= 1);
    }
  };

  const hasEnoughBalance = parseFloat(balance) >= parseFloat(inputValue) * 10;

  const handleCreate = async () => {
    const stake = parseFloat(inputValue);
    const userBalance = parseFloat(balance);

    if (userBalance < stake * 10) {
      setNotification("insufficientBalance");
      return;
    }

    if (!isValid) return;

    setIsProcessing(true);
    setIsCreatingRoom(true);
    onClose(); // Close the modal

    const startTime = Date.now();
    try {
      const room = await apiService.createRoom(stake, "public");

      const elapsedTime = Date.now() - startTime;
      const remainingTime = 3000 - elapsedTime;

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      setCurrentPage("gameRoom", { roomId: room.roomId, autoSit: true });
    } catch (error) {
      console.error("Failed to create room:", error);
      setIsCreatingRoom(false); // Hide loading on error
      setNotification("gameJoinError"); // Show a generic error
    }
  };

  const handleCancel = () => {
    onClose();
    openModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative flex h-[172px] w-[316px] flex-col items-center rounded-lg bg-[#47444C] px-4 py-4">
        <h2 className="mb-4 text-lg font-semibold text-white">
          {t("create_room")}
        </h2>
        <div className="relative mb-4 w-full">
          <img
            src={dollarIcon}
            alt="dollar"
            className="absolute left-3 top-1/2 h-[17px] w-[11px] -translate-y-1/2"
          />
          <input
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={t("min_stake")}
            className="h-12 w-full rounded-lg bg-[#13121780] pl-10 pr-10 text-center text-base font-normal text-white"
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
            disabled={isProcessing || !isValid}
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
