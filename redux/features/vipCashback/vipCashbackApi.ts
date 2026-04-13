/* ────────────────────────────────────────────────────────────────
   vipCashbackApi.ts
   RTK Query — VIP Cashback API endpoints
   ────────────────────────────────────────────────────────────── */

import { apiSlice } from "../api/apiSlice";

/* ────────── Types ────────── */
export interface IVipRankConfig {
  _id: string;
  rank: string;
  cashback: number;
  minMatches: number;
  minTurnover: number;
  order: number;
  isActive: boolean;
  achieved?: boolean;
}

export interface IVipCashbackInfo {
  currentRank: {
    rank: string;
    cashback: number;
    order: number;
    minMatches: number;
    minTurnover: number;
  } | null;
  nextRank: {
    rank: string;
    cashback: number;
    minMatches: number;
    minTurnover: number;
    remainingMatches: number;
    remainingTurnover: number;
  } | null;
  allRanks: IVipRankConfig[];
  userProgress: {
    totalMatches: number;
    turnoverTotal: number;
    baselineMatches: number;
    baselineTurnover: number;
    currentStageMatches: number;
    currentStageTurnover: number;
  };
  thisWeek: {
    weekStart: string;
    weekEnd: string;
    weekMatches: number;
    weekWinAmount: number;
    weekLossAmount: number;
    currentNetLoss: number;
    estimatedCashback: number;
  };
  lastCashback: {
    rank: string;
    amount: number;
    percent: number;
    paidAt: string;
    weekStart: string;
  } | null;
}

export interface IVipCashbackLog {
  _id: string;
  weekStart: string;
  weekEnd: string;
  weekMatches: number;
  weekWinAmount: number;
  weekLossAmount: number;
  netLoss: number;
  rank: string;
  cashbackPercent: number;
  cashbackAmount: number;
  status: "pending" | "paid" | "skipped";
  paidAt?: string;
  note?: string;
  createdAt: string;
}

/* ────────── API Slice Injection ────────── */
export const vipCashbackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* 🏅 আমার VIP cashback info লোড করো */
    getMyVipCashbackInfo: builder.query<
      { status: string; data: IVipCashbackInfo },
      void
    >({
      query: () => ({
        url: "/vip-cashback/info",
        method: "GET",
      }),
      providesTags: [{ type: "User", id: "VIP_CASHBACK_INFO" }],
    }),

    /* 📜 আমার cashback history */
    getMyVipCashbackHistory: builder.query<
      {
        status: string;
        data: {
          logs: IVipCashbackLog[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        };
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/vip-cashback/history?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: [{ type: "User", id: "VIP_CASHBACK_HISTORY" }],
    }),
  }),
});

export const { useGetMyVipCashbackInfoQuery, useGetMyVipCashbackHistoryQuery } =
  vipCashbackApi;
