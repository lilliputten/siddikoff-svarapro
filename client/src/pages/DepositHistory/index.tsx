import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import closeIcon from "@/assets/close.png";
import tetherIcon from "@/assets/tetherRound.png";
import tonIcon from "@/assets/ton.png";
import { apiService } from "@/services/api/api";
import { DepositHistoryProps } from "@/types/components";
import { Transaction } from "@/types/entities";

const truncateTrackerId = (id: string) => {
  if (id.length <= 15) {
    return id;
  }
  return `${id.slice(0, 6)}...${id.slice(-6)}`;
};
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options).replace(",", "");
};

export function DepositHistory({ setCurrentPage, userId }: DepositHistoryProps) {
  const { t } = useTranslation("common");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCloseButtonPressed, setIsCloseButtonPressed] = useState(false);

  const handleCloseButtonPress = () => {
    setIsCloseButtonPressed(true);
    setTimeout(() => setIsCloseButtonPressed(false), 300);
    setTimeout(() => setCurrentPage("more"), 100);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getTransactionHistory(userId);
        // Приведение типов для currency
        const formattedData: Transaction[] = data.map((item) => ({
          ...item,
          currency:
            item.currency === "USDTTON" || item.currency === "TON" ? item.currency : "USDTTON", // Дефолтное значение, если currency некорректна
        }));
        setTransactions(formattedData);
      } catch (err) {
        setError("Failed to load transaction history");
        console.error("Error fetching transactions:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [userId]);

  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-primary px-4 pt-4">
      <div className="mx-auto flex w-[93vw] flex-col items-center">
        {/* Заголовок и кнопка "Назад" */}
        <div className="mb-4 flex w-full items-center justify-between">
          <h2
            className="flex items-center text-left text-xl font-semibold leading-tight tracking-tighter text-white"
            style={{
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "100%",
              letterSpacing: "-1.1%",
            }}
          >
            {t("deposit_history")}
          </h2>
          <button
            onClick={handleCloseButtonPress}
            className={`z-10 ${isCloseButtonPressed ? "button-press" : ""}`}
          >
            <img src={closeIcon} alt="Close" className="h-6 w-6" />
          </button>
        </div>

        {/* Список транзакций */}
        <div className="flex w-full max-w-[320px] flex-col gap-4 overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="text-center text-white/60">{t("no_transactions_found")}</div>
          ) : (
            transactions.map((transaction, index) => (
              <React.Fragment key={transaction.tracker_id}>
                <div className="flex h-[56px] w-[320px] items-center">
                  {/* Первая секция: Иконка */}
                  <div
                    className="mr-3 flex h-[52px] w-[52px] items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#35333B" }}
                  >
                    <img
                      src={transaction.currency === "USDTTON" ? tetherIcon : tonIcon}
                      alt={transaction.currency}
                      className="h-[32px] w-[32px]"
                    />
                  </div>

                  {/* Вторая и третья секции: Текст и данные */}
                  <div className="flex flex-1 justify-between">
                    {/* Вторая секция: Тип, Transaction ID, tracker_id */}
                    <div className="flex flex-col justify-center gap-1">
                      <span
                        style={{
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "-1.1%",
                          verticalAlign: "middle",
                          color: "#FFFFFF",
                        }}
                      >
                        {transaction.type === "deposit" ? "Пополнение" : "Вывод"}
                      </span>
                      <span
                        style={{
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "12px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        Transaction ID
                      </span>
                      <span
                        style={{
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "12px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "#FFFFFF",
                        }}
                      >
                        {truncateTrackerId(transaction.tracker_id)}
                      </span>
                    </div>

                    {/* Третья секция: Сумма, статус, дата */}
                    <div className="flex flex-col items-end justify-center gap-1">
                      <span
                        style={{
                          fontWeight: 700,
                          fontStyle: "normal",
                          fontSize: "16px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          textAlign: "right",
                          verticalAlign: "middle",
                          color: "#FFFFFF",
                        }}
                      >
                        ${transaction.amount}
                      </span>
                      <span
                        className={
                          transaction.status === "canceled"
                            ? "text-red-500"
                            : transaction.status === "pending"
                              ? "text-orange-500"
                              : "text-green-500"
                        }
                        style={{
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "12px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          textAlign: "right",
                          verticalAlign: "middle",
                        }}
                      >
                        {transaction.status}
                      </span>
                      <span
                        style={{
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "12px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          textAlign: "right",
                          verticalAlign: "middle",
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        {formatDate(transaction.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Прерывистая линия (кроме последней транзакции) */}
                {index < transactions.length - 1 && (
                  <hr
                    className="mt-4 w-[320px] border-white/25"
                    style={{
                      borderWidth: "1px",
                      borderStyle: "dashed",
                      borderImage: "2 5",
                    }}
                  />
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
