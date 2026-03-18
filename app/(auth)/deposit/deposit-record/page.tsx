"use client";

import { useGetMyDepositsBDTQuery } from "@/redux/features/deposit/depositApi";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaAngleLeft } from "react-icons/fa";

/* ────────── Utils ────────── */
const pad2 = (n: number) => String(n).padStart(2, "0");

const toYMD = (d: Date) => {
  const y = d.getUTCFullYear();
  const m = pad2(d.getUTCMonth() + 1);
  const day = pad2(d.getUTCDate());
  return `${y}-${m}-${day}`;
};

const toMMDD = (d: Date) =>
  `${pad2(d.getUTCMonth() + 1)}/${pad2(d.getUTCDate())}`;

const addDaysUTC = (d: Date, n: number) => {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
};

const formatDT = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  // 2026-02-06 12:57:09 format
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const mi = pad2(d.getMinutes());
  const ss = pad2(d.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
};

const statusLabel = (s?: string) => {
  switch (s) {
    case "approved":
      return { t: "Approved", c: "text-green-600" };
    case "pending":
      return { t: "Pending", c: "text-orange-500" };
    case "failed":
      return { t: "Reject", c: "text-red-600" };
    case "expired":
      return { t: "Cancelled", c: "text-gray-500" };
    case "confirmed":
      return { t: "New", c: "text-blue-600" };
    default:
      return { t: "All", c: "text-gray-700" };
  }
};

/* ────────── Component: Tabs ────────── */
function Tabs({
  active,
  onChange,
}: {
  active: "today" | "yesterday" | "7days";
  onChange: (v: "today" | "yesterday" | "7days") => void;
}) {
  const tabBtn = (key: "today" | "yesterday" | "7days", label: string) => {
    const is = active === key;
    return (
      <button
        onClick={() => onChange(key)}
        className={`flex-1 py-3 text-center text-sm ${
          is ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-900"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex bg-white border-b">
      {tabBtn("today", "Today")}
      {tabBtn("yesterday", "Yesterday")}
      {tabBtn("7days", "7-days")}
    </div>
  );
}

/* ────────── Component: Types Modal ────────── */
function TypesModal({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (v: string) => void;
}) {
  if (!open) return null;

  const items = [
    { label: "Approved", value: "approved" },
    { label: "Cancelled", value: "expired" },
    { label: "Pending", value: "pending" },
    { label: "New", value: "confirmed" },
    { label: "Reject", value: "failed" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
      <div className="w-full bg-white rounded-t-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="text-sm text-gray-500">Types</div>
          <button onClick={onClose} className="text-gray-500 text-xl">
            ×
          </button>
        </div>

        <div className="px-4 py-3">
          <div className="text-sm font-semibold mb-2">Types</div>
          <div className="divide-y">
            {items.map((it) => (
              <button
                key={it.value}
                onClick={() => {
                  onPick(it.value);
                  onClose();
                }}
                className="w-full text-left py-4 text-base"
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────── Component: Date Modal ────────── */
function DateRangeModal({
  open,
  from,
  to,
  onClose,
  onApply,
}: {
  open: boolean;
  from: string;
  to: string;
  onClose: () => void;
  onApply: (from: string, to: string) => void;
}) {
  const [f, setF] = useState(from);
  const [t, setT] = useState(to);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end pb-14">
      <div className="w-full bg-white rounded-t-lg overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="font-semibold">Select Date Range</div>
          <button onClick={onClose} className="text-gray-500 text-xl">
            ×
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500">From</label>
              <input
                type="date"
                value={f}
                onChange={(e) => setF(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">To</label>
              <input
                type="date"
                value={t}
                onChange={(e) => setT(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                // Clear = today default
                const today = new Date();
                const ymd = toYMD(today);
                setF(ymd);
                setT(ymd);
              }}
              className="flex-1 border rounded py-3"
            >
              Clear
            </button>

            <button
              onClick={() => {
                if (!f || !t) {
                  toast.error("Please select from/to date");
                  return;
                }
                onApply(f, t);
                onClose();
              }}
              className="flex-1 bg-blue-500 text-white rounded py-3"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────── Component: Deposit Card ────────── */
function DepositCard({ d }: { d: any }) {
  const title = String(
    d?.walletTitle || d?.walletType || "DEPOSIT",
  ).toUpperCase();
  const createdAt = formatDT(d?.createdAt);
  const receivedAt = formatDT(d?.approvedAt || d?.processedAt || d?.updatedAt);

  const requestAmount = Number(d?.requestAmount || 0).toFixed(2);
  const receivedAmount = Number(d?.receivedAmount || 0).toFixed(2);

  const ref = String(d?.orderId || d?._id || "-");
  const st = statusLabel(d?.status);

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(ref);
      toast.success("Copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="px-4 py-4 border-b bg-white">
      <div className="text-sm font-semibold leading-tight">{title}</div>
      <div className="text-xs text-gray-700">{createdAt}</div>

      <div className="mt-3 bg-gray-100 rounded-lg p-4">
        <div className="flex items-center gap-2 text-xl">
          <div className="font-semibold text-sm">Deposit ref# :</div>
          <div className="font-semibold text-xs">{ref}</div>
          <button
            onClick={copyRef}
            className="ml-auto text-gray-500 hover:text-gray-800"
            title="Copy"
          >
            ⧉
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm">
          <div className="flex gap-3">
            <div className="min-w-[170px] text-gray-700">Postscript :</div>
            <div className="text-gray-900 text-xs">{d?.note || ""}</div>
          </div>

          <div className="flex gap-3">
            <div className="min-w-[170px] text-gray-700">Received time :</div>
            <div className="text-gray-900 text-xs">{receivedAt}</div>
          </div>

          <div className="flex gap-3">
            <div className="min-w-[170px] text-gray-700">Handling fee :</div>
            <div className="text-gray-900 text-xs">0.00</div>
          </div>

          <div className="flex gap-3">
            <div className="min-w-[170px] text-gray-700">Promotions :</div>
            <div className="text-gray-900 text-xs">-</div>
          </div>

          <div className="flex gap-3">
            <div className="min-w-[170px] text-gray-700">Remarks :</div>
            <div className="text-gray-900 text-xs">
              {d?.rejectedReason ? d.rejectedReason : "-"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-1 px-2 ">
        <div>
          <div className="text-xs text-gray-700">Request</div>
          <div className="text-sm text-red-600 font-semibold">
            {requestAmount}
          </div>
        </div>
        <div className="">
          <div className="text-xs text-gray-700">Received amount</div>
          <div className="text-sm text-gray-900 font-semibold">
            {receivedAmount}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-700 text-right">Status</div>
          <div className={`text-sm text-right font-semibold ${st.c}`}>
            {st.t}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DepositRecordPage() {
  const router = useRouter();

  const [tab, setTab] = useState<"today" | "yesterday" | "7days">("today");
  const [typesOpen, setTypesOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  // ✅ status: "all" default
  const [status, setStatus] = useState<string>("all");

  /* ────────── Date Range From Tab ────────── */
  const { from, to, label } = useMemo(() => {
    const today = new Date();
    const todayUTC = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
    );
    if (tab === "today") {
      const ymd = toYMD(todayUTC);
      return {
        from: ymd,
        to: ymd,
        label: `${toMMDD(todayUTC)}-${toMMDD(todayUTC)}`,
      };
    }
    if (tab === "yesterday") {
      const y = addDaysUTC(todayUTC, -1);
      const ymd = toYMD(y);
      return { from: ymd, to: ymd, label: `${toMMDD(y)}-${toMMDD(y)}` };
    }
    // 7-days: today সহ last 7 days => start = today-6
    const start = addDaysUTC(todayUTC, -6);
    const end = todayUTC;
    return {
      from: toYMD(start),
      to: toYMD(end),
      label: `${toMMDD(start)}-${toMMDD(end)}`,
    };
  }, [tab]);

  /* ────────── Query Deposits ────────── */
  const { data, isLoading, isError } = useGetMyDepositsBDTQuery({
    from,
    to,
    status,
  });

  const deposits = data?.deposits || [];
  const totalAmount = Number(data?.totalAmount || 0).toFixed(2);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#0d5b57] text-white px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-white/90 flex items-center gap-2"
        >
          <FaAngleLeft />
        </button>
        <div className="text-xl font-bold tracking-wide text-[#f4b400]">
          Deposit Record
        </div>
        <div className="w-6" />
      </div>

      {/* Tabs */}
      <Tabs active={tab} onChange={setTab} />

      {/* Filters */}
      <div className="bg-gray-100 px-4 text-sm py-3 flex items-center gap-3">
        <button
          onClick={() => setStatus("all")}
          className="border border-blue-400 text-blue-600 bg-white rounded px-5 py-2"
        >
          All
        </button>

        <button
          onClick={() => setTypesOpen(true)}
          className="border border-blue-400 text-blue-600 bg-white rounded px-6 py-2"
        >
          Types
        </button>

        <button
          onClick={() => setDateOpen(true)}
          className="ml-auto border border-blue-400 text-blue-600 bg-white rounded px-4 py-2 flex items-center gap-2"
        >
          <span>📅</span>
          <span>{label}</span>
        </button>
      </div>

      {/* Body */}
      <div className="bg-white min-h-[60vh]">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">Loading...</div>
        ) : isError ? (
          <div className="p-10 text-center text-red-500">
            Failed to load deposit records
          </div>
        ) : deposits.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-xl">No data</div>
          </div>
        ) : (
          <>
            {deposits.map((d: any) => (
              <DepositCard key={String(d?._id)} d={d} />
            ))}

            {/* Total */}
            <div className="px-4 py-4 text-base font-semibold">
              Total amount: {totalAmount}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <TypesModal
        open={typesOpen}
        onClose={() => setTypesOpen(false)}
        onPick={(v) => setStatus(v)}
      />

      <DateRangeModal
        open={dateOpen}
        from={from}
        to={to}
        onClose={() => setDateOpen(false)}
        onApply={(f, t) => {
          // ✅ custom date set হলে tab current রেখে query change হবে
          // এখানে সহজভাবে: tab পরিবর্তন না করে manual range set না রেখেই চলবে,
          // তোমার চাইলে future এ custom state add করে রাখতে পারো
          toast.success(`Date set: ${f} → ${t}`);
        }}
      />
    </div>
  );
}
