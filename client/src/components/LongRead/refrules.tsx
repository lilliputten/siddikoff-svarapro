import { useTranslation } from "react-i18next";

import closeIcon from "@/assets/close.png";
import referralsIcon from "@/assets/referrals.svg";
import { RefrulesProps, TextProps } from "@/types/components";

export const RefrulesHeader = ({ children }: TextProps) => (
  <h2 className="text-base font-bold leading-tight tracking-tighter text-white">
    {children}
  </h2>
);

export const RefrulesBody = ({ children }: TextProps) => (
  <p className="text-xs font-normal leading-tight tracking-tighter text-white">
    {children}
  </p>
);

export const RefrulesSubtext = ({ children }: TextProps) => (
  <p className="text-[10px] font-normal leading-tight tracking-tighter text-[#64646E]">
    {children}
  </p>
);

export function Refrules({ onClose }: RefrulesProps) {
  const { t } = useTranslation("common");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[80vh] w-[330px] flex-col rounded-lg bg-[#131217] p-4">
        <button onClick={onClose} className="absolute right-4 top-4 z-10">
          <img src={closeIcon} alt="Close" className="h-6 w-6" />
        </button>
        <div className="flex-grow space-y-4 overflow-y-auto pr-4">
          <RefrulesHeader>{t("refrules_title")}</RefrulesHeader>
          <RefrulesBody>{t("refrules_intro")}</RefrulesBody>
          <RefrulesHeader>{t("refrules_level_title")}</RefrulesHeader>
          <table
            className="w-full"
            style={{
              border: "0.5px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th className="p-2">
                  <RefrulesSubtext>{t("refrules_table_level")}</RefrulesSubtext>
                </th>
                <th className="p-2">
                  <RefrulesSubtext>
                    {t("refrules_table_deposits")}
                  </RefrulesSubtext>
                </th>
                <th className="p-2">
                  <RefrulesSubtext>%</RefrulesSubtext>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                style={{ borderBottom: "0.5px solid rgba(255, 255, 255, 0.1)" }}
              >
                <td className="p-2">
                  <RefrulesBody>{t("refrules_table_row_1_col_1")}</RefrulesBody>
                </td>
                <td className="p-2">
                  <RefrulesBody>{t("refrules_table_row_1_col_2")}</RefrulesBody>
                </td>
                <td className="p-2">
                  <RefrulesBody>{t("refrules_table_row_1_col_3")}</RefrulesBody>
                </td>
              </tr>
              <tr
                style={{ borderBottom: "0.5px solid rgba(255, 255, 255, 0.1)" }}
              >
                <td className="flex items-center gap-1 p-2">
                  <RefrulesBody>{t("refrules_table_row_2_col_1")}</RefrulesBody>
                  <img
                    src={referralsIcon}
                    alt="Referrals"
                    className="h-[10px] w-[14px]"
                  />
                </td>
                <td className="p-2">
                  <RefrulesBody>{t("refrules_table_row_2_col_2")}</RefrulesBody>
                </td>
                <td className="p-2">
                  <RefrulesBody>{t("refrules_table_row_2_col_3")}</RefrulesBody>
                </td>
              </tr>
              <tr
                style={{ borderBottom: "0.5px solid rgba(255, 255, 255, 0.1)" }}
              >
                <td className="flex items-center gap-1 p-2">
                  <RefrulesBody>{t("refrules_table_row_3_col_1")}</RefrulesBody>
                  <img
                    src={referralsIcon}
                    alt="Referrals"
                    className="h-[10px] w-[14px]"
                  />
                </td>
                <td className="p-2">
                  <RefrulesBody>{t("refrules_table_row_3_col_2")}</RefrulesBody>
                </td>
                <td className="p-2">
                  <RefrulesBody>{t("refrules_table_row_3_col_3")}</RefrulesBody>
                </td>
              </tr>
              <tr>
                <td className="flex items-center gap-1 p-2">
                  <RefrulesBody>{t("refrules_table_row_4_col_1")}</RefrulesBody>
                  <img
                    src={referralsIcon}
                    alt="Referrals"
                    className="h-[10px] w-[14px]"
                  />
                </td>
                <td className="p-2">
                  <RefrulesBody>{t("refrules_table_row_4_col_2")}</RefrulesBody>
                </td>
                <td className="p-2">
                  <RefrulesBody>{t("refrules_table_row_4_col_3")}</RefrulesBody>
                </td>
              </tr>
            </tbody>
          </table>
          <RefrulesHeader>{t("refrules_conditions_title")}</RefrulesHeader>
          <RefrulesBody>{t("refrules_condition1")}</RefrulesBody>
          <RefrulesBody>{t("refrules_condition2")}</RefrulesBody>
          <RefrulesBody>{t("refrules_condition3")}</RefrulesBody>
          <RefrulesBody>{t("refrules_condition4")}</RefrulesBody>
          <RefrulesBody>{t("refrules_space")}</RefrulesBody>
          <RefrulesBody>{t("refrules_condition5")}</RefrulesBody>
        </div>
      </div>
    </div>
  );
}
