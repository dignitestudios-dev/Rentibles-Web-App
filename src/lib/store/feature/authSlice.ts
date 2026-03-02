import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  phone: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  identityStatus?: "not-provided" | "pending" | "approved" | "rejected";
  isVerified?: boolean;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  isGuestMode: boolean;
}
const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const user =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;

const isGuestMode =
  typeof window !== "undefined" &&
  localStorage.getItem("guest_mode") === "true";

export const initialState: AuthState = {
  accessToken: token,
  refreshToken: token,
  user: user ? JSON.parse(user) : null,
  isAuthenticated:
    typeof window !== "undefined" && localStorage.getItem("token")
      ? true
      : false,
  isVerified: false,
  isGuestMode: !token && isGuestMode,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    singUp: (
      state,
      action: PayloadAction<{
        token: { access: string; refresh: string };
        user: User;
      }>,
    ) => {
      state.isAuthenticated = true;
      state.isGuestMode = false;
      state.accessToken = action.payload.token.access;
      state.refreshToken = action.payload.token.refresh;
      state.user = action.payload.user;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token.access);
      localStorage.removeItem("guest_mode");
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setVerified: (state, action: PayloadAction<boolean>) => {
      state.isVerified = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setGuestMode: (state, action: PayloadAction<boolean>) => {
      state.isGuestMode = action.payload;

      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem("guest_mode", "true");
        } else {
          localStorage.removeItem("guest_mode");
        }
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isVerified = false;
      state.isGuestMode = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("guest_mode");
      }
    },
  },
});

export const {
  singUp,
  setAccessToken,
  setUser,
  logout,
  setVerified,
  setGuestMode,
} = authSlice.actions;
export default authSlice.reducer;
