import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormState } from "../types";

const initialState: FormState = {
  CosmosDBConnectionString: "",
  ContainerName: "",
  CosmosDBDatabaseName: "",
  SQLServerConnectionString: "",
  SQLTableName: "",
  SQLDatabaseName: "",
  Query: "",
  isLoading: false,
  error: null,
  success: null,
};

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ name: string; value: string }>
    ) => {
      const { name, value } = action.payload;
      (state as any)[name] = value;
    },
    fetchStarted: (state) => {
      state.isLoading = true;
      // state.error = null;
      state.success = null;
    },
    fetchSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.success = action.payload;
    },
    fetchFailed: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearAlerts: (state) => {
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  updateField,
  fetchStarted,
  fetchSuccess,
  fetchFailed,
  clearAlerts,
} = formSlice.actions;
export default formSlice.reducer;
