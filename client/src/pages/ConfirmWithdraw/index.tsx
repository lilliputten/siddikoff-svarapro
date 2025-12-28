import { useState } from 'react';

import { YellowButton } from '@/components/Button/YellowButton';
import { apiService } from '@/services/api/api';
import { ConfirmWithdrawProps } from '@/types/components';

export function ConfirmWithdraw({
  withdrawAmount,
  walletAddress,
}: ConfirmWithdrawProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmWithdraw = async () => {
    if (!walletAddress) {
      alert('Адрес кошелька не указан');
      return;
    }

    setIsProcessing(true);
    try {
      const amount = parseFloat(withdrawAmount);
      await apiService.initiateWithdraw('USDTTON', amount, walletAddress);
      alert('Заявка на вывод создана успешно!');
      // Здесь можно добавить переход на другую страницу или обновление состояния
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to initiate withdraw:', error);
      alert('Ошибка при создании заявки на вывод. Попробуйте еще раз.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-primary px-4 pt-4">
      <div className="w-full max-w-[331px]">
        <h2 className="mb-4 text-left text-2xl font-semibold leading-tight tracking-tighter text-white">
          Подтвердить вывод
        </h2>
        <p className="mb-2 text-left text-xs font-medium leading-tight tracking-tighter text-gray-400">
          Адрес для вывода
        </p>
        <div className="mb-4 flex h-[53px] w-full items-center justify-start rounded-lg bg-black bg-opacity-30 px-4">
          <p className="text-sm font-semibold leading-tight tracking-tighter text-white">
            {walletAddress}
          </p>
        </div>
        <p className="mb-2 text-left text-xs font-medium leading-tight tracking-tighter text-gray-400">
          Сеть
        </p>
        <div className="mb-4 flex h-[53px] w-full items-center justify-start rounded-lg bg-black bg-opacity-30 px-4">
          <p className="text-sm font-semibold leading-tight tracking-tighter text-white">
            TON
          </p>
        </div>
        <p className="mb-2 text-left text-xs font-medium leading-tight tracking-tighter text-gray-400">
          Вы получите
        </p>
        <div className="mb-4 flex h-[53px] w-full items-center justify-start rounded-lg bg-black bg-opacity-30 px-4">
          <p className="text-sm font-semibold leading-tight tracking-tighter text-white">
            {withdrawAmount} USDT
          </p>
        </div>
      </div>
      <div className="mt-auto w-[93vw] pb-6">
        <YellowButton
          size="lg"
          onClick={handleConfirmWithdraw}
          className="w-full"
          isActive={!isProcessing}
        >
          {isProcessing ? 'Обработка...' : 'Подтвердить'}
        </YellowButton>
      </div>
    </div>
  );
}
