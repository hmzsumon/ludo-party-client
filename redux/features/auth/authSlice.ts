/* ────────── imports ────────── */
import { removeAccessToken, saveAccessToken } from "@/utils/authToken";
import { createSlice } from "@reduxjs/toolkit";

/* ────────── initial state ────────── */
const initialState = {
  btnLogin: false,
  user: null,
  token: null,
  isAuthenticated: false,
  isForgotPassword: false,
  emailForgotPassword: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* ────────── toggle login button state ────────── */
    setBtnLogin: (state) => {
      state.btnLogin = !state.btnLogin;
    },

    /* ────────── set user after login ────────── */
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      /* ────────── persist token for socket auth ────────── */
      saveAccessToken(action.payload.token || null);
    },

    /* ────────── load current user ────────── */
    loadUser: (state, action) => {
      state.user = action.payload.user;

      /* ────────── keep authenticated flag aligned ────────── */
      if (action.payload?.user) {
        state.isAuthenticated = true;
      }
    },

    /* ────────── clear auth state on logout ────────── */
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      /* ────────── remove persisted token ────────── */
      removeAccessToken();
    },

    /* ────────── forgot password state ────────── */
    setForgotPasswordState: (state, action) => {
      state.isForgotPassword = action.payload.isForgotPassword;
      state.emailForgotPassword = action.payload.emailForgotPassword;
    },
  },
});

export const {
  setBtnLogin,
  setUser,
  logoutUser,
  loadUser,
  setForgotPasswordState,
} = authSlice.actions;

export default authSlice.reducer;
