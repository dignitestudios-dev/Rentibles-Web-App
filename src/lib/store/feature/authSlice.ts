import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export const initialState: AuthState = {
  // accessToken: "dummy_token_12345",
  // refreshToken: "dummy_refresh_token_12345",
  // user: {
  //   id: "1",
  //   name: "Kevin Parker",
  //   email: "kevin@example.com",
  //   image: "",
  // },
  // isAuthenticated: true,

  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: { access: string; refresh: string };
        user: User;
      }>,
    ) => {
      console.log("run creds");
      state.accessToken = action.payload.token.access;
      state.refreshToken = action.payload.token.refresh;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, setAccessToken, setUser, logout } =
  authSlice.actions;
export default authSlice.reducer;
