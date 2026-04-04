/* ── Page: Withdraw ─────────────────────────────────────────────────────── */
"use client";
import TurnoverNotice from "@/components/withdraw/TurnoverNotice";
import WithdrawForm from "@/components/withdraw/WithdrawForm";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import RecIcon from "@/public/icons/record_icon.png";

import RecallBalanceBtn from "@/components/withdraw/RecallBalanceBtn";
import { BoundWallet } from "@/components/withdraw/WalletCard";
import WalletCarousel from "@/components/withdraw/WalletCarousel";
import WalletTabs, { WalletProvider } from "@/components/withdraw/WalletTabs";
import { useGetUserPaymentMethodsQuery } from "@/redux/features/auth/authApi";
import { useCreateWithdrawRequestMutation } from "@/redux/features/withdraw/withdrawApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaAngleLeft } from "react-icons/fa";

const formatBDT = (n: number) =>
  `💎 ${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const PANEL = {
  background:
    "linear-gradient(180deg, rgba(67,11,88,0.55) 0%, rgba(20,4,31,0.75) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
};

export default function WithdrawPage() {
  const router = useRouter();
  const { user } = useSelector((s: any) => s.auth) || { user: null };

  const { data, isLoading } = useGetUserPaymentMethodsQuery(undefined);
  const apiList: Array<{
    _id: string;
    method: WalletProvider;
    name?: string;
    accountNumber?: string;
    number?: string;
    wallet?: string;
    createdAt?: string;
    isDefault?: boolean;
  }> = data?.userPaymentMethods ?? [];

  const getAccount = (pm: any) =>
    pm.accountNumber || pm.number || pm.wallet || "";

  const wallets: BoundWallet[] = apiList.map((pm) => ({
    id: pm._id,
    provider: pm.method,
    accountNumber: getAccount(pm),
    holderName: pm.name,
    last4: getAccount(pm).slice(-4) || "****",
    createdAt: (pm.createdAt ?? new Date().toISOString()).slice(0, 10),
    isDefault: pm.isDefault,
  }));

  const [provider, setProvider] = useState<WalletProvider>("bkash");

  const providerWallets = useMemo(
    () => wallets.filter((w) => w.provider === provider),
    [wallets, provider],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    if (providerWallets.length === 1) setSelectedId(providerWallets[0].id);
    else if (
      providerWallets.length > 1 &&
      !providerWallets.some((w) => w.id === selectedId)
    ) {
      setSelectedId(providerWallets[0].id);
    } else if (providerWallets.length === 0) {
      setSelectedId(null);
    }
  }, [providerWallets, selectedId]);

  const counts = useMemo(
    () =>
      ({
        bkash: wallets.filter((w) => w.provider === "bkash").length,
        nagad: wallets.filter((w) => w.provider === "nagad").length,
      }) as Partial<Record<WalletProvider, number>>,
    [wallets],
  );

  const mainBalance = Number(user?.m_balance ?? 0);
  const available = Number(user?.available_amount ?? mainBalance);
  const wagerRemaining = Number(user?.bet_volume ?? 0);
  const wagerRequired = Number(user?.wager_required ?? 0);
  const turnoverToday = Number(user?.turnover_today ?? 0);
  const turnoverTotal = Number(user?.turnover_total ?? 0);

  const [
    createWithdrawRequest,
    { isLoading: isSubmitting, error: createError, isSuccess, isError },
  ] = useCreateWithdrawRequestMutation();

  const handleRecall = () => {
    console.log("recall balance");
  };

  const selectedWallet =
    providerWallets.find((w) => w.id === selectedId) || null;

  const handleSubmit = async (amt: number, pass: string) => {
    if (!selectedWallet) {
      toast.error("Select an E-wallet");
      return;
    }
    await createWithdrawRequest({
      amount: amt,
      method: {
        name: selectedWallet.provider,
        accountNumber: selectedWallet.accountNumber,
      },
      pass,
    }).unwrap();
  };

  useEffect(() => {
    if (isError) toast.error((createError as fetchBaseQueryError).data?.error);
    if (isSuccess) {
      toast.success("Withdraw request created successfully!");
      router.push("/dashboard");
    }
  }, [isError, isSuccess, createError, router]);

  const canWithdraw = wagerRemaining <= 0;

  return (
    <div className="min-h-screen pb-10" style={{ background: "#14041f" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
        style={{
          background:
            "linear-gradient(180deg,rgba(30,5,50,0.98),rgba(20,4,31,0.95))",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-white/70 transition hover:text-white"
          style={{ background: "rgba(255,255,255,0.07)" }}
          onClick={() => router.back()}
          type="button"
        >
          <FaAngleLeft className="text-xs" /> Back
        </button>
        <h1 className="text-base font-extrabold tracking-widest text-white uppercase">
          🏧 Withdraw
        </h1>
        <Link href="/withdraw/withdraw-record">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <Image src={RecIcon} alt="History" className="h-5 w-5" />
          </div>
        </Link>
      </div>

      <div className="mx-auto w-full max-w-md px-3 py-4 space-y-3">
        {/* Balance Card */}
        <div
          className="rounded-2xl p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(80,10,120,0.7), rgba(30,5,60,0.9))",
            border: "1px solid rgba(180,80,255,0.2)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">
                Main Wallet
              </div>
              <div className="text-xl font-extrabold text-white">
                {formatBDT(mainBalance)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">
                Available
              </div>
              <div className="text-lg font-bold" style={{ color: "#a78bfa" }}>
                {formatBDT(available)}
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-2 gap-2 pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div>
              <div className="text-[10px] text-white/35">Today Turnover</div>
              <div className="text-xs font-semibold text-white/70 mt-0.5">
                {formatBDT(turnoverToday)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-white/35">Total Turnover</div>
              <div className="text-xs font-semibold text-white/70 mt-0.5">
                {formatBDT(turnoverTotal)}
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-white/40">
            <div>
              Withdrawal time: <span className="text-white/60">24 hours</span>
            </div>
            <div className="text-right">
              Daily limit: <span className="text-white/60">99 times</span>
            </div>
          </div>

          <div className="mt-3">
            <RecallBalanceBtn onClick={handleRecall} />
          </div>
        </div>

        {/* Wallet Tabs */}
        <div className="rounded-2xl p-4" style={PANEL}>
          <WalletTabs value={provider} onChange={setProvider} counts={counts} />

          {/* Wallet header */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-white/50">
              {providerWallets.length > 0
                ? `Registered E-wallet (${providerWallets.length}/5)`
                : "Registered E-wallet (0/5)"}
            </p>
            <Link
              href="/withdraw/bind-wallet"
              className="flex h-8 w-8 items-center justify-center rounded-full transition hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="fill-white"
              >
                <path d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z" />
              </svg>
            </Link>
          </div>

          {/* Wallet Cards */}
          <div className="mt-3">
            {isLoading ? (
              <div
                className="h-28 animate-pulse rounded-xl"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
            ) : providerWallets.length ? (
              <WalletCarousel
                items={providerWallets}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ) : (
              <div
                className="flex flex-col items-center justify-center rounded-xl p-8 text-center"
                style={{
                  border: "1.5px dashed rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  className="mb-3 fill-white opacity-30"
                >
                  <path d="M21 7H7V5c0-1.1.9-2 2-2h12v4zM3 7h2v12h14c1.1 0 2-.9 2-2v-7H7c-1.1 0-2 .9-2 2v5H3V7z" />
                </svg>
                <p className="text-white/40 text-sm">No E-Wallet bound</p>
                <Link
                  href="/withdraw/bind-wallet"
                  className="mt-3 rounded-xl px-5 py-2 text-sm font-semibold text-white transition"
                  style={{
                    background: "linear-gradient(135deg, #9333ea, #7c3aed)",
                  }}
                >
                  Bind E-wallet
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Turnover Notice */}
        <TurnoverNotice
          remaining={wagerRemaining}
          required={wagerRequired}
          onOk={() => console.log("ok")}
        />

        {/* Withdraw Form */}
        {canWithdraw ? (
          <div className="rounded-2xl overflow-hidden" style={PANEL}>
            <WithdrawForm
              available={available}
              disabled={!selectedWallet || isSubmitting}
              onSubmit={handleSubmit}
            />
          </div>
        ) : (
          <div className="rounded-2xl p-4 text-sm text-white/40" style={PANEL}>
            🔒 Withdraw is locked until rollover is completed.
          </div>
        )}
      </div>
    </div>
  );
}
