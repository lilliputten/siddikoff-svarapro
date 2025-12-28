import { useTranslation } from 'react-i18next';

import { GreenButton } from '@/components/Button/GreenButton';
import { RedButton } from '@/components/Button/RedButton';
import { StyledContainer } from '@/components/StyledContainer';
import { HeaderProps } from '@/types/components';

const truncateUsername = (username: string | undefined) => {
  if (!username) return 'N/A';
  return username.length > 12 ? `${username.slice(0, 12)}...` : username;
};

export function Header({
  user,
  balance,
  onWithdrawClick,
  setCurrentPage,
}: HeaderProps) {
  // Форматируем баланс: принимаем строку или число, приводим к строке с двумя десятичными знаками
  const formattedBalance =
    typeof balance === 'number'
      ? balance.toFixed(2) // Преобразуем число в строку с 2 знаками после запятой
      : parseFloat(balance).toFixed(2); // Если строка, парсим и форматируем
  const [whole, decimal = '00'] = formattedBalance.split('.');
  const displayBalance = `$ ${whole}.${decimal}`;
  const { t } = useTranslation('common');

  return (
    <StyledContainer
      className="mx-auto mt-6 h-[108px] w-[93vw]"
      contentClassName="w-full h-full flex justify-between items-center p-4"
    >
      <div className="flex flex-col items-center" style={{ marginLeft: '5px' }}>
        <div className="relative">
          <img
            src={user?.photo_url || 'https://via.placeholder.com/64'}
            alt="Avatar"
            className="relative z-10 mb-2 h-[48px] w-[48px] rounded-full"
          />
          <div
            className="absolute left-0 top-0 rounded-full"
            style={{
              width: '53px',
              height: '53px',
              backgroundColor: '#252329',
              zIndex: 1,
              transform: 'translate(-2.5px, -2.5px)',
            }}
          />
        </div>
        <p
          className="text-center font-inter text-[14px] font-semibold leading-[21px] text-white"
          style={{
            letterSpacing: '-0.011em',
            textShadow:
              '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px rgba(0, 0, 0, 0.15)',
          }}
        >
          {truncateUsername(user?.username || user?.first_name)}
        </p>
      </div>
      <div className="text-left">
        <div
          className="flex items-center rounded-lg bg-[#36333B] px-2 py-1 text-left"
          style={{
            boxShadow: 'inset 0px 0px 4px rgba(0, 0, 0, 0.25)',
            width: '185px',
            height: '30px',
            position: 'relative',
            top: '1px',
          }}
        >
          <div className="flex items-baseline">
            <span className="font-inter text-[20px] font-semibold text-white">
              {displayBalance.split('.')[0]}
            </span>
            <span className="font-inter text-[15px] font-semibold text-gray-400">
              .{displayBalance.split('.')[1]}
            </span>
          </div>
        </div>
        <div
          className="mt-4 flex"
          style={{ position: 'relative', zIndex: 20, gap: '15px' }}
        >
          <GreenButton
            onClick={() => setCurrentPage('deposit')}
            style={{ boxShadow: '0px 1px 3px 1px #00000026' }}
          >
            {t('deposit')}
          </GreenButton>
          <RedButton
            onClick={onWithdrawClick}
            style={{ boxShadow: '0px 1px 3px 1px #00000026' }}
          >
            {t('withdraw')}
          </RedButton>
        </div>
      </div>
    </StyledContainer>
  );
}
