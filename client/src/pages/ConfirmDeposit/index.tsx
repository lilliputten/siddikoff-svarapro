import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

import { Button } from "@/components/Button/Button";
import { YellowButton } from "@/components/Button/YellowButton";
import { PopSuccess } from "@/components/PopSuccess";
// import copyIcon from "@/assets/copy.png";
import blackCopyIcon from "@/assets/black_copy.png";
import qrIcon from "@/assets/qr.png";
import slideDownIcon from "@/assets/slideDown.png";
import tetherIcon from "@/assets/tether.png";
import warningIcon from "@/assets/warning.svg";
import { ConfirmDepositProps } from "@/types/components";

export function ConfirmDeposit({
  address,
  currency,
  trackerId,
}: ConfirmDepositProps) {
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 минут в секундах
  const [showQR, setShowQR] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address).then(() => {
      setShowSuccess(true);
    });
  };

  const _handleCopyTrackerId = () => {
    navigator.clipboard.writeText(trackerId).then(() => {
      setShowSuccess(true);
    });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const paymentUrl = `ton://transfer/${address}`;

  // Сокращаем trackerId (первые 8 и последние 8 символов)
  const _shortTrackerId =
    trackerId.length > 16
      ? `${trackerId.slice(0, 8)}...${trackerId.slice(-8)}`
      : trackerId;

  return (
    <div className="flex min-h-screen flex-col items-center bg-primary px-4 pt-4">
      {showSuccess && <PopSuccess onClose={() => setShowSuccess(false)} />}
      <div className="w-[100%]">
        <h2 className="mb-2 flex items-center text-left text-lg font-semibold text-white">
          Пополнение с {currency}{" "}
          <img src={tetherIcon} alt={currency} className="ml-2 h-6 w-6" />
        </h2>
        <p className="mb-4 text-left font-inter text-sm font-medium leading-normal tracking-tight text-[#C9C6CE]">
          Отправляй по этому адресу только {currency}, иначе средства могут быть
          утеряны.
        </p>
        <div className="relative mb-4 flex w-full items-center justify-center rounded-lg bg-red-900 bg-opacity-30 p-3">
          <img
            src={warningIcon}
            alt="Warning"
            className="absolute left-[23px] top-[50%] h-6 w-6 -translate-y-[50%]"
          />
          <span className="text-center font-inter text-xs text-[#C9C6CE]">
            Это временный адрес для депозита,
            <br /> осталось минут: {minutes}:{seconds < 10 ? "0" : ""}
            {seconds}
          </span>
        </div>
      </div>

      {/* Контейнер с адресом и trackerId */}
      <div className="mb-4 flex w-[100%] flex-col items-center rounded-lg bg-black bg-opacity-30 p-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowQR(!showQR)}
          icon={qrIcon}
          rightIcon={slideDownIcon}
          rightIconClassName="w-[15px] h-[7px]"
        >
          {showQR ? "Скрыть QR" : "Показать QR"}
        </Button>
        {showQR && (
          <div className="mt-4">
            <QRCodeCanvas
              value={paymentUrl}
              size={128}
              bgColor="#000"
              fgColor="#fff"
            />
          </div>
        )}
        <p className="mt-4 break-all text-center font-inter text-sm text-white">
          {address}
        </p>
      </div>

      {/* Кнопка копирования адреса */}
      <div className="mb-[25px] mt-[25px] w-[100%]">
        <YellowButton
          size="lg"
          icon={blackCopyIcon}
          iconPosition="left"
          onClick={handleCopyAddress}
          className="w-[100%]"
        >
          Скопировать адрес
        </YellowButton>
      </div>

      {/* Минимальная сумма и комиссия */}
      <div className="mb-4 w-[100%] text-[#C9C6CE]">
        <div className="flex justify-between">
          <span
            className="text-left"
            style={{
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "12px",
              lineHeight: "150%",
              letterSpacing: "-1.1%",
              verticalAlign: "middle",
            }}
          >
            Мин.сумма:
          </span>
          <span
            className="text-right"
            style={{
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "12px",
              lineHeight: "150%",
              letterSpacing: "-1.1%",
              verticalAlign: "middle",
            }}
          >
            5$ USDT
          </span>
        </div>
        <div className="flex justify-between">
          <span
            className="text-left"
            style={{
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "12px",
              lineHeight: "150%",
              letterSpacing: "-1.1%",
              verticalAlign: "middle",
            }}
          >
            Комиссия:
          </span>
          <span
            className="text-right"
            style={{
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "12px",
              lineHeight: "150%",
              letterSpacing: "-1.1%",
              verticalAlign: "middle",
            }}
          >
            1%
          </span>
        </div>
      </div>
    </div>
  );
}
