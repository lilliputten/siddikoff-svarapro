import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useFilterState } from '@/hooks/useFilterState';
import { Button } from '@/components/Button/Button';
import { StyledContainer } from '@/components/StyledContainer';
import searchIcon from '@/assets/search.svg';
import slideDownIcon from '@/assets/slideDown.png';
import { FilterProps } from '@/types/components';

// import { CSSTransition } from "react-transition-group";
import { SlidePanel } from './SlidePanel';

export function Filter({
  onSearchChange,
  onAvailabilityChange,
  onRangeChange,
}: FilterProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isToggleOn, setIsToggleOn] = useFilterState();
  const [searchId, setSearchId] = useState('');
  const { t } = useTranslation('common');

  // Инициализируем состояние Dashboard при загрузке
  useEffect(() => {
    onAvailabilityChange(isToggleOn);
  }, [isToggleOn, onAvailabilityChange]); // Добавляем зависимости

  const handleTogglePanel = () => {
    setIsPanelOpen((prev) => !prev);
  };

  const handleToggleSwitch = () => {
    const newToggleState = !isToggleOn;
    setIsToggleOn(newToggleState);
    onAvailabilityChange(newToggleState);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchId(value);
    onSearchChange(value);
  };

  return (
    <div className="relative mb-4" style={{ zIndex: 25 }}>
      <StyledContainer
        className="mx-auto mt-6 h-[50px] w-[93vw]"
        contentClassName="w-full h-full flex items-center justify-between p-2"
      >
        <div className="relative w-[104px]">
          <input
            type="number"
            placeholder={t('room_number')}
            value={searchId}
            onChange={handleSearchChange}
            className="h-[30px] w-full rounded-lg bg-[rgba(19,18,23,0.34)] p-2 pl-8 text-center text-[10px] text-white"
            style={{
              boxShadow: 'inset 0px 0px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: '6px',
            }}
          />
          <img
            src={searchIcon}
            alt="Search icon"
            className="absolute left-2 top-1/2 h-[22px] w-[22px] -translate-y-1/2 transform"
          />
        </div>
        <Button
          layout="vertical"
          icon={slideDownIcon}
          iconPosition="right"
          iconClassName={`w-[15px] h-[7px] transition-transform duration-300 ${isPanelOpen ? 'rotate-180' : ''}`}
          onClick={handleTogglePanel}
          className="mx-2 h-[34px] w-[48px]"
          style={{ fontSize: '10px' }}
        >
          {t('stakes')}
        </Button>
        <div className="flex items-center">
          <span className="mr-2 text-[12px] text-white">
            {t('available_colon')}
          </span>
          <div
            className="relative flex h-[20px] w-[40px] cursor-pointer items-center rounded-full p-0.5"
            style={{
              background: isToggleOn
                ? 'linear-gradient(180deg, #AF6600 0%, #FFC53F 100%)'
                : '#2F2E35',
            }}
            onClick={handleToggleSwitch}
          >
            <div
              className="h-[16px] w-[16px] rounded-full bg-white transition-all duration-300"
              style={{
                transform: isToggleOn ? 'translateX(20px)' : 'translateX(0)',
              }}
            ></div>
          </div>
        </div>
      </StyledContainer>

      <SlidePanel
        isOpen={isPanelOpen}
        onClose={handleTogglePanel}
        onRangeChange={onRangeChange}
      />
    </div>
  );
}
