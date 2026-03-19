"use client";

import socketUrl from "@/config/socketUrl";
import { apiSlice } from "@/redux/features/api/apiSlice";
import { SocketUser } from "@/types";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

interface iSocketContextType {
  socket: Socket | null;
  isSocketConnected: boolean;
  onlineUsers: SocketUser[];
}

export const SocketContext = createContext<iSocketContextType | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<SocketUser[]>([]);

  /* ────────── sound ────────── */
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/ball.mp3");

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  /* ────────── connect socket ────────── */
  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
    });

    /* ────────── socket context debug events ────────── */
    newSocket.on("connect", () => {
      console.log("🟢 context socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (err: any) => {
      console.error("🔴 context socket connect_error:", err?.message, err);
    });

    newSocket.on("disconnect", (reason: string) => {
      console.warn("🟠 context socket disconnected:", reason);
    });

    newSocket.on("connect", () => {
      /* ────────── standard personal room join ────────── */
      newSocket.emit("join-room", String(user._id));

      if (user?.role === "admin") {
        newSocket.emit("join-admin-room");
      }

      if (user?.role === "agent") {
        newSocket.emit("join-agent-room");
      }

      setSocket(newSocket);
      setIsSocketConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
      setIsSocketConnected(false);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsSocketConnected(false);
    };
  }, [user?._id, user?.role]);

  /* ────────── socket listeners ────────── */
  useEffect(() => {
    if (!socket) return;

    const onGetUsers = (users: SocketUser[]) => {
      setOnlineUsers(users);
    };

    const onUserNotification = (payload: any) => {
      const n = payload?.notification;
      if (!n?._id) return;

      toast.success(payload?.message || n?.title || "New notification");

      /* ────────── balance update instantly (refetch load-user) ────────── */
      dispatch(apiSlice.util.invalidateTags([{ type: "User", id: "ME" }]));

      /* ────────── optional: deposit list refresh (if you want) ────────── */
      dispatch(apiSlice.util.invalidateTags(["Deposits"]));

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    };

    const onAdminNotification = (payload: any) => {
      const n = payload?.notification;
      if (!n?._id) return;

      toast.success(payload?.message || n?.title || "Admin notification");

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    };

    socket.on("getUsers", onGetUsers);
    socket.on("user-notification", onUserNotification);
    socket.on("admin-notification", onAdminNotification);

    return () => {
      socket.off("getUsers", onGetUsers);
      socket.off("user-notification", onUserNotification);
      socket.off("admin-notification", onAdminNotification);
    };
  }, [socket, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isSocketConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
