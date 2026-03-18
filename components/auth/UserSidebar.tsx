"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { closeUserSidebar } from "@/redux/features/ui/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";

import LogoutButton from "./LogoutButton";
import UserBalanceInfo from "./UserBalanceInfo";

const UserSidebar = () => {
  const isUserSidebarOpen = useSelector(
    (state: any) => state.sidebar.isUserSidebarOpen,
  );
  const dispatch = useDispatch();

  return (
    <div className="relative">
      <div className="p-2">
        <Sheet
          open={isUserSidebarOpen}
          onOpenChange={() => dispatch(closeUserSidebar())}
        >
          <SheetContent
            side="right"
            className="
              !top-[42px] md:!top-[50px]
              h-[calc(100dvh-68px)] md:h-[calc(100dvh-80px)]
              w-full max-w-[360px]
              border-none p-0
              bg-transparent shadow-none
              overflow-hidden
              [&>button]:hidden
            "
          >
            <div
              className="
                flex h-full flex-col
                rounded-l-3xl
                border border-white/10
                bg-[linear-gradient(180deg,rgba(5,22,58,0.98)_0%,rgba(7,31,76,0.98)_48%,rgba(4,18,44,0.98)_100%)]
                text-white
                shadow-[0_18px_50px_rgba(0,0,0,0.38)]
                backdrop-blur-xl
              "
            >
              <div className="border-b border-white/10 px-5 pb-4 pt-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
                      Account
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold tracking-wide text-white">
                      User Menu
                    </h2>
                  </div>

                  <button
                    onClick={() => dispatch(closeUserSidebar())}
                    className="
                      inline-flex h-11 w-11 items-center justify-center rounded-full
                      border border-white/10
                      bg-white/10 text-white
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]
                      transition hover:bg-white/15
                    "
                    aria-label="Close sidebar"
                  >
                    <span className="text-xl leading-none">×</span>
                  </button>
                </div>

                <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                  <UserBalanceInfo />
                </div>
              </div>

              <div className="mt-auto border-t border-white/10 p-4">
                <div className="rounded-2xl border border-red-400/15 bg-red-500/10 p-2">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default UserSidebar;
