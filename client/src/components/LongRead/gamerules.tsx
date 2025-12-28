import { useTranslation } from "react-i18next";

import closeIcon from "@/assets/close.png";
import combosImage from "@/assets/combos.jpg";
import { GamerulesProps, TextProps } from "@/types/components";

export const GamerulesHeader = ({ children }: TextProps) => (
  <h2 className="text-base font-bold leading-tight tracking-tighter text-white">
    {children}
  </h2>
);

export const GamerulesBody = ({ children }: TextProps) => (
  <p className="text-xs font-normal leading-tight tracking-tighter text-white">
    {children}
  </p>
);

export function Gamerules({ onClose }: GamerulesProps) {
  const { t } = useTranslation("common");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[80vh] w-[330px] flex-col rounded-lg bg-[#131217] p-4">
        <button onClick={onClose} className="absolute right-4 top-4 z-10">
          <img src={closeIcon} alt="Close" className="h-6 w-6" />
        </button>
        <div className="flex-grow space-y-4 overflow-y-auto pr-4">
          <GamerulesHeader>{t("gamerules_title")}</GamerulesHeader>
          <GamerulesHeader>{t("gamerules_deal_title")}</GamerulesHeader>
          <GamerulesBody>{t("gamerules_deal_body")}</GamerulesBody>
          <GamerulesHeader>{t("gamerules_bets_title")}</GamerulesHeader>
          <GamerulesBody>{t("gamerules_bets_body")}</GamerulesBody>
          <GamerulesHeader>{t("gamerules_ante_title")}</GamerulesHeader>
          <GamerulesBody>{t("gamerules_ante_body")}</GamerulesBody>
          <GamerulesHeader>{t("gamerules_blind_title")}</GamerulesHeader>
          <GamerulesBody>{t("gamerules_blind_body")}</GamerulesBody>
          <GamerulesHeader>{t("gamerules_normalbets_title")}</GamerulesHeader>
          <GamerulesBody>{t("gamerules_normalbets_body1")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_normalbets_body2")}</GamerulesBody>
          <GamerulesHeader>{t("gamerules_svara_title")}</GamerulesHeader>
          <GamerulesBody>{t("gamerules_svara_body1")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_svara_body2")}</GamerulesBody>
          <GamerulesHeader>{t("gamerules_count_title")}</GamerulesHeader>
          <GamerulesBody>{t("gamerules_count_body")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_table_row_1")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_table_row_2")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_table_row_3")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_table_row_4")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_table_row_5")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_table_row_6")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_table_row_7")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_table_row_8")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_table_row_9")}</GamerulesBody>
          <GamerulesHeader>{t("gamerules_combos_title")}</GamerulesHeader>
          <GamerulesBody>{t("gamerules_combos_body1")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_combos_body2")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_combos_body3")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_combos_body4")}</GamerulesBody>
          <GamerulesHeader>{t("gamerules_special_title")}</GamerulesHeader>
          <GamerulesBody>{t("gamerules_special_body1")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_special_body2")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_special_body3")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_special_body4")}</GamerulesBody>
          <GamerulesHeader>{t("gamerules_examples_title")}</GamerulesHeader>
          <img
            src={combosImage}
            alt="Examples of combinations"
            className="max-w-full rounded-lg"
          />
          <GamerulesBody>{t("gamerules_example1")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_example2")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_example3")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_example4")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_example5")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_example6")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_example7")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_example8")}</GamerulesBody>
          <GamerulesHeader>{t("gamerules_terms_title")}</GamerulesHeader>
          <GamerulesBody>{t("gamerules_terms_body1")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_terms_body2")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_terms_body3")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_terms_body4")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_terms_body5")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_terms_body6")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_terms_body7")}</GamerulesBody>
          <GamerulesBody>{t("gamerules_terms_body8")}</GamerulesBody>
        </div>
      </div>
    </div>
  );
}
