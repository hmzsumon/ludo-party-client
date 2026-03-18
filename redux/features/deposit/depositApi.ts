import { apiSlice } from "../api/apiSlice";

export const depositApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // create deposit request
    createDepositRequest: builder.mutation<any, any>({
      query: (body) => ({
        url: "/create-new-deposit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Deposits"],
    }),

    // get my deposits or logged in user deposits
    getMyDeposits: builder.query<any, any>({
      query: () => "/my-deposits",
      providesTags: ["Deposits"],
    }),

    // get single deposit
    getDeposit: builder.query<any, any>({
      query: (id) => `/deposit/${id}`,
      providesTags: ["Deposits"],
    }),

    // get active deposit method
    getActiveDepositMethod: builder.query<any, any>({
      query: () => "/deposit-method/active",
    }),

    // deposit with binance
    depositWithBinance: builder.mutation<any, any>({
      query: (body) => ({
        url: "/binance-payment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── Get Payment Methods ────────── */
    getPaymentMethods: builder.query<any, any>({
      query: () => "/payment-methods",
    }),

    /* ────────── Create new Deposit with BDT ────────── */
    createDepositWithBDT: builder.mutation<any, any>({
      query: (body) => ({
        url: "/create-new-deposit-bdt",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Deposits"],
    }),
    /* ────────── Get Single Payment Method By Name ────────── */
    getPaymentMethodByName: builder.query<any, string>({
      query: (methodName) => `/payment-methods/${methodName}`,
    }),

    /* ─────────────────────────────────────────────
       ✅ NEW (ADDED ONLY) - Agent based deposit channels
       GET /agent/me/payment-methods -> { success:true, data:[...] }
    ───────────────────────────────────────────── */

    getMyAgentPaymentMethods: builder.query<
      GetMyAgentPaymentMethodsResponse,
      void
    >({
      query: () => ({
        url: "/payment-methods-for-user",
        method: "GET",
      }),
      providesTags: ["AgentPaymentMethods"],
    }),

    // Optional helper endpoint (client side filter alternative)
    getMyAgentPaymentMethodsByName: builder.query<
      GetMyAgentPaymentMethodsResponse,
      string
    >({
      query: (methodName) => ({
        url: `/agent/me/payment-methods?methodName=${encodeURIComponent(
          methodName,
        )}`,
        method: "GET",
      }),
      providesTags: ["AgentPaymentMethods"],
    }),

    getMyAgentPaymentMethodById: builder.query<
      { success: boolean; data: AgentPaymentMethod },
      string
    >({
      query: (id) => ({
        url: `/agent/me/payment-methods/${id}`,
        method: "GET",
      }),
    }),

    /* ────────── Get My Deposits BDT (Deposit Record) ────────── */
    getMyDepositsBDT: builder.query<
      { success: boolean; deposits: any[]; totalAmount: number },
      {
        from?: string;
        to?: string;
        status?: string; // approved | pending | failed | expired | confirmed | all
        walletTitle?: string; // NAGAD/BKASH optional
      }
    >({
      query: (params) => {
        const qs = new URLSearchParams();

        if (params?.from) qs.set("from", params.from);
        if (params?.to) qs.set("to", params.to);
        if (params?.status) qs.set("status", params.status);
        if (params?.walletTitle) qs.set("walletTitle", params.walletTitle);

        return `/my-deposits-bdt?${qs.toString()}`;
      },
      providesTags: ["Deposits"],
    }),
  }),
});

/* ─────────────────────────────
   ✅ NEW Types (ADDED ONLY)
───────────────────────────── */
export type AgentPaymentMethod = {
  _id: string;
  accountNumber: string;
  methodName: string;
  methodType: string;
  title?: string;
  isActive?: boolean;
  isDefault?: boolean;
  isHiddenFromAgent?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type GetMyAgentPaymentMethodsResponse = {
  success: boolean;
  data: AgentPaymentMethod[];
};

export const {
  useCreateDepositRequestMutation,
  useGetMyDepositsQuery,
  useGetDepositQuery,
  useGetActiveDepositMethodQuery,
  useDepositWithBinanceMutation,
  useGetPaymentMethodsQuery,
  useCreateDepositWithBDTMutation,
  useGetPaymentMethodByNameQuery,

  /* ✅ NEW hooks (ADDED ONLY) */
  useGetMyAgentPaymentMethodsQuery,
  useLazyGetMyAgentPaymentMethodsQuery,
  useGetMyAgentPaymentMethodsByNameQuery,
  useLazyGetMyAgentPaymentMethodsByNameQuery,

  useGetMyAgentPaymentMethodByIdQuery,
  useLazyGetMyAgentPaymentMethodByIdQuery,
  /* ✅ Deposit Record (BDT) */
  useGetMyDepositsBDTQuery,
  useLazyGetMyDepositsBDTQuery,
} = depositApi;
