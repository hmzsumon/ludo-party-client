"use client";
import React from "react";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
};

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
    <path d="M17 1H7C5.9 1 5 1.9 5 3v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z" />
  </svg>
);

const AccountNumberField: React.FC<Props> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
}) => {
  return (
    <div className="mt-3">
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
          <PhoneIcon />
        </span>

        <input
          value={value}
          onChange={(e) =>
            onChange(e.target.value.replace(/\D/g, "").slice(0, 11))
          }
          inputMode="numeric"
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-300 bg-white px-10 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default AccountNumberField;
