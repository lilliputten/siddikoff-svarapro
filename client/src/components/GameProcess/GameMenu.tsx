import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@/hooks/useLanguage';
import exitIcon from '@/assets/game/exit.svg';
import volumeIcon from '@/assets/game/volume.svg';
import languageIcon from '@/assets/language.png';
import slideDownIcon from '@/assets/slideDown.png';
import { useSoundContext } from '@/context/SoundContext';
import { GameMenuProps } from '@/types/components';

import LanguageSelector from '../Language';
import { StyledContainer } from '../StyledContainer';
import { ExitMenu } from './ExitMenu';

const languageKeyMap: { [key: string]: string } = {
  ru: 'russian',
  en: 'english',
};

export function GameMenu({ isOpen, onClose, onExit }: GameMenuProps) {
  const [showExitMenu, setShowExitMenu] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const { isSoundEnabled, toggleSound } = useSoundContext();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (!isOpen) {
      setShowExitMenu(false);
      setShowLanguageSelector(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExitClick = () => {
    setShowExitMenu(true);
  };

  const handleExitConfirm = () => {
    setShowExitMenu(false);
    onExit();
  };

  const handleExitCancel = () => {
    setShowExitMenu(false);
  };

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="h-[150px] w-[250px]" onClick={(e) => e.stopPropagation()}>
        <StyledContainer
          className="h-full w-full rounded-lg"
          contentClassName="flex flex-col items-center justify-center px-4 space-y-2"
        >
          <div
            className="flex h-8 w-[225px] items-center justify-between rounded-lg px-3 transition-all duration-200 ease-in-out"
            style={{ backgroundColor: 'rgba(19, 18, 23, 0.7)' }}
            onClick={() => setShowLanguageSelector(true)}
          >
            <div className="flex items-center space-x-2">
              <img src={languageIcon} alt="Language" className="h-4 w-4" />
              <span
                className="text-white"
                style={{ fontWeight: 500, fontSize: '12px' }}
              >
                {t('current_language')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className="text-white"
                style={{ fontWeight: 500, fontSize: '12px' }}
              >
                {t(languageKeyMap[currentLanguage] || 'russian')}
              </span>
              <img
                src={slideDownIcon}
                alt="arrow"
                className="h-[7px] w-[15px]"
              />
            </div>
          </div>
          {/* Sound Toggle */}
          <div
            className="flex h-8 w-[225px] items-center justify-between rounded-lg px-3 transition-all duration-200 ease-in-out"
            style={{ backgroundColor: 'rgba(19, 18, 23, 0.7)' }}
          >
            <div className="flex items-center space-x-2">
              <img src={volumeIcon} alt="Звук" className="h-4 w-4" />
              <span
                className="text-white"
                style={{ fontWeight: 500, fontSize: '12px' }}
              >
                {t('sound')}
              </span>
            </div>
            <div
              className="relative flex h-[20px] w-[40px] cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300"
              style={{ background: isSoundEnabled ? '#31EA3D' : '#2F2E35' }}
              onClick={toggleSound}
            >
              <div
                className="h-[16px] w-[16px] rounded-full bg-white transition-all duration-300"
                style={{
                  transform: isSoundEnabled
                    ? 'translateX(20px)'
                    : 'translateX(0)',
                }}
              ></div>
            </div>
          </div>

          {/* Exit Button */}
          <button
            onClick={handleExitClick}
            className="flex h-8 w-[225px] items-center justify-start space-x-2 rounded-lg px-3 transition-all duration-200 ease-in-out hover:opacity-80"
            style={{ backgroundColor: 'rgba(19, 18, 23, 0.7)' }}
          >
            <img src={exitIcon} alt="Выйти" className="h-4 w-4" />
            <span
              className="text-white"
              style={{ fontWeight: 500, fontSize: '12px' }}
            >
              {t('exit')}
            </span>
          </button>
        </StyledContainer>
      </div>

      {showExitMenu && (
        <ExitMenu onClose={handleExitCancel} onConfirm={handleExitConfirm} />
      )}
      <LanguageSelector
        isOpen={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        zIndex={60}
      />
    </div>
  );
}
