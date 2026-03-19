"use client";
import React from "react";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  leftIcon?: "user";
  helperText?: string;
  error?: string;
};

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
  </svg>
);

const TextField: React.FC<Props> = ({
  label,
  value,
  onChange,
  placeholder,
  leftIcon,
  helperText,
  error,
}) => {
  return (
    <div className="mt-4">
      <div className="mb-1 flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
      </div>

      <div className="relative">
        {leftIcon === "user" && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
            <UserIcon />
          </span>
        )}

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-300 bg-white px-10 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
        />
      </div>

      {helperText && (
        <p className="mt-2 text-[13px] leading-5 text-red-600">{helperText}</p>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default TextField;
