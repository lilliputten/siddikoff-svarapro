import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button/Button";
import { ErrorAlert } from "@/components/ErrorAlert";
import { LoadingPage } from "@/components/LoadingPage";
import rightIcon from "@/assets/right.png";
import tetherIcon from "@/assets/tether.png";
import tonIcon from "@/assets/ton.png";
import { apiService } from "@/services/api/api";
import { DepositProps } from "@/types/components";

export function Deposit({ setCurrentPage }: DepositProps) {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMoreButtonPressed, setIsMoreButtonPressed] = useState(false);

  const handleDeposit = async (currency: string) => {
    setLoading(true);
    setError(null);
    try {
      const depositData = await apiService.initiateDeposit(currency);
      setCurrentPage("confirmDeposit", {
        address: depositData.address,
        trackerId: depositData.trackerId, // Преобразуем tracker_id в trackerId
        currency, // Явно задаем currency из аргумента
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to initiate deposit";
      console.error("Failed to initiate deposit:", error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMoreButtonPress = () => {
    setIsMoreButtonPressed(true);
    setTimeout(() => setIsMoreButtonPressed(false), 300);
    setTimeout(() => {
      const telegramUrl = "https://t.me/SvaraPaybot";
      window.open(telegramUrl, "_blank");
    }, 100);
  };

  if (loading) {
    return <LoadingPage isLoading={loading} />;
  }

  if (error) {
    return <ErrorAlert code={undefined} customMessage={error} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-primary px-4 pt-4">
      {/* Cryptocurrency selector element */}
      <div
        className="mb-4 flex w-[93vw] items-center justify-between"
        style={{
          height: "53px",
          borderRadius: "8px",
          backgroundColor: "#13121757",
          boxShadow: "0px 0px 4px 0px #00000040 inset",
          padding: "0 8px",
        }}
      >
        {/* Left half - centered "Криптовалюта" */}
        <div
          className="flex items-center justify-center"
          style={{
            width: "50%",
            height: "100%",
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: "100%",
              height: "40px",
              borderRadius: "8px",
              background:
                "linear-gradient(0deg, #36333B 7.5%, #46434B 100%, #48454D 100%)",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "131%",
              letterSpacing: "-1.1%",
              textAlign: "center",
              verticalAlign: "middle",
            }}
          >
            {t("cryptocurrency")}
          </div>
        </div>

        {/* Right half - centered "Ещё" */}
        <div
          className="flex items-center justify-center"
          style={{
            width: "50%",
            height: "100%",
          }}
        >
          <button
            className={`flex cursor-pointer items-center justify-center transition-opacity hover:opacity-80 ${isMoreButtonPressed ? "button-press" : ""}`}
            onClick={handleMoreButtonPress}
            style={{
              color: "#808797",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "131%",
              letterSpacing: "-1.1%",
              textAlign: "center",
              verticalAlign: "middle",
              background: "transparent",
              border: "none",
              padding: "0",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
          >
            {t("more")}
          </button>
        </div>
      </div>

      <h2 className="mb-4 self-start text-lg font-semibold text-gray-400">
        {t("select_currency")}
      </h2>

      <div className="flex w-[93vw] flex-col items-start space-y-3">
        <Button
          variant="secondary"
          size="xl"
          fullWidth
          icon={tetherIcon}
          rightIcon={rightIcon}
          rightIconClassName="w-[6px] h-[17px]"
          onClick={() => handleDeposit("USDTTON")}
          justify="start"
        >
          USDT-TON
        </Button>
        <Button
          variant="secondary"
          size="xl"
          fullWidth
          icon={tonIcon}
          rightIcon={rightIcon}
          rightIconClassName="w-[6px] h-[17px]"
          onClick={() => handleDeposit("TON")}
          justify="start"
        >
          TON
        </Button>
      </div>
    </div>
  );
}
