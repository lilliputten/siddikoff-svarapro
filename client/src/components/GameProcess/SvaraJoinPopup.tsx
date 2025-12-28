import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import starIcon from "@/assets/game/star.png";
import defaultAvatar from "@/assets/main_logo.png";
import { UserData } from "@/types/entities";
import { GameState, Player } from "@/types/game";

import { StyledContainer } from "../StyledContainer";

interface SvaraJoinPopupProps {
  gameState: GameState;
  userData: UserData;
  actions: {
    joinSvara: () => void;
    skipSvara: () => void;
  };
}

const SvaraAvatar = ({ player }: { player: Player }) => {
  return (
    <div className="relative mx-2 flex flex-col items-center">
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: "71px",
          height: "71px",
          background: "#232228",
          boxShadow: "0px 0px 4px 2px #EC8800",
        }}
      >
        <img
          src={player.avatar || defaultAvatar}
          alt={player.username}
          className="rounded-full object-cover"
          style={{ width: "65px", height: "65px" }}
        />
      </div>
      {player.score !== undefined && (
        <div
          className="absolute -bottom-3 flex items-center justify-center text-white"
          style={{
            width: "22px",
            height: "22px",
            backgroundColor: "#FF443A",
            borderRadius: "50%",
            fontWeight: 500,
            fontSize: "14px",
          }}
        >
          {player.score}
        </div>
      )}
    </div>
  );
};

export function SvaraJoinPopup({ gameState, userData, actions }: SvaraJoinPopupProps) {
  const { t } = useTranslation("common");
  const [timer, setTimer] = useState(20);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Automatically skip if timer runs out
          actions.skipSvara();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [actions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        actions.skipSvara();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actions, popupRef]);

  const svaraWinners = gameState.winners || [];
  const isParticipant = svaraWinners.some((p) => p.id === userData.id?.toString());
  const hasConfirmed = gameState.svaraConfirmed?.includes(userData.id?.toString() || "") || false;

  const renderAvatars = () => {
    if (svaraWinners.length === 2) {
      return (
        <div className="flex w-full items-center justify-center">
          <SvaraAvatar player={svaraWinners[0]} />
          <div className="mx-4 flex items-center">
            <img src={starIcon} alt="*" className="h-6 w-6" />
            <h1 className="mx-2 text-xl font-semibold">{t("svara")}</h1>
            <img src={starIcon} alt="*" className="h-6 w-6" />
          </div>
          <SvaraAvatar player={svaraWinners[1]} />
        </div>
      );
    }
    if (svaraWinners.length === 3) {
      return (
        <div className="relative flex w-full flex-col items-center">
          <div className="absolute -top-12">
            <SvaraAvatar player={svaraWinners[2]} />
          </div>
          <div className="mt-8 flex w-full items-center justify-center">
            <SvaraAvatar player={svaraWinners[0]} />
            <div className="mx-4 flex items-center">
              <img src={starIcon} alt="*" className="h-6 w-6" />
              <h1 className="mx-2 text-xl font-semibold">{t("svara")}</h1>
              <img src={starIcon} alt="*" className="h-6 w-6" />
            </div>
            <SvaraAvatar player={svaraWinners[1]} />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div ref={popupRef}>
        <StyledContainer className="h-[280px] w-[330px]">
          <div className="flex h-full flex-col items-center justify-between p-4">
            {renderAvatars()}

            <div className="text-center">
              {isParticipant ? (
                <>
                  <p className="mb-3 text-sm font-bold">
                    {hasConfirmed
                      ? t("waiting_for_other_players")
                      : t("svara_will_you_participate")}
                  </p>
                  <button
                    onClick={hasConfirmed ? undefined : actions.joinSvara}
                    className={`mb-2 h-[32px] w-[224px] rounded-lg text-sm font-bold text-white ${
                      hasConfirmed
                        ? "cursor-not-allowed bg-gray-500 opacity-70"
                        : "cursor-pointer bg-[#00AF17] hover:bg-[#00AF17]/90"
                    }`}
                    disabled={hasConfirmed}
                  >
                    {hasConfirmed ? t("participating") : t("participate_free")}
                  </button>
                  <button
                    onClick={hasConfirmed ? undefined : actions.skipSvara}
                    className={`h-[32px] w-[224px] rounded-lg text-sm font-bold text-white ${
                      hasConfirmed
                        ? "cursor-not-allowed bg-gray-500 opacity-70"
                        : "cursor-pointer bg-[#FF443A] hover:bg-[#FF443A]/90"
                    }`}
                    disabled={hasConfirmed}
                  >
                    {hasConfirmed ? t("decision_made") : t("skip_with_timer", { timer })}
                  </button>
                </>
              ) : (
                <>
                  <p className="mb-3 text-sm font-bold">{t("join_or_skip_svara")}</p>
                  <button
                    onClick={actions.joinSvara}
                    className="mb-2 h-[32px] w-[224px] rounded-lg bg-[#00AF17] text-sm font-bold text-white"
                  >
                    {t("join_svara_with_pot", { pot: gameState.pot })}
                  </button>
                  <button
                    onClick={actions.skipSvara}
                    className="h-[32px] w-[224px] rounded-lg bg-[#FF443A] text-sm font-bold text-white"
                  >
                    {t("skip_with_timer", { timer })}
                  </button>
                </>
              )}
            </div>
          </div>
        </StyledContainer>
      </div>
    </div>
  );
}
