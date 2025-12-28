import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button/Button';
import { Refrules } from '@/components/LongRead/refrules';
import { PopSuccess } from '@/components/PopSuccess';
import { StyledContainer } from '@/components/StyledContainer';
import closeIcon from '@/assets/close.png';
import copyIcon from '@/assets/copy.png';
import { apiService } from '@/services/api/api';
import { ReferralProps } from '@/types/components';
import { ReferralData } from '@/types/entities';

const truncateUsername = (username: string | null | undefined) => {
  if (!username) return 'N/A';
  return username.length > 12 ? `${username.slice(0, 12)}...` : username;
};

export function Referral({ onClose }: ReferralProps) {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRefrulesVisible, setIsRefrulesVisible] = useState(false);
  const { t } = useTranslation('common');

  const handleCopy = () => {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink).then(() => {
        setShowSuccess(true);
      });
    }
  };

  const handleShare = () => {
    if (referralData?.referralLink) {
      const text = t(
        'share_referral_text',
        'Присоединяйся ко мне в Svara Pro! Используй мою ссылку для регистрации.',
      );
      WebApp.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(
          referralData.referralLink,
        )}&text=${encodeURIComponent(text)}`,
      );
    }
  };

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        setLoading(true);
        const data = (await apiService.getReferralLink()) as ReferralData;
        setReferralData(data);
      } catch (err) {
        setError(t('referral_load_error'));
        // eslint-disable-next-line no-console
        console.error('Error fetching referral data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReferralData();
  }, [t]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        {t('loading')}
      </div>
    );
  if (error)
    return (
      <div className="fixed inset-0 flex items-center justify-center text-white">
        {error}
      </div>
    );
  if (!referralData) return null;

  const { refBalance, refBonus, referralCount, referrals } = referralData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      {showSuccess && <PopSuccess onClose={() => setShowSuccess(false)} />}
      {isRefrulesVisible && (
        <Refrules onClose={() => setIsRefrulesVisible(false)} />
      )}
      <div className="relative flex w-[330px] flex-col items-center gap-4 rounded-lg bg-[#2E2B33] p-4">
        <h2 className="text-center text-lg font-bold text-white">
          {t('referral_program')}
        </h2>
        <button onClick={onClose} className="absolute right-4 top-4 z-10">
          <img src={closeIcon} alt="Close" className="h-6 w-6" />
        </button>

        {/* Статистика */}
        <div className="flex w-full justify-between gap-2">
          <button
            className="h-[55px] w-[150px]"
            onClick={() => setIsRefrulesVisible(true)}
          >
            <StyledContainer className="h-full w-full">
              <div className="flex h-full flex-col items-center justify-center">
                <span className="text-sm text-gray-400">{t('level')}</span>
                <span className="text-lg font-semibold text-white">
                  {refBonus}%
                </span>
              </div>
            </StyledContainer>
          </button>
          <StyledContainer className="h-[55px] w-[150px]">
            <div className="flex h-full flex-col items-center justify-center">
              <span className="text-sm text-gray-400">{t('earnings')}</span>
              <span className="text-lg font-semibold text-white">
                ${refBalance}
              </span>
            </div>
          </StyledContainer>
        </div>

        {/* Реферальная ссылка */}
        <StyledContainer className="h-[141px] w-[298px]">
          <div className="flex h-full flex-col items-center justify-between p-2">
            <p className="text-base font-semibold leading-tight tracking-tighter text-white">
              {t('your_referral_link')}
            </p>
            <p className="break-all text-center text-xs text-gray-400">
              {referralData.referralLink}
            </p>
            <div className="flex w-full justify-between gap-2">
              <Button
                variant="tertiary"
                onClick={handleCopy}
                className="h-[36px] w-[140px] rounded-lg !bg-[#2E2B33] text-sm font-medium leading-normal tracking-tighter"
                icon={copyIcon}
                iconClassName="w-4 h-4"
              >
                {t('copy')}
              </Button>
              <Button
                variant="tertiary"
                onClick={handleShare}
                className="h-[36px] w-[140px] rounded-lg !bg-[#2E2B33] text-sm font-medium leading-normal tracking-tighter"
              >
                {t('share')}
              </Button>
            </div>
          </div>
        </StyledContainer>

        {/* Список рефералов */}
        <div className="w-[298px]">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-base font-semibold leading-tight tracking-tighter text-white">
              {t('your_referrals')}
            </h3>
            <div className="flex h-[21px] w-[26px] items-center justify-center rounded-lg bg-[#46434B]">
              <span className="text-[13px] font-semibold leading-tight tracking-tighter text-white">
                {referralCount}
              </span>
            </div>
          </div>
          <StyledContainer className="h-[141px] w-full">
            <div className="flex h-full w-full flex-col p-2">
              <div className="flex w-full justify-between text-xs text-gray-400">
                <span>{t('referrals')}</span>
                <span>{t('profit')}</span>
              </div>
              <hr className="my-2 w-full border-t border-white opacity-10" />
              {referrals?.map((ref, index) => (
                <div
                  key={index}
                  className="my-1 flex justify-between text-xs text-white"
                >
                  <span>{truncateUsername(ref.username)}</span>
                  <span>$0.00</span>
                </div>
              ))}
            </div>
          </StyledContainer>
        </div>
      </div>
    </div>
  );
}
