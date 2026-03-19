"use client";
import React from "react";

type Props = {
  label: string;
  value: string;
};

const ReadonlyField: React.FC<Props> = ({ label, value }) => {
  return (
    <div className="mt-4">
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        value={value}
        readOnly
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
      />
    </div>
  );
};

export default ReadonlyField;
