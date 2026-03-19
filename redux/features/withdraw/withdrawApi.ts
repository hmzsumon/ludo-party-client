import { apiSlice } from "../api/apiSlice";

/* ────────── Types ────────── */

export type WithdrawStatus =
  | "all"
  | "approved"
  | "pending"
  | "confirmed"
  | "rejected"
  | "failed"
  | "cancelled"
  | "expired"; // UI compat (backend map can convert to cancelled)

export type GetMyWithdrawsArgs = {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  status: WithdrawStatus;
};

export type WithdrawMethod = {
  name?: string;
  accountNumber?: string;
};

export type Withdraw = {
  _id: string;
  sl_no?: string;

  userId?: string;

  name?: string;
  phone?: string;
  email?: string;
  customerId?: string;

  amount: number;
  netAmount?: number;
  charge?: number;

  method?: WithdrawMethod;

  status?: string;

  txnId?: string;
  agentNumber?: string;

  approvedAt?: string;
  processedAt?: string;

  createdAt?: string;
  updatedAt?: string;

  rejected_reason?: string;
};



export type GetMyWithdrawsResponse = {
  success: boolean;
  withdraws: Withdraw[];
  totalAmount: number;
  totalNetAmount: number;
};

export type CreateWithdrawRequestBody = {
  amount: number;
  method: any; // তোমার form অনুযায়ী method object/string যা পাঠাও সেটা বসাও
  pass: string;
};

export type CreateWithdrawRequestResponse = {
  success: boolean;
  message: string;
  data?: Withdraw;
};

/* ────────── API ────────── */

export const withdrawApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // create new withdraw request
    createWithdrawRequest: builder.mutation<
      CreateWithdrawRequestResponse,
      CreateWithdrawRequestBody
    >({
      query: (body) => ({
        url: `/new-withdraw-request`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Withdraws"],
    }),

    // old: get my withdraw requests (no filter)
    getMyWithdrawRequests: builder.query<
      { success: boolean; withdraws: Withdraw[] },
      void
    >({
      query: () => `/my-withdraws`,
      providesTags: ["Withdraws"],
    }),

    // get all agents
    getAllAgents: builder.query<any, void>({
      query: () => `/get-all-agents`,
    }),

    // ✅ NEW: filtered withdraw record (from/to/status)
    // endpoint name = getMyWithdraws  => hook = useGetMyWithdrawsQuery ✅
    getMyWithdraws: builder.query<GetMyWithdrawsResponse, GetMyWithdrawsArgs>({
      query: ({ from, to, status }) => ({
        // ⚠️ তুমি যে baseUrl/use case ব্যবহার করো সেটার উপর নির্ভর করে:
        // যদি apiSlice baseUrl already "/withdraw" হয়, তাহলে শুধু "/my-withdraws" দাও
        // নিচে আমি তোমার দেয়া url 그대로 রাখলাম:
        url: `/my-withdraws`,
        method: "GET",
        params: { from, to, status },
      }),
      providesTags: ["Withdraws"],
    }),
  }),
});

export const {
  useCreateWithdrawRequestMutation,
  useGetMyWithdrawRequestsQuery,
  useGetAllAgentsQuery,

  // ✅ fixed hook name
  useGetMyWithdrawsQuery,
} = withdrawApi;
