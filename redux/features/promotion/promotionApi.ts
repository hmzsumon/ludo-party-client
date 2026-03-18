import { apiSlice } from "../api/apiSlice";

/* ────────── Promo info response ────────── */
export type DepositPromoInfoRes = {
  success: boolean;
  data: {
    firstBonusPercent: number; // 50
    secondBonusPercent: number; // 25
    turnoverMultiplier: number; // 7
    eligibleDepositIndex: 0 | 1 | 2; // 1 => eligible first, 2 => eligible second, 0 => no bonus
    approvedDepositsCount: number;
    showPromo: boolean;
  };
};

export const promotionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── Get deposit promo eligibility ────────── */
    getDepositPromoInfo: builder.query<DepositPromoInfoRes, void>({
      query: () => ({
        url: "/promotion/deposit-bonus",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDepositPromoInfoQuery } = promotionApi;
