import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { TURN_DURATION_SECONDS } from "@/constants";

import { Slider } from "../Slider";
import { StyledContainer } from "../StyledContainer";

interface BetSliderProps {
  minBet: number;
  maxBet: number;
  initialBet?: number;
  onChange?: (value: number) => void;
  onConfirm: (value: number) => void;
  isOpen: boolean;
  onClose: () => void;
  isTurn?: boolean;
  turnTimer?: number;
  isProcessing?: boolean;
}

export function BetSlider({
  minBet,
  maxBet,
  initialBet,
  onChange,
  onConfirm,
  isOpen,
  onClose,
  isTurn = false,
  turnTimer = TURN_DURATION_SECONDS,
  isProcessing = false,
}: BetSliderProps) {
  const { t } = useTranslation("common");
  const [value, setValue] = useState(initialBet || minBet);
  const [percentage, setPercentage] = useState(0);

  // Reset value when the slider is reopened
  useEffect(() => {
    if (isOpen) {
      const initialValue = initialBet || minBet;
      // Ограничиваем начальное значение балансом пользователя
      const limitedInitialValue = Math.min(initialValue, maxBet);
      setValue(limitedInitialValue);
    }
  }, [isOpen, initialBet, minBet, maxBet]);

  // Предустановленные множители ставок
  const multipliers: { label: string; value: number | "max" }[] = [
    { label: "2x", value: 2 },
    { label: "5x", value: 5 },
    { label: "10x", value: 10 },
    { label: "Max", value: "max" },
  ];

  // Обновляем процент заполнения слайдера
  useEffect(() => {
    if (maxBet > minBet) {
      const percent = ((value - minBet) / (maxBet - minBet)) * 100;
      setPercentage(Math.max(0, Math.min(100, percent)));
    } else {
      setPercentage(100);
    }
  }, [value, minBet, maxBet]);

  // Обработчик изменения значения слайдера
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newValue = parseInt(e.target.value);
    // Ограничиваем значение балансом пользователя
    const limitedValue = Math.min(newValue, maxBet);
    setValue(limitedValue);
    if (onChange) {
      onChange(limitedValue);
    }
  };

  // Обработчик нажатия на множитель
  const handleMultiplier = (multiplier: number | "max") => {
    let newValue;
    if (multiplier === "max") {
      newValue = maxBet;
    } else {
      newValue = Math.min(maxBet, minBet * multiplier);
    }
    // Дополнительная проверка на баланс пользователя
    const limitedValue = Math.min(newValue, maxBet);
    setValue(limitedValue);
    if (onChange) {
      onChange(limitedValue);
    }
  };

  // Обработчик подтверждения ставки
  const handleConfirm = () => {
    onConfirm(value);
  };

  return (
    <Slider isOpen={isOpen} onClose={onClose} height="25vh">
      <div className="relative z-10 flex h-full flex-col justify-around p-4">
        {/* Верхняя часть с индикатором и кнопкой */}
        <div className="mx-auto mb-4 flex w-[85%] items-center justify-between">
          {/* Таймер Хода */}
          {isTurn ? (
            <div className="h-[5px] w-[96px] overflow-hidden rounded-full bg-gray-600">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(turnTimer / TURN_DURATION_SECONDS) * 100}%`,
                  backgroundColor: `hsl(${(turnTimer / TURN_DURATION_SECONDS) * 120}, 100%, 50%)`,
                  transition: "width 0.1s linear, background-color 0.1s linear",
                }}
              />
            </div>
          ) : (
            <div className="h-[5px] w-[96px] rounded-full" />
          )}
          {/* Дисплей суммы */}
          <div
            className="flex items-center justify-center text-[18px] font-bold leading-none text-white"
            style={{
              width: "79px",
              height: "33px",
              backgroundColor: "rgba(19, 18, 23, 0.5)",
              borderRadius: "6px",
            }}
          >
            ${Number(value).toFixed(2)}
          </div>
          {/* Кнопка "Повысить" */}
          <button
            onClick={handleConfirm}
            onTouchStart={(e) => e.preventDefault()}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            className={`flex h-[29px] w-1/4 cursor-pointer items-center justify-center rounded-md text-xs font-bold text-white transition ${
              value > maxBet || isProcessing
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            style={{
              backgroundColor:
                value > maxBet || isProcessing ? "#666" : "#56BF00",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
            disabled={value > maxBet || isProcessing}
          >
            {t("raise")}
          </button>
        </div>

        {/* Множители */}
        <div className="mx-auto mb-4 grid w-[85%] grid-cols-4 justify-items-center gap-2">
          {multipliers.map((mult, index) => {
            // Проверяем, не превышает ли множитель баланс
            const multiplierValue =
              mult.value === "max" ? maxBet : minBet * (mult.value as number);
            const isDisabled = multiplierValue > maxBet || isProcessing;

            return (
              <button
                key={index}
                onClick={() => handleMultiplier(mult.value)}
                onTouchStart={(e) => e.preventDefault()}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  if (!isDisabled) {
                    handleMultiplier(mult.value);
                  }
                }}
                className={`flex cursor-pointer items-center justify-center text-xs font-medium leading-none transition ${
                  isDisabled ? "cursor-not-allowed opacity-50" : ""
                }`}
                style={{
                  width: "27px",
                  height: "19px",
                  borderRadius: "4px",
                  backgroundColor: isDisabled
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(255, 255, 255, 0.06)",
                  color: isDisabled ? "#666" : "#C9C6CE",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                }}
                disabled={isDisabled}
              >
                {mult.label}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <StyledContainer
            className="h-[42px] w-[85%] rounded-[15px]"
            contentClassName="w-full h-full flex items-center justify-center"
          >
            <div className="relative flex h-full w-[82.5%] items-center">
              {/* Track background */}
              <div className="h-[5px] w-full rounded-full bg-[#807C7C]" />
              {/* Track progress */}
              <div
                className="absolute h-[5px] rounded-full bg-[#56BF00]"
                style={{ width: `${percentage}%` }}
              />
              {/* Invisible range input */}
              <input
                type="range"
                min={minBet}
                max={maxBet}
                value={value}
                onChange={handleChange}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                className="absolute h-full w-full cursor-pointer appearance-none bg-transparent"
                style={{
                  WebkitAppearance: "none",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "pan-x",
                }}
              />
              {/* Thumb */}
              <div
                className="pointer-events-none absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white shadow-lg"
                style={{ left: `calc(${percentage}% - 14px)` }} // 14px is half of 28px width
              />
            </div>
          </StyledContainer>
        </div>
      </div>
    </Slider>
  );
}
