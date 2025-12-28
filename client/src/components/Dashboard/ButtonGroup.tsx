import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button/Button";
import createIcon from "@/assets/create.png";
import moreIcon from "@/assets/more.png";
import tournamentsIcon from "@/assets/tournaments.png";
import { ButtonGroupProps } from "@/types/components";

export function ButtonGroup({
  onMoreClick,
  onComingSoonClick,
  onCreateRoomClick,
}: ButtonGroupProps) {
  const { t } = useTranslation("common");
  return (
    <div className="mx-auto mt-6 flex w-[93vw] items-center gap-2">
      <Button
        layout="vertical"
        icon={createIcon}
        className="h-[57px] flex-1"
        onClick={onCreateRoomClick}
      >
        {t("create")}
      </Button>
      <Button
        layout="vertical"
        icon={tournamentsIcon}
        className="h-[57px] flex-1"
        onClick={onComingSoonClick}
      >
        {t("tournaments")}
      </Button>
      <Button
        layout="vertical"
        icon={moreIcon}
        onClick={onMoreClick}
        className="h-[57px] flex-1"
      >
        {t("more")}
      </Button>
    </div>
  );
}
