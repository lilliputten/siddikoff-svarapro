import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import noconnectIcon from '../../assets/noconnect.png';
import { Slider } from '../Slider';

interface NoConnectProps {
  isVisible: boolean;
  onRetry?: () => void;
}

export function NoConnect({ isVisible, onRetry }: NoConnectProps) {
  const { t } = useTranslation('common');
  const [imgError, setImgError] = useState(false);

  return (
    <Slider isOpen={isVisible} onClose={onRetry || (() => {})} height="209px">
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Иконка */}
        <div
          style={{
            width: '69px',
            height: '69px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!imgError ? (
            <img
              src={noconnectIcon}
              alt="No connection"
              style={{ width: '69px', height: '69px' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              style={{
                width: '69px',
                height: '69px',
                backgroundColor: '#FF443A',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              !
            </div>
          )}
        </div>

        {/* Заголовок */}
        <h3
          className="mb-2 text-white"
          style={{
            fontWeight: 700,
            fontStyle: 'normal',
            fontSize: '16px',
            lineHeight: '150%',
            letterSpacing: '-1.1%',
            textAlign: 'center',
            verticalAlign: 'middle',
          }}
        >
          {t('no_internet_connection')}
        </h3>

        {/* Описание */}
        <p
          className="text-white"
          style={{
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: '13px',
            lineHeight: '150%',
            letterSpacing: '-1.1%',
            textAlign: 'center',
            verticalAlign: 'middle',
          }}
        >
          {t('check_internet_connection')}
        </p>
      </div>
    </Slider>
  );
}
