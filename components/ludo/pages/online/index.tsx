"use client";

import { useUserContext } from "@/context/userContext";

import useGetRoomURL from "@/hooks/useGetRoomURL";
import { IDataSocket } from "@/interfaces";
import { TYPES_ONLINE_GAMEPLAY } from "@/utils/constants";
import { guid, randomNumber } from "@/utils/helpers";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import {
  Authenticate,
  BetAmount,
  Matchmaking,
  PlayWithFriends,
  TotalPlayers,
} from "./components";

const OnlinePage = () => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const { user, authOptions = [] } = useUserContext();

  /* ────────── play with friends flag ────────── */
  const [playWithFriends, setPlayWithFriends] = useState(false);

  /* ────────── selected bet amount for quick match ────────── */
  const [selectedBetAmount, setSelectedBetAmount] = useState<number | null>(null);

  /* ────────── socket payload state ────────── */
  const [dataSocket, setDataSocket] = useState<IDataSocket>({
    type: TYPES_ONLINE_GAMEPLAY.NONE,
    totalPlayers: 0,
    playAsGuest: false,
    roomName: "",
    user: {
      id: user?.id || guid(),
      name: user?.name || `Player ${randomNumber(1000, 9999)}`,
      email: user?.email || "",
    },
  });

  /* ────────── auto join room from url ────────── */
  useGetRoomURL(
    isAuthenticated,
    useCallback((data) => {
      setDataSocket((current) => ({ ...current, ...data }));
    }, [])
  );

  /* ────────── auth gate ────────── */
  if (!isAuthenticated && !dataSocket.playAsGuest) {
    return (
      <Authenticate
        authOptions={authOptions}
        handlePlayGuest={() => {
          setDataSocket({ ...dataSocket, playAsGuest: true });
        }}
      />
    );
  }

  /* ────────── number of players step ────────── */
  if (dataSocket.totalPlayers === 0 && !playWithFriends) {
    return (
      <TotalPlayers
        playAsGuest={dataSocket.playAsGuest}
        handlePlayWithFriends={() => setPlayWithFriends(true)}
        handleTotalPlayers={(total) => {
          /* ────────── wager flow only for authenticated two-player quick match ────────── */
          if (total === 2) {
            if (!isAuthenticated) {
              swal({
                title: "Login required",
                text: "Wager match is available only for logged-in users",
                icon: "info",
              });
              return;
            }

            setDataSocket({
              ...dataSocket,
              type: TYPES_ONLINE_GAMEPLAY.JOIN_EXISTING_ROOM,
              totalPlayers: total,
            });
            return;
          }

          setDataSocket({
            ...dataSocket,
            type: TYPES_ONLINE_GAMEPLAY.JOIN_EXISTING_ROOM,
            totalPlayers: total,
          });
        }}
      />
    );
  }

  /* ────────── wager amount step for two-player quick match ────────── */
  if (
    dataSocket.totalPlayers === 2 &&
    !playWithFriends &&
    !dataSocket.roomName &&
    selectedBetAmount === null
  ) {
    return (
      <BetAmount
        onBack={() => {
          setSelectedBetAmount(null);
          setDataSocket((current) => ({
            ...current,
            totalPlayers: 0,
            betAmount: undefined,
            reservationId: undefined,
          }));
        }}
        onConfirm={(amount) => {
          setSelectedBetAmount(amount);
          setDataSocket((current) => ({
            ...current,
            type: TYPES_ONLINE_GAMEPLAY.JOIN_EXISTING_ROOM,
            totalPlayers: 2,
            betAmount: amount,
          }));
        }}
      />
    );
  }

  /* ────────── play with friends room step ────────── */
  if (playWithFriends && !dataSocket.roomName) {
    return (
      <PlayWithFriends
        handlePlayWithFriends={(data) =>
          setDataSocket({ ...dataSocket, ...data })
        }
      />
    );
  }

  /* ────────── matchmaking / game screen ────────── */
  return <Matchmaking dataSocket={dataSocket} />;
};

export default OnlinePage;
