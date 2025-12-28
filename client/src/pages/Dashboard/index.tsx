import { useMemo, useState } from "react";
import { retrieveLaunchParams, type User } from "@telegram-apps/sdk-react";

import { AddWalletWindow } from "@/components/AddWalletWindow";
import { ButtonGroup } from "@/components/Dashboard/ButtonGroup";
import { Filter } from "@/components/Dashboard/Filter";
import { Header } from "@/components/Dashboard/Header";
import { RoomsList } from "@/components/Dashboard/RoomsList";
import { ConnectRoom } from "@/components/EnterGame/ConnectRoom";
import { CreatePrivate } from "@/components/EnterGame/CreatePrivate";
import { CreatePublic } from "@/components/EnterGame/CreatePublic";
import EnterGameMenu from "@/components/EnterGame/EnterGameMenu";
import { Footer } from "@/components/Footer";
import { LoadingPage } from "@/components/LoadingPage";
import { Notification } from "@/components/Notification";
import { DashboardProps, NotificationType } from "@/types/components";

export function Dashboard({
  onMoreClick,
  setCurrentPage,
  balance,
  walletAddress,
  socket,
}: DashboardProps) {
  const userData: User | undefined = useMemo(() => {
    const params = retrieveLaunchParams();
    return (params.tgWebAppData as { user?: User })?.user;
  }, []);

  const [searchId, setSearchId] = useState("");
  const [isAvailableFilter, setIsAvailableFilter] = useState(false);
  const [stakeRange, setStakeRange] = useState<[number, number]>([0, 1000000]);
  const [isAddWalletVisible, setIsAddWalletVisible] = useState(false);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [isEnterGameMenuVisible, setIsEnterGameMenuVisible] = useState(false);
  const [activeModal, setActiveModal] = useState<
    "createPublic" | "createPrivate" | "connectRoom" | null
  >(null);

  // Отладочные логи
  console.log("Dashboard render - isEnterGameMenuVisible:", isEnterGameMenuVisible);
  console.log("Dashboard render - activeModal:", activeModal);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const handleWithdrawClick = () => {
    if (walletAddress) {
      setCurrentPage("withdraw");
    } else {
      setIsAddWalletVisible(true);
    }
  };

  const handleComingSoon = () => {
    setNotification("comingSoon");
  };

  const handleCreateRoomClick = () => {
    console.log("handleCreateRoomClick called");
    setIsEnterGameMenuVisible(true);
  };

  const handleCloseEnterGameMenu = () => {
    console.log("handleCloseEnterGameMenu called");
    setIsEnterGameMenuVisible(false);
  };

  const openModal = (modal: "createPublic" | "createPrivate" | "connectRoom") => {
    setActiveModal(modal);
    setIsEnterGameMenuVisible(false);
  };

  const openEnterGameMenu = () => {
    console.log("openEnterGameMenu called");
    setActiveModal(null);
    setIsEnterGameMenuVisible(true);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  if (isCreatingRoom) {
    return <LoadingPage isLoading={true} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-primary">
      <div className="flex-1">
        <Header
          user={userData}
          balance={balance}
          onWithdrawClick={handleWithdrawClick}
          setCurrentPage={setCurrentPage}
        />
        <ButtonGroup
          onMoreClick={onMoreClick}
          onComingSoonClick={handleComingSoon}
          onCreateRoomClick={handleCreateRoomClick}
        />
        <Filter
          onSearchChange={setSearchId}
          onAvailabilityChange={setIsAvailableFilter}
          onRangeChange={setStakeRange}
        />
        <RoomsList
          searchId={searchId}
          isAvailableFilter={isAvailableFilter}
          stakeRange={stakeRange}
          socket={socket}
          setCurrentPage={setCurrentPage}
          balance={balance}
          setNotification={setNotification}
        />
      </div>
      <Footer />
      {isAddWalletVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <AddWalletWindow
            onClose={() => setIsAddWalletVisible(false)}
            onAdd={() => {
              setCurrentPage("addWallet");
              setIsAddWalletVisible(false);
            }}
          />
        </div>
      )}
      <EnterGameMenu
        isOpen={isEnterGameMenuVisible}
        onClose={handleCloseEnterGameMenu}
        openModal={openModal}
      />
      {activeModal === "createPublic" && (
        <CreatePublic
          onClose={closeModal}
          openModal={openEnterGameMenu}
          setCurrentPage={setCurrentPage}
          balance={balance}
          setNotification={setNotification}
          setIsCreatingRoom={setIsCreatingRoom}
        />
      )}
      {activeModal === "createPrivate" && (
        <CreatePrivate
          onClose={closeModal}
          openModal={openEnterGameMenu}
          setCurrentPage={setCurrentPage}
          balance={balance}
          setNotification={setNotification}
          setIsCreatingRoom={setIsCreatingRoom}
        />
      )}
      {activeModal === "connectRoom" && (
        <ConnectRoom
          onClose={closeModal}
          openModal={openEnterGameMenu}
          setCurrentPage={setCurrentPage}
        />
      )}
      <Notification type={notification} onClose={() => setNotification(null)} />
    </div>
  );
}
