import { useState } from "react";
import { useTranslation } from "react-i18next";

import { YellowButton } from "@/components/Button/YellowButton";
import { LoadingPage } from "@/components/LoadingPage";
import { StyledContainer } from "@/components/StyledContainer";
import { apiService } from "@/services/api/api";
import { RoomProps } from "@/types/components";

export function Room({
  roomId,
  players,
  stake,
  setCurrentPage,
  balance,
  setNotification,
}: RoomProps) {
  const { t } = useTranslation("common");
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    setCurrentPage("gameRoom", { roomId, autoSit: true });
    const hasEnoughBalance = parseFloat(balance) >= stake * 10;
    if (!hasEnoughBalance) {
      setNotification("insufficientBalance");
      return;
    }

    setIsJoining(true);
    setIsLoading(true);

    try {
      await apiService.joinRoom(roomId);
      setCurrentPage("gameRoom", { roomId, autoSit: true });
    } catch (e) {
      const error = e as { response?: { data?: { message?: string } } };
      console.error("Failed to join room:", error);

      if (error.response?.data?.message?.includes("game already started")) {
        setCurrentPage("gameRoom", { roomId, autoSit: false });
      } else {
        setNotification("gameJoinError");
        setIsLoading(false);
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleWatch = async () => {
    setIsJoining(true);
    setIsLoading(true);
    try {
      setCurrentPage("gameRoom", { roomId, autoSit: false });
    } catch (error) {
      console.error("Failed to watch room:", error);
      setNotification("gameJoinError");
      setIsLoading(false);
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return <LoadingPage isLoading={true} />;
  }

  return (
    <StyledContainer className="h-[105px] w-[100%] rounded-[15px] p-4">
      <div
        className="grid"
        style={{
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gridTemplateRows: "auto auto",
          gap: "6px 25px",
        }}
      >
        <p className="m-0 text-center text-sm font-semibold text-[#C9C6CE]">
          {t("room")}
        </p>
        <p className="m-0 text-center text-sm font-semibold text-[#C9C6CE]">
          {t("players")}
        </p>
        <p className="m-0 text-center text-sm font-semibold text-[#C9C6CE]">
          {t("stake")}
        </p>
        <YellowButton
          style={{ marginTop: "5px" }}
          onClick={handleJoin}
          disabled={isJoining}
        >
          {t("enter")}
        </YellowButton>
        <div
          style={{
            position: "absolute",
            left: "5px",
            right: "30%",
            top: "50%",
            height: "1px",
            background: "#FFFFFF",
            opacity: 0.05,
          }}
        />
        <p className="m-0 text-left text-base font-semibold text-white">
          №{roomId.slice(0, 8)}
        </p>
        <p className="m-0 text-center text-base font-semibold">
          <span style={{ color: "#12B754" }}>{players}</span>
          <span className="text-white"> / 6</span>
        </p>
        <p className="m-0 text-center text-base font-semibold text-white">
          ${stake}
        </p>
        <button
          style={{
            height: "21px",
            fontFamily: "Inter, sans-serif",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "150%",
            letterSpacing: "-0.011em",
            color: "#808797",
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "100%",
            marginTop: "3px",
          }}
          onClick={handleWatch}
          disabled={isJoining}
        >
          {t("watch")}
        </button>
      </div>
    </StyledContainer>
  );
}
