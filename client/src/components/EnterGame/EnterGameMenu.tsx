import React from 'react';

import './EnterGameMenu.css';

import { useTranslation } from 'react-i18next';

import lockIcon from '@/assets/lock.png';
import partyIcon from '@/assets/party.png';
import plusIcon from '@/assets/plus.png';

import { Slider } from '../Slider';

interface EnterGameMenuProps {
  isOpen: boolean;
  onClose: () => void;
  openModal: (type: 'createPublic' | 'createPrivate' | 'connectRoom') => void;
}

const EnterGameMenu: React.FC<EnterGameMenuProps> = ({
  isOpen,
  onClose,
  openModal,
}) => {
  const { t } = useTranslation('common');

  // console.log('EnterGameMenu render - isOpen:', isOpen);

  return (
    <Slider isOpen={isOpen} onClose={onClose} height="250px">
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="absolute left-[50%] top-[10px] h-[4px] w-[47px] -translate-x-[50%] rounded-2xl bg-[#949494] bg-opacity-50"></div>
        <div className="modal-content rounded-[15px] bg-[#18171C] px-[30px]">
          <button
            className="menu-button relative flex items-center justify-center"
            onClick={() => openModal('createPublic')}
          >
            <img
              src={plusIcon}
              alt="Create"
              className="absolute left-[20px] top-[50%] h-[26px] w-[26px] -translate-y-[50%]"
            />
            <span className="menu-button-text" style={{ marginLeft: '0px' }}>
              {t('create_room')}
            </span>
          </button>
          <div className="divider"></div>
          <button
            className="menu-button relative flex items-center justify-center"
            onClick={() => openModal('createPrivate')}
          >
            <img
              src={lockIcon}
              alt="Create Private"
              className="absolute left-[20px] top-[50%] h-[26px] w-[26px] -translate-y-[50%]"
            />
            <span className="menu-button-text">{t('create_private_room')}</span>
          </button>
          <div className="divider"></div>
          <button
            className="menu-button relative flex items-center justify-center"
            onClick={() => openModal('connectRoom')}
          >
            <img
              src={partyIcon}
              alt="Join"
              className="absolute left-[20px] top-[50%] h-[28px] w-[28px] -translate-y-[50%]"
            />
            <span className="menu-button-text">{t('join_room')}</span>
          </button>
        </div>
      </div>
    </Slider>
  );
};

export default EnterGameMenu;
