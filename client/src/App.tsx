import { useCallback, useEffect, useMemo, useState } from 'react';
import { isMiniAppDark, retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import axios, { AxiosError } from 'axios';
import { Socket } from 'socket.io-client';

import { ErrorAlert } from './components/ErrorAlert';
import { Notification } from './components/Notification';
import { PopSuccess } from './components/PopSuccess';
import { TurnPhoneOver } from './components/TurnPhoneOver';
import { PositionsProvider } from './context/PositionsContext';
import { SoundProvider } from './context/SoundContext';
import { useAppBackButton } from './hooks/useAppBackButton';
import { useAppUpdate } from './hooks/useAppUpdate';
import { AddWallet } from './pages/AddWallet';
import { ConfirmDeposit } from './pages/ConfirmDeposit';
import { ConfirmWithdraw } from './pages/ConfirmWithdraw';
import { Dashboard } from './pages/Dashboard';
import { Deposit } from './pages/Deposit';
import { DepositHistory } from './pages/DepositHistory';
import { GameRoom } from './pages/GameRoom';
import { More } from './pages/More';
import { Withdraw } from './pages/Withdraw';
import { apiService } from './services/api/api';
import { initSocket } from './services/websocket';
import { NotificationType } from './types/components';
import { initTelegramSdk } from './utils/init';

interface LaunchParams {
  initData?: string;
  tgWebAppData?: Record<string, string | Record<string, unknown>>;
  startPayload?: string;
}

type ApiError =
  | {
      message?: string;
      response?: {
        data?: unknown;
        status?: number;
      };
    }
  | string;

type PageData = {
  address?: string;
  trackerId?: string;
  currency?: string;
  roomId?: string;
  [key: string]: unknown;
};

type UserData = {
  id?: number | string;
  username?: string;
  first_name?: string;
  photo_url?: string;
};

interface UserProfile {
  id?: number;
  telegramId?: string;
  username?: string;
  avatar?: string | null;
  balance?: string | number;
  walletAddress?: string | null;
}

function isErrorResponse(data: unknown): data is { message: string } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof (data as { message: string }).message === 'string'
  );
}

type Page =
  | 'dashboard'
  | 'more'
  | 'deposit'
  | 'confirmDeposit'
  | 'withdraw'
  | 'confirmWithdraw'
  | 'addWallet'
  | 'depositHistory'
  | 'gameRoom';

function App() {
  const isDark = isMiniAppDark();
  const [error, setError] = useState<string | null>(null);
  const [isSdkInitialized, setIsSdkInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [balance, setBalance] = useState('0.00');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationType | null>(
    null,
  );
  const [isPhoneVertical, setIsPhoneVertical] = useState(false);

  useEffect(() => {
    console.log('client/src/App.tsx');
    if (window.innerWidth >= window.innerHeight) {
      setIsPhoneVertical(false);
    } else {
      setIsPhoneVertical(true);
    }

    window.addEventListener('resize', () => {
      // eslint-disable-next-line no-console
      console.log(window.innerWidth, window.innerHeight);
      if (window.innerWidth >= window.innerHeight) {
        setIsPhoneVertical(false);
      } else {
        setIsPhoneVertical(true);
      }
    });
  }, []);

  const { updateAvailable, updateApp } = useAppUpdate();

  const handleBack = useCallback(() => {
    if (
      currentPage === 'more' ||
      currentPage === 'deposit' ||
      currentPage === 'withdraw' ||
      currentPage === 'addWallet' ||
      currentPage === 'depositHistory' ||
      currentPage === 'gameRoom'
    ) {
      setCurrentPage('dashboard');
    } else if (currentPage === 'confirmDeposit') {
      setCurrentPage('deposit');
    } else if (currentPage === 'confirmWithdraw') {
      setCurrentPage('withdraw');
    }
  }, [currentPage]);

  useAppBackButton(isSdkInitialized && currentPage !== 'dashboard', handleBack);

  const userData = useMemo(() => {
    const params = retrieveLaunchParams() as LaunchParams;
    return (params.tgWebAppData as { user?: UserData })?.user || {};
  }, []);

  const handleSetCurrentPage = (page: Page, data: PageData | null = null) => {
    setCurrentPage(page);
    setPageData(data);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await initTelegramSdk();
        setIsSdkInitialized(true);
      } catch (error) {
        const errMsg = 'Failed to initialize SDK';
        // eslint-disable-next-line no-console
        console.error('[App]', errMsg, {
          error,
        });
        debugger; // eslint-disable-line no-debugger
        setError(errMsg);
      }

      const launchParams = retrieveLaunchParams() as LaunchParams;

      let initData: string | undefined = launchParams.initData;
      if (!initData && launchParams.tgWebAppData) {
        initData = new URLSearchParams(
          Object.entries(launchParams.tgWebAppData)
            .filter(([key]) => key !== 'hash' && key !== 'signature')
            .map(([key, value]) => {
              if (typeof value === 'object' && value !== null) {
                return [key, JSON.stringify(value)];
              }
              return [key, value.toString()];
            }),
        ).toString();
      }

      const loadData = async () => {
        if (!initData) {
          setError('Telegram initialization data not found.');
          return;
        }

        let profile: UserProfile | undefined;
        let roomIdFromPayload: string | undefined = undefined;
        let referrerIdFromPayload: string | undefined = undefined;
        try {
          if (
            launchParams.startPayload &&
            launchParams.startPayload.startsWith('join_')
          ) {
            const parts = launchParams.startPayload.split('_');
            if (parts.length > 2) {
              // join_roomId_referrerId
              roomIdFromPayload = parts[1];
              referrerIdFromPayload = parts[2];
            }
          } else if (launchParams.startPayload) {
            referrerIdFromPayload = launchParams.startPayload;
          }

          console.log('[App:loadData] try login', {
            launchParams,
            initData,
            roomIdFromPayload,
            referrerIdFromPayload, // startPayload
          });
          debugger;

          // XXX: Is it expected the "startPayload" parameter ("ref123-roomNAME")?
          await apiService.login(initData, referrerIdFromPayload);

          profile = await apiService.getProfile();

          setBalance(
            profile.balance !== undefined
              ? typeof profile.balance === 'number'
                ? profile.balance.toFixed(2)
                : parseFloat(profile.balance).toFixed(2)
              : '0.00',
          );
          setWalletAddress(profile.walletAddress || null);

          console.log('[App:loadData] after login, got profile', {
            profile,
            roomIdFromPayload,
            referrerIdFromPayload,
          });
          debugger;

          if (roomIdFromPayload) {
            try {
              await apiService.joinRoom(roomIdFromPayload);
              handleSetCurrentPage('gameRoom', {
                roomId: roomIdFromPayload,
                autoSit: true,
              });
            } catch (error) {
              let errorMessage = '';
              if (
                axios.isAxiosError(error) &&
                isErrorResponse(error.response?.data)
              ) {
                errorMessage = error.response.data.message;
              }

              if (
                errorMessage.toLowerCase().includes('insufficient') ||
                errorMessage.toLowerCase().includes('funds')
              ) {
                handleSetCurrentPage('deposit');
              } else {
                const errMsg = 'Failed to join room';
                // eslint-disable-next-line no-console
                console.error('[App:loadData]', errMsg, {
                  error,
                });
                debugger; // eslint-disable-line no-debugger
                setCurrentPage('dashboard');
                setNotification('gameJoinError');
              }
            }
          }

          // Создаем единое WebSocket соединение
          if (!socket) {
            console.log('[App:loadData] start with socket', {
              socket,
              profile,
            });
            debugger;
            const socketInstance = initSocket(profile.telegramId, {
              username: profile.username || 'Unknown',
              photo_url: profile.avatar || '',
            });
            setSocket(socketInstance);

            console.log('[App:loadData] got socketInstance', {
              socketInstance,
              socket,
              profile,
            });
            debugger;

            // Добавляем обработчики для баланса
            const handleBalanceUpdate = (event: CustomEvent) => {
              setBalance(event.detail.balance);
              if (event.detail.message) {
                setSuccessMessage(event.detail.message);
              }
            };

            window.addEventListener(
              'balanceUpdated',
              handleBalanceUpdate as EventListener,
            );

            // Очистка обработчика при размонтировании
            return () => {
              window.removeEventListener(
                'balanceUpdated',
                handleBalanceUpdate as EventListener,
              );
            };
          }
        } catch (error) {
          const apiError = error as ApiError;
          const axiosError = error as AxiosError;
          const errMsg = 'Failed to load data. Please try again later.';
          const errorMessage =
            typeof apiError === 'string'
              ? apiError
              : apiError.message || 'Unknown error';
          const response =
            typeof apiError === 'object' ? apiError.response : undefined;
          const responseData = response?.data;
          const request = axiosError?.request;
          // eslint-disable-next-line no-console
          console.error('[App:loadData]', errMsg, {
            errorMessage,
            responseData,
            profile,
            response,
            request,
            error,
            socket,
          });
          debugger; // eslint-disable-line no-debugger
          setError(errMsg);
        }
      };

      await loadData();
    };

    initialize();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <AppRoot
      className="overflow-x-hidden"
      appearance={isDark ? 'dark' : 'light'}
      platform="base"
    >
      <SoundProvider>
        {/* Уведомление об обновлении приложения */}
        {updateAvailable && (
          <div className="fixed left-0 right-0 top-0 z-50 bg-blue-600 p-3 text-center text-white">
            <span className="mr-2">Доступно обновление приложения</span>
            <button
              onClick={updateApp}
              className="rounded bg-white px-3 py-1 text-sm font-medium text-blue-600"
            >
              Обновить
            </button>
          </div>
        )}
        {!isPhoneVertical && <TurnPhoneOver />}
        {error ? (
          <ErrorAlert code={undefined} customMessage={error} />
        ) : currentPage === 'more' ? (
          <More userData={userData} setCurrentPage={handleSetCurrentPage} />
        ) : currentPage === 'deposit' ? (
          <Deposit setCurrentPage={handleSetCurrentPage} />
        ) : currentPage === 'confirmDeposit' &&
          pageData &&
          pageData.address &&
          pageData.trackerId ? (
          <ConfirmDeposit
            address={pageData.address}
            currency={pageData.currency ?? 'USDTTON'}
            trackerId={pageData.trackerId}
          />
        ) : currentPage === 'withdraw' ? (
          <Withdraw
            balance={balance}
            setCurrentPage={handleSetCurrentPage}
            setWithdrawAmount={setWithdrawAmount}
          />
        ) : currentPage === 'confirmWithdraw' ? (
          <ConfirmWithdraw
            withdrawAmount={withdrawAmount}
            walletAddress={walletAddress || ''}
          />
        ) : currentPage === 'addWallet' ? (
          <AddWallet
            setCurrentPage={handleSetCurrentPage}
            setWalletAddress={setWalletAddress}
          />
        ) : currentPage === 'depositHistory' ? (
          <DepositHistory
            setCurrentPage={handleSetCurrentPage}
            userId={String(userData.id)}
          />
        ) : currentPage === 'gameRoom' && pageData && pageData.roomId ? (
          <PositionsProvider>
            <GameRoom
              roomId={pageData.roomId}
              balance={balance}
              socket={socket}
              setCurrentPage={handleSetCurrentPage}
              userData={userData}
              pageData={pageData}
            />
          </PositionsProvider>
        ) : (
          <Dashboard
            onMoreClick={() => handleSetCurrentPage('more')}
            setCurrentPage={handleSetCurrentPage}
            balance={balance}
            walletAddress={walletAddress}
            socket={socket}
          />
        )}
        {successMessage && (
          <PopSuccess
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}
        {notification && (
          <Notification
            type={notification}
            onClose={() => setNotification(null)}
          />
        )}
      </SoundProvider>
    </AppRoot>
  );
}

export default App;
