import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./formSlice";
import authreducer from "./AuthSlice";

export const store = configureStore({
  reducer: {
    form: formReducer,
    auth: authreducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
