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

      <span
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
          value ? "bg-emerald-500/90" : "bg-white/15"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}

function SoundSettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { optionsGame, toogleOptions } = useOptionsContext();

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
    <div
      className={`absolute right-0 top-[calc(100%+12px)] z-[70] w-[300px] max-w-[calc(100vw-24px)] transition-all ${
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <div
        ref={panelRef}
        className="overflow-hidden rounded-[28px] border border-fuchsia-300/20 bg-[linear-gradient(180deg,rgba(78,12,112,0.95)_0%,rgba(49,6,82,0.96)_55%,rgba(29,4,58,0.98)_100%)] shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      >
        <div className="border-b border-white/10 px-4 py-4">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-yellow-300/80">
            Audio Control
          </p>
          <h3 className="mt-1 text-lg font-black text-white">Sound Settings</h3>
        </div>

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
      <header className="sticky top-0 z-50 w-full border-b border-fuchsia-300/10 bg-[linear-gradient(180deg,rgba(56,6,88,0.92)_0%,rgba(43,6,72,0.86)_55%,rgba(30,4,55,0.82)_100%)] backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] w-full max-w-[430px] items-center justify-between px-3">
          {/* Left: logo */}
          <div className="flex items-center">
            <Logo
              width={220}
              height={95}
              sizeClass="w-[60px] xs:w-[92px] sm:w-[120px]"
              containerClassName="justify-start"
            />
          </div>

          {/* Right: settings, notification, user */}
          <div className="flex items-center gap-2">
            {/* Settings */}

            {/* Notification */}

            {/* Notification Bell */}
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

            {/* User */}
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

        {/* subtle glow line */}
        <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(255,215,0,0.45),transparent)]" />
      </header>

      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        topOffset={74}
      />

      <UserSidebar topOffset={74} />
    </>
  );
}
