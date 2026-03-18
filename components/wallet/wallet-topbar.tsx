"use client";

import { useSelector } from "react-redux";
import LudoPartyLogo from "../branding/LudoPartyLogo";

const WalletTopbar = () => {
  const { user } = useSelector((s: any) => s.auth) as any;

  return (
    <div className="  flex w-full items-center justify-between">
      {/* ────────── Logo Block ────────── */}
      <div>
        <LudoPartyLogo />
      </div>
    </div>
  );
};

export default WalletTopbar;
