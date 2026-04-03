"use client";

// ✅ CountrySelectDrawer.tsx
// Screenshot এর মতো হুবহু country select bottom drawer
// Features: search by name/code, recommended (BD first), flag emoji, radio select

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

/* ────────── Country Data ────────── */
const COUNTRY_LIST = [
  { code: "+880", name: "Bangladesh", flag: "🇧🇩", iso: "BD" },
  { code: "+7", name: "Abkhazia", flag: "🏳️", iso: "AB" },
  { code: "+93", name: "Afghanistan", flag: "🇦🇫", iso: "AF" },
  { code: "+355", name: "Albania", flag: "🇦🇱", iso: "AL" },
  { code: "+213", name: "Algeria", flag: "🇩🇿", iso: "DZ" },
  { code: "+376", name: "Andorra", flag: "🇦🇩", iso: "AD" },
  { code: "+244", name: "Angola", flag: "🇦🇴", iso: "AO" },
  { code: "+54", name: "Argentina", flag: "🇦🇷", iso: "AR" },
  { code: "+374", name: "Armenia", flag: "🇦🇲", iso: "AM" },
  { code: "+61", name: "Australia", flag: "🇦🇺", iso: "AU" },
  { code: "+43", name: "Austria", flag: "🇦🇹", iso: "AT" },
  { code: "+994", name: "Azerbaijan", flag: "🇦🇿", iso: "AZ" },
  { code: "+973", name: "Bahrain", flag: "🇧🇭", iso: "BH" },
  { code: "+32", name: "Belgium", flag: "🇧🇪", iso: "BE" },
  { code: "+55", name: "Brazil", flag: "🇧🇷", iso: "BR" },
  { code: "+1", name: "Canada", flag: "🇨🇦", iso: "CA" },
  { code: "+86", name: "China", flag: "🇨🇳", iso: "CN" },
  { code: "+20", name: "Egypt", flag: "🇪🇬", iso: "EG" },
  { code: "+33", name: "France", flag: "🇫🇷", iso: "FR" },
  { code: "+49", name: "Germany", flag: "🇩🇪", iso: "DE" },
  { code: "+91", name: "India", flag: "🇮🇳", iso: "IN" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩", iso: "ID" },
  { code: "+98", name: "Iran", flag: "🇮🇷", iso: "IR" },
  { code: "+964", name: "Iraq", flag: "🇮🇶", iso: "IQ" },
  { code: "+39", name: "Italy", flag: "🇮🇹", iso: "IT" },
  { code: "+81", name: "Japan", flag: "🇯🇵", iso: "JP" },
  { code: "+962", name: "Jordan", flag: "🇯🇴", iso: "JO" },
  { code: "+254", name: "Kenya", flag: "🇰🇪", iso: "KE" },
  { code: "+82", name: "South Korea", flag: "🇰🇷", iso: "KR" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾", iso: "MY" },
  { code: "+52", name: "Mexico", flag: "🇲🇽", iso: "MX" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱", iso: "NL" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬", iso: "NG" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰", iso: "PK" },
  { code: "+63", name: "Philippines", flag: "🇵🇭", iso: "PH" },
  { code: "+48", name: "Poland", flag: "🇵🇱", iso: "PL" },
  { code: "+351", name: "Portugal", flag: "🇵🇹", iso: "PT" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦", iso: "SA" },
  { code: "+27", name: "South Africa", flag: "🇿🇦", iso: "ZA" },
  { code: "+34", name: "Spain", flag: "🇪🇸", iso: "ES" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰", iso: "LK" },
  { code: "+46", name: "Sweden", flag: "🇸🇪", iso: "SE" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭", iso: "CH" },
  { code: "+886", name: "Taiwan", flag: "🇹🇼", iso: "TW" },
  { code: "+66", name: "Thailand", flag: "🇹🇭", iso: "TH" },
  { code: "+90", name: "Turkey", flag: "🇹🇷", iso: "TR" },
  { code: "+380", name: "Ukraine", flag: "🇺🇦", iso: "UA" },
  { code: "+971", name: "UAE", flag: "🇦🇪", iso: "AE" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧", iso: "GB" },
  { code: "+1", name: "United States", flag: "🇺🇸", iso: "US" },
  { code: "+998", name: "Uzbekistan", flag: "🇺🇿", iso: "UZ" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳", iso: "VN" },
];

/* ────────── Types ────────── */
interface Country {
  code: string;
  name: string;
  flag: string;
  iso: string;
}

interface CountrySelectDrawerProps {
  open: boolean;
  selected: Country | null;
  onSelect: (country: Country) => void;
  onClose: () => void;
}

/* ────────── Component ────────── */
export default function CountrySelectDrawer({
  open,
  selected,
  onSelect,
  onClose,
}: CountrySelectDrawerProps) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Drawer open হলে search clear + focus
  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // ✅ search filter করো – name অথবা code দিয়ে
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return COUNTRY_LIST;
    return COUNTRY_LIST.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.replace("+", "").includes(q) ||
        c.iso.toLowerCase().includes(q),
    );
  }, [search]);

  // ✅ Recommended = Bangladesh (বা user এর location অনুযায়ী)
  const recommended = COUNTRY_LIST.find((c) => c.iso === "BD")!;
  const others = filtered.filter((c) => c.iso !== "BD");
  const showRecommended =
    !search || recommended.name.toLowerCase().includes(search.toLowerCase());

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* ── Drawer ── */}
      <div
        className={[
          "fixed inset-x-0 bottom-0 z-50 rounded-t-3xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        style={{
          background: "#ffffff",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Drag Handle ── */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3">
          <h2 className="text-[18px] font-bold text-gray-900">
            Select country code
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* ── Search Input ── */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by code or country"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[14px] text-gray-700 placeholder:text-gray-400 outline-none"
            />
          </div>
        </div>

        {/* ── List ── */}
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {/* Enter code manually */}
          {!search && (
            <button
              onClick={() => {
                onSelect({ code: "", name: "Manual", flag: "⌨️", iso: "" });
                onClose();
              }}
              className="flex items-center gap-3 w-full py-3 border-b border-gray-100"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                <span className="text-lg">⌨️</span>
              </div>
              <span className="text-[15px] text-gray-700 font-medium">
                Enter code manually
              </span>
            </button>
          )}

          {/* Recommended */}
          {showRecommended && !search && (
            <>
              <p className="text-[12px] font-semibold text-[#0173e5] mt-4 mb-2 uppercase tracking-wider">
                Recommended
              </p>
              <CountryRow
                country={recommended}
                selected={selected}
                onSelect={(c) => {
                  onSelect(c);
                  onClose();
                }}
              />
            </>
          )}

          {/* Other countries */}
          {others.length > 0 && (
            <>
              {!search && (
                <p className="text-[12px] font-semibold text-[#0173e5] mt-4 mb-2 uppercase tracking-wider">
                  Other
                </p>
              )}
              {others.map((country) => (
                <CountryRow
                  key={`${country.iso}-${country.code}`}
                  country={country}
                  selected={selected}
                  onSelect={(c) => {
                    onSelect(c);
                    onClose();
                  }}
                />
              ))}
            </>
          )}

          {/* No results */}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-[14px]">
              No country found
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Single Country Row ── */
function CountryRow({
  country,
  selected,
  onSelect,
}: {
  country: Country;
  selected: Country | null;
  onSelect: (c: Country) => void;
}) {
  const isSelected = selected?.iso === country.iso;

  return (
    <button
      onClick={() => onSelect(country)}
      className="flex items-center gap-3 w-full py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      {/* Flag */}
      <span className="text-2xl w-8 text-center shrink-0">{country.flag}</span>

      {/* Name */}
      <span
        className={[
          "flex-1 text-left text-[15px]",
          isSelected
            ? "text-[#0173e5] font-semibold"
            : "text-gray-800 font-medium",
        ].join(" ")}
      >
        {country.code} {country.name}
      </span>

      {/* Radio */}
      <div
        className={[
          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
          isSelected ? "border-[#0173e5]" : "border-gray-300",
        ].join(" ")}
      >
        {isSelected && <div className="w-3 h-3 rounded-full bg-[#0173e5]" />}
      </div>
    </button>
  );
}

export { COUNTRY_LIST };
export type { Country };
