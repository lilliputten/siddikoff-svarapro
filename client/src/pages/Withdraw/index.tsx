import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button/Button";
import { YellowButton } from "@/components/Button/YellowButton";
import tetherIcon from "@/assets/tether.png";
import warningIcon from "@/assets/warning.svg";
import { WithdrawProps } from "@/types/components";

export function Withdraw({
  balance,
  setCurrentPage,
  setWithdrawAmount,
}: WithdrawProps) {
  const [amount, setAmount] = useState("");
  const minAmount = 10;
  const availableAmount = parseFloat(balance);
  const { t } = useTranslation("common");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow positive numbers with decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleMaxClick = () => {
    setAmount(availableAmount.toString());
  };

  const handleCheck = () => {
    setWithdrawAmount(amount);
    setCurrentPage("confirmWithdraw");
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-primary px-4 pt-4">
      <div className="w-[93vw]">
        <h2 className="mb-2 flex items-center text-left text-lg font-semibold text-white">
          {t("withdraw_title")}{" "}
          <img src={tetherIcon} alt="USDT-TON" className="ml-2 h-6 w-6" />
        </h2>
        <div className="mb-4 flex w-full items-center rounded-lg bg-red-900 bg-opacity-30 p-3 text-left">
          <img src={warningIcon} alt="Warning" className="mr-2 h-6 w-6" />
          <span className="font-inter text-xs text-white">
            {t("memo_warning")}
          </span>
        </div>
      </div>

      <div className="mb-4 flex h-[53px] w-[93vw] items-center rounded-lg bg-black bg-opacity-30 px-4">
        <span className="font-inter text-[17px] text-white opacity-60">$</span>
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0"
          className="mx-2 w-full bg-transparent text-left font-inter text-[17px] text-white placeholder-white placeholder-opacity-60 focus:outline-none"
        />
        <Button
          variant="tertiary"
          size="sm"
          onClick={handleMaxClick}
          className="!h-[25px] !w-[57px] !rounded-lg !bg-[#2E2B33] !px-2 !py-1 !text-[14px] !font-medium !text-[#C9C6CE]"
        >
          {t("max")}
        </Button>
      </div>

      <div className="mb-4 w-[93vw] text-[12px] text-sm font-semibold tracking-tighter text-[#C9C6CE]">
        <div className="flex justify-between">
          <span className="text-left">{t("min_sum")}</span>
          <span className="text-right">{minAmount} USDT</span>
        </div>
        <div className="flex justify-between">
          <span className="text-left">{t("available")}</span>
          <span className="text-right">{availableAmount} USDT</span>
        </div>
      </div>

      <YellowButton
        size="lg"
        onClick={handleCheck}
        isActive={
          parseFloat(amount) >= minAmount &&
          parseFloat(amount) <= availableAmount
        }
        className="w-[93vw]"
      >
        {t("check")}
      </YellowButton>
    </div>
  );
}
