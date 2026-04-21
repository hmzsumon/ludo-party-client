"use client";

import { UserCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import NotificationDrawer from "@/components/auth/NotificationDrawer";
import UserSidebar from "@/components/auth/UserSidebar";
import Logo from "@/components/branding/logo";
import { useOptionsContext } from "@/context/optionContext";
import { useGetMyUnreadNotificationsCountQuery } from "@/redux/features/notifications/notificationApi";
import { openUserSidebar } from "@/redux/features/ui/sidebarSlice";
import { EOptionsGame } from "@/utils/constants";
import Icon from "../ludo/icon";

/* ──────────  Toggle Button  ────────── */
function SettingToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
    >
      <span className="text-sm font-semibold text-white/90">{label}</span>

      {/* ── Toggle knob ── */}
      <span
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
          value ? "bg-emerald-500/90" : "bg-white/15"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}

/* ──────────  Sound Settings Panel  ────────── */
function SoundSettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { optionsGame, toogleOptions } = useOptionsContext();

  /* ── Close on outside click / Escape ── */
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current && !panelRef.current.contains(target)) {
        onClose();
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  return (
    /*
     * ── Overlay wrapper ──
     * fixed + inset-0 দিয়ে পুরো screen cover করে
     * তারপর flex দিয়ে panel কে center এ রাখি
     * pointer-events: none যখন বন্ধ, যাতে নিচের UI block না হয়
     */
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center transition-all duration-300 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* ── Backdrop (dim) ── */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* ── Panel ── */}
      <div
        ref={panelRef}
        className={`
          relative z-10 w-[300px] max-w-[calc(100vw-32px)]
          overflow-hidden rounded-[28px]
          transition-all duration-300 ease-out
          ${
            open
              ? "translate-x-0 opacity-100 scale-100"
              : "-translate-x-8 opacity-0 scale-95"
          }
        `}
        style={{
          /* ── App থিমের সাথে মিল রেখে deep purple গ্লাসমর্ফিজম ── */
          background:
            "linear-gradient(145deg, rgba(60,10,100,0.97) 0%, rgba(25,5,65,0.97) 100%)",
          border: "1px solid rgba(167,139,250,0.25)",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.08) inset",
        }}
      >
        {/* ── Header ── */}
        <div
          className="border-b px-5 py-4"
          style={{ borderColor: "rgba(167,139,250,0.15)" }}
        >
          <p
            className="text-[11px] font-black uppercase tracking-[0.28em]"
            style={{ color: "#00e5cc" }}
          >
            Audio Control
          </p>
          <h3 className="mt-1 text-lg font-black text-white">Sound Settings</h3>
        </div>

        {/* ── Toggles ── */}
        <div className="space-y-3 p-4">
          <SettingToggle
            label="Sound Effects"
            value={optionsGame[EOptionsGame.SOUND]}
            onChange={() => toogleOptions(EOptionsGame.SOUND)}
          />
          <SettingToggle
            label="Background Music"
            value={optionsGame[EOptionsGame.MUSIC]}
            onChange={() => toogleOptions(EOptionsGame.MUSIC)}
          />
          <SettingToggle
            label="Chat Sound"
            value={optionsGame[EOptionsGame.CHAT]}
            onChange={() => toogleOptions(EOptionsGame.CHAT)}
          />
        </div>
      </div>
    </div>
  );
}

/* ──────────  Auth Top Bar  ────────── */
export default function AuthTopBar() {
  const dispatch = useDispatch();

  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { data: countData } = useGetMyUnreadNotificationsCountQuery(undefined, {
    pollingInterval: 30000,
  });

  const unreadCount = countData?.dataCount ?? 0;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] w-full max-w-[430px] items-center justify-between px-6">
          {/* ── Left: Logo ── */}
          <div className="flex items-center">
            <Logo
              width={220}
              height={95}
              sizeClass="w-[60px]"
              containerClassName="justify-start"
            />
          </div>

          {/* ── Right: Settings, Notification, User ── */}
          <div className="flex items-center gap-2">
            {/* ── Settings button ── */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setSettingsOpen((prev) => !prev);
                  setNotifOpen(false);
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:bg-white/14"
                aria-label="Open settings"
              >
                <div className="h-5 w-5 [&_svg]:h-5 [&_svg]:w-5">
                  <Icon type="gear" />
                </div>
              </button>
            </div>

            {/* ── Notification Bell ── */}
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-full"
              type="button"
              onClick={() => {
                setNotifOpen(true);
                setSettingsOpen(false);
              }}
              style={{
                background:
                  "linear-gradient(135deg, rgba(74,26,138,0.95) 0%, rgba(29,5,70,0.95) 100%)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              }}
            >
              <span className="text-lg">🔔</span>
              {unreadCount > 0 && (
                <span className="pointer-events-none absolute -right-1 -top-1 min-w-[19px] rounded-full border border-[#3c0a54] bg-emerald-400 px-1 text-center text-[10px] font-black leading-4 text-[#24043d]">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* ── User Avatar ── */}
            <button
              type="button"
              onClick={() => {
                setSettingsOpen(false);
                setNotifOpen(false);
                dispatch(openUserSidebar());
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:bg-white/14"
              aria-label="Open user menu"
            >
              <UserCircle2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── Bottom glow line ── */}
        <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.45),transparent)]" />
      </header>

      {/* ── Sound Settings Panel (centered overlay) ── */}
      <SoundSettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* ── Notification Drawer ── */}
      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        topOffset={74}
      />

      {/* ── User Sidebar ── */}
      <UserSidebar topOffset={74} />
    </>
  );
}
