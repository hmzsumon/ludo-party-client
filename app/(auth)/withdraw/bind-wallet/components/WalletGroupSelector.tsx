"use client";
import React from "react";
import { WalletGroup } from "../page";

type Props = {
  group: WalletGroup;
  onChange: (g: WalletGroup) => void;
  bkashIcon: React.ReactNode;
  nagadIcon: React.ReactNode;
};

const WalletGroupSelector: React.FC<Props> = ({
  group,
  onChange,
  bkashIcon,
  nagadIcon,
}) => {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">
        Select E-wallet group
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange("bkash")}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition
            ${
              group === "bkash"
                ? "border-pink-500 bg-pink-50 ring-2 ring-pink-300"
                : "border-slate-200 hover:bg-slate-50"
            }`}
        >
          {bkashIcon}
        </button>

        <button
          type="button"
          onClick={() => onChange("nagad")}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition
            ${
              group === "nagad"
                ? "border-amber-500 bg-amber-50 ring-2 ring-amber-300"
                : "border-slate-200 hover:bg-slate-50"
            }`}
        >
          {nagadIcon}
        </button>
      </div>
    </div>
  );
};

export default WalletGroupSelector;
