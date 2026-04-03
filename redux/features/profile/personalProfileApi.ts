// ✅ personalProfileApi.ts
// RTK Query – Personal Profile API endpoints

import { apiSlice } from "../api/apiSlice";

/* ────────── Types ────────── */
export interface IPersonalProfile {
  accountNumber: string;
  email: string;
  phone: string;
  registrationDate: string;
  daysSincePasswordChange: number;
  firstName: string;
  surname: string;
  countryCode: string;
  countryName: string;
  city: string;
}

export interface IUpdateProfilePayload {
  firstName?: string;
  surname?: string;
  countryCode?: string;
  countryName?: string;
}

export interface ILinkPhonePayload {
  phone: string;
}

/* ────────── API Slice Injection ────────── */
export const personalProfileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* 🔍 Profile data load করো */
    getPersonalProfile: builder.query<
      { success: boolean; profile: IPersonalProfile },
      void
    >({
      query: () => ({
        url: "/personal-profile",
        method: "GET",
      }),
      providesTags: [{ type: "User", id: "PERSONAL_PROFILE" }],
    }),

    /* ✏️ Profile update (name, country) */
    updatePersonalProfile: builder.mutation<
      { success: boolean; message: string },
      IUpdateProfilePayload
    >({
      query: (body) => ({
        url: "/personal-profile/update",
        method: "PATCH",
        body,
      }),
      // ✅ update এর পর profile cache invalidate করো
      invalidatesTags: [
        { type: "User", id: "PERSONAL_PROFILE" },
        { type: "User", id: "ME" },
      ],
    }),

    /* 📱 Phone link করো */
    linkPhone: builder.mutation<
      { success: boolean; message: string },
      ILinkPhonePayload
    >({
      query: (body) => ({
        url: "/personal-profile/link-phone",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "PERSONAL_PROFILE" }],
    }),
  }),
});

export const {
  useGetPersonalProfileQuery,
  useUpdatePersonalProfileMutation,
  useLinkPhoneMutation,
} = personalProfileApi;
