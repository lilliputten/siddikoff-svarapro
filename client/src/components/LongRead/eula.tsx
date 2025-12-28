import { useTranslation } from "react-i18next";

import closeIcon from "@/assets/close.png";
import { EulaProps, TextProps } from "@/types/components";

export const EulaHeader = ({ children }: TextProps) => (
  <h2 className="text-base font-bold leading-tight tracking-tighter text-white">{children}</h2>
);

export const EulaBody = ({ children }: TextProps) => (
  <p className="text-xs font-normal leading-tight tracking-tighter text-white">{children}</p>
);

export const EulaSubtext = ({ children }: TextProps) => (
  <p className="text-[10px] font-normal leading-tight tracking-tighter text-[#64646E]">
    {children}
  </p>
);

export function Eula({ onClose }: EulaProps) {
  const { t } = useTranslation("common");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[80vh] w-[330px] flex-col rounded-lg bg-[#131217] p-4">
        <button onClick={onClose} className="absolute right-4 top-4 z-10">
          <img src={closeIcon} alt="Close" className="h-6 w-6" />
        </button>
        <div className="flex-grow space-y-4 overflow-y-auto pr-4">
          <EulaHeader>{t("eula_title")}</EulaHeader>
          <EulaSubtext>{t("eula_date")}</EulaSubtext>
          <EulaHeader>{t("eula_welcome")}</EulaHeader>
          <EulaBody>{t("eula_intro")}</EulaBody>
          <EulaHeader>{t("eula_acceptance_title")}</EulaHeader>
          <EulaBody>{t("eula_acceptance_body")}</EulaBody>
          <EulaHeader>{t("eula_eligibility_title")}</EulaHeader>
          <EulaBody>{t("eula_eligibility_body")}</EulaBody>
          <EulaHeader>{t("eula_account_title")}</EulaHeader>
          <EulaBody>{t("eula_account_body")}</EulaBody>
          <EulaHeader>{t("eula_fairplay_title")}</EulaHeader>
          <EulaBody>{t("eula_fairplay_body")}</EulaBody>
          <EulaHeader>{t("eula_operations_title")}</EulaHeader>
          <EulaBody>{t("eula_operations_body")}</EulaBody>
          <EulaHeader>{t("eula_bonuses_title")}</EulaHeader>
          <EulaBody>{t("eula_bonuses_body")}</EulaBody>
          <EulaHeader>{t("eula_limitation_title")}</EulaHeader>
          <EulaBody>{t("eula_limitation_body")}</EulaBody>
          <EulaHeader>{t("eula_disputes_title")}</EulaHeader>
          <EulaBody>{t("eula_disputes_body")}</EulaBody>
          <EulaHeader>{t("eula_termination_title")}</EulaHeader>
          <EulaBody>{t("eula_termination_body")}</EulaBody>
          <EulaHeader>{t("eula_changes_title")}</EulaHeader>
          <EulaBody>{t("eula_changes_body")}</EulaBody>
        </div>
      </div>
    </div>
  );
}
