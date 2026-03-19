"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import swal from "sweetalert";

import socketUrl from "@/config/socketUrl";
import type {
  IDataOnline,
  IDataRoom,
  IDataRoomSocket,
  IDataSocket,
  TSocketErrors,
} from "@/interfaces";
import { apiSlice } from "@/redux/features/api/apiSlice";
import {
  useCancelLudoWagerMutation,
  useReserveLudoWagerMutation,
} from "@/redux/features/ludoWager/ludoWagerApi";
import {
  SOCKET_ERROR_MESSAGES,
  SocketErrors,
  TYPES_ONLINE_GAMEPLAY,
} from "@/utils/constants";
import { getDataOnlineGame, updateDataRoomSocket } from "@/utils/sockets";
import { useDispatch } from "react-redux";
import useShowMessageRedirect from "./useShowMessageRedirect";

const useSocket = (connectionData: IDataSocket) => {
  const dispatch = useDispatch();
  const setRedirect = useShowMessageRedirect();
  const [reserveWager] = useReserveLudoWagerMutation();
  const [cancelWager] = useCancelLudoWagerMutation();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [dataRoomSocket, setDataRoomSocket] = useState<IDataRoomSocket | null>(
    null,
  );
  const [dataOnlineGame, setDataOnlineGame] = useState<IDataOnline | null>(
    null,
  );

  const currentUser = useMemo(() => connectionData.user, [connectionData.user]);
  const reservationIdRef = useRef<string>(connectionData.reservationId || "");
  const matchedRef = useRef(false);

  /* ────────── keep current reservation id synced ────────── */
  useEffect(() => {
    reservationIdRef.current =
      connectionData.reservationId || reservationIdRef.current;
  }, [connectionData.reservationId]);

  useEffect(() => {
    let mounted = true;
    let newSocket: Socket | null = null;

    const cleanupReservation = async () => {
      if (
        !reservationIdRef.current ||
        matchedRef.current ||
        connectionData.type !== TYPES_ONLINE_GAMEPLAY.JOIN_EXISTING_ROOM ||
        !connectionData.betAmount
      ) {
        return;
      }

      try {
        await cancelWager({ reservationId: reservationIdRef.current }).unwrap();
      } catch {
        /* ────────── ignore cleanup cancellation error ────────── */
      }
    };

    const boot = async () => {
      try {
        let finalConnectionData = { ...connectionData };

        /* ────────── reserve wager before quick-match socket connect ────────── */
        if (
          connectionData.type === TYPES_ONLINE_GAMEPLAY.JOIN_EXISTING_ROOM &&
          connectionData.totalPlayers === 2 &&
          Number(connectionData.betAmount) > 0
        ) {
          if (connectionData.playAsGuest) {
            swal({
              title: "Login required",
              text: "Wager match is available only for logged-in users",
              icon: "info",
            });
            setRedirect({
              message: {
                title: "Please login to join wager match",
                icon: "info",
                timer: 4000,
              },
            });
            return;
          }

          if (!reservationIdRef.current) {
            const reserveResponse = await reserveWager({
              amount: Number(connectionData.betAmount),
              totalPlayers: 2,
            }).unwrap();
            reservationIdRef.current = reserveResponse.reservationId;
          }

          finalConnectionData = {
            ...finalConnectionData,
            reservationId: reservationIdRef.current,
          };
        }

        if (!mounted) return;

        newSocket = io(socketUrl, {
          withCredentials: true,
          transports: ["websocket", "polling"],
          autoConnect: true,
          reconnection: true,
        });

        /* ────────── socket context debug events ────────── */
        newSocket.on("connect", () => {
          console.log("🟢 context socket connected:", newSocket?.id);
        });

        newSocket.on("connect_error", (err: any) => {
          console.error("🔴 context socket connect_error:", err?.message, err);
        });

        newSocket.on("disconnect", (reason: string) => {
          console.warn("🟠 context socket disconnected:", reason);
        });

        setSocket(newSocket);

        /* ────────── socket connection error ────────── */
        const handleConnectError = (err: Error) => {
          console.error("🔴 socket connect_error:", err?.message, err);
          setRedirect({
            message: {
              title: "Error connecting to socket",
              icon: "error",
              timer: 5000,
            },
          });
        };

        /* ────────── socket connected and send payload ────────── */
        const handleConnect = () => {
          newSocket?.emit(
            "NEW_USER",
            finalConnectionData,
            (error?: TSocketErrors | null) => {
              if (!error) return;

              const isAuthError =
                error === SocketErrors.AUTHENTICATED ||
                error === SocketErrors.UNAUTHENTICATED;

              if (isAuthError) {
                return swal({
                  title: "Authentication Error",
                  text: SOCKET_ERROR_MESSAGES[error],
                  icon: "info",
                  closeOnClickOutside: false,
                  closeOnEsc: false,
                  timer: 5000,
                }).then(() => window.location.reload());
              }

              setRedirect({
                message: {
                  title:
                    SOCKET_ERROR_MESSAGES[error] ??
                    "Unknown socket error occured",
                  icon: "error",
                  timer: 5000,
                },
              });
            },
          );
        };

        /* ────────── update room players and launch game ────────── */
        const handleOpponentUpdate = (dataRoom: IDataRoom) => {
          const newDataRoomSocket = updateDataRoomSocket(dataRoom, currentUser);
          setDataRoomSocket(newDataRoomSocket);

          if (newDataRoomSocket.isFull) {
            matchedRef.current = true;
            const newDataOnlineGame = getDataOnlineGame(
              newDataRoomSocket,
              dataRoom,
            );
            setDataOnlineGame({
              ...newDataOnlineGame,
              socket: newSocket as Socket,
              betAmount: dataRoom.betAmount,
            });
          }
        };

        /* ────────── wager settled notification ────────── */
        const handleWagerSettled = () => {
          /* ────────── balance update instantly (refetch load-user) ────────── */
          dispatch(apiSlice.util.invalidateTags([{ type: "User", id: "ME" }]));
          reservationIdRef.current = "";
        };

        newSocket.on("connect", handleConnect);
        newSocket.on("connect_error", handleConnectError);
        newSocket.on("UPDATE_OPPONENT", handleOpponentUpdate);
        newSocket.on("WAGER_SETTLED", handleWagerSettled);
      } catch (error: any) {
        swal({
          title: "Match setup failed",
          text:
            error?.data?.message ||
            error?.message ||
            "Unable to start wager match",
          icon: "error",
        });
        setRedirect({
          message: {
            title: "Unable to start wager match",
            icon: "error",
            timer: 4000,
          },
        });
      }
    };

    boot();

    return () => {
      mounted = false;
      if (newSocket) {
        newSocket.disconnect();
      }
      setSocket(null);
      setDataRoomSocket(null);
      setDataOnlineGame(null);
      void cleanupReservation();
    };
  }, [cancelWager, connectionData, currentUser, reserveWager, setRedirect]);

  return { socket, dataRoomSocket, dataOnlineGame };
};

export default useSocket;
