import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { LoadingPage } from "@/components/LoadingPage";
import completeIcon from "@/assets/completeSmallGreen.png";
import incompleteIcon from "@/assets/completeSmallGrey.png";
import lockIcon from "@/assets/lock.png";
import { apiService } from "@/services/api/api";
import { ConnectRoomProps } from "@/types/components";

export const ConnectRoom: React.FC<ConnectRoomProps> = ({ onClose, openModal, setCurrentPage }) => {
  const { t } = useTranslation("common");
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue(value);
      setIsValid(value.length >= 6);
    }
  };

  const handleJoin = async () => {
    if (!isValid) return;
    setIsJoining(true);
    setIsLoading(true);
    setError(null);
    try {
      if (!window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        throw new Error("Telegram user ID not found");
      }
      await apiService.joinRoom(inputValue);
      onClose();
      setCurrentPage("gameRoom", { roomId: inputValue });
    } catch (error: unknown) {
      setError(
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
          "Failed to join room",
      );
      setIsLoading(false);
    } finally {
      setIsJoining(false);
    }
  };

  const handleCancel = () => {
    onClose();
    openModal();
  };

  if (isLoading) {
    return <LoadingPage isLoading={true} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative flex h-[172px] w-[316px] flex-col items-center rounded-lg bg-[#47444C] px-4 py-4">
        <h2 className="mb-4 text-lg font-semibold text-white">{t("join_room")}</h2>
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
            value={inputValue}
            onChange={handleInputChange}
            placeholder={t("password_for_entry")}
            className="h-12 w-full rounded-lg bg-[#13121780] pl-10 pr-10 text-center text-base font-normal text-white"
          />
          <img
            src={isValid ? completeIcon : incompleteIcon}
            alt="complete"
            className="absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2"
          />
        </div>
        <div className="absolute bottom-0 left-0 flex w-full">
          <button
            className="h-[49px] w-[164px] border-r border-t border-white border-opacity-10 text-[#5F8BE7] disabled:opacity-50"
            onClick={handleJoin}
            disabled={!isValid || isJoining}
          >
            {t("enter")}
          </button>
          <button
            className="h-[49px] w-[164px] border-t border-white border-opacity-10 text-[#5F8BE7]"
            onClick={handleCancel}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};
