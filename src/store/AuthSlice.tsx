import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Authstate } from "../types/Auth";

const initialState: Authstate = {
  isAuthenticated: false,
  accessToken: null,
  account: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ accessToken: string; account: any }>
    ) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.account = action.payload.account;
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.account = "";
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
