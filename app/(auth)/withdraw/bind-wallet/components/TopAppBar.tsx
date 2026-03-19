"use client";
import React from "react";

type Props = {
  title: string;
  onBack: () => void;
};

const TopAppBar: React.FC<Props> = ({ title, onBack }) => {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 bg-[#0f4d3f] px-4 py-3 text-[#ffd54a]">
      <button
        type="button"
        className="rounded p-1 hover:bg-black/10"
        aria-label="Back"
        onClick={onBack}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          className="fill-current"
        >
          <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  );
};

export default TopAppBar;
