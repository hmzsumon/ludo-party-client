"use client";
import React from "react";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  error?: string;
};

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
    <path d="M12 17a2 2 0 1 0 .001-3.999A2 2 0 0 0 12 17zm6-7h-1V7a5 5 0 0 0-10 0v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-8 0V7a2 2 0 0 1 4 0v3H10z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
    <path d="M12 4.5C4.73 4.5 1 12 1 12s3.73 7.5 11 7.5S23 12 23 12 19.27 4.5 12 4.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
    <path d="M12 6c3.86 0 7.16 2.23 8.82 5.5-.46.92-1.08 1.76-1.82 2.5l1.41 1.41C22.09 13.88 23 12 23 12S19.27 4.5 12 4.5c-1.08 0-2.1.14-3.06.41l1.64 1.64C11.08 6.18 11.53 6 12 6zM2.1 2.1L.69 3.51 4.2 7.02C2.69 8.12 1.5 9.46 1 10.5c0 0 3.73 7.5 11 7.5 1.56 0 3.03-.28 4.37-.79l2.62 2.62 1.41-1.41L2.1 2.1zM12 16c-2.21 0-4-1.79-4-4 0-.55.11-1.07.31-1.54l1.5 1.5c-.03.17-.05.35-.05.54 0 1.66 1.34 3 3 3 .19 0 .37-.02.54-.05l1.5 1.5c-.47.2-.99.31-1.54.31z" />
  </svg>
);

const PasswordField: React.FC<Props> = ({
  label,
  value,
  onChange,
  show,
  onToggle,
  error,
}) => {
  return (
    <div className="mt-2">
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
          <LockIcon />
        </span>

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) =>
            onChange(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="* Transaction password"
          className="w-full rounded-lg border border-slate-300 bg-white px-10 py-2 pr-10 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle password"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordField;
