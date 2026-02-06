import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  phone: number;
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
}
const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const user =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;
export const initialState: AuthState = {
  accessToken: token,
  refreshToken: token,
  user: user ? JSON.parse(user) : null,
  isAuthenticated:
    typeof window !== "undefined" && localStorage.getItem("token")
      ? true
      : false,
  isVerified: false,
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
      state.accessToken = action.payload.token.access;
      state.refreshToken = action.payload.token.refresh;
      state.user = action.payload.user;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token.access);
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
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isVerified === false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { singUp, setAccessToken, setUser, logout, setVerified } =
  authSlice.actions;
export default authSlice.reducer;
