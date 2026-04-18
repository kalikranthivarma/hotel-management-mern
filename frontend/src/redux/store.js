import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import navbarReducer from "./slices/navbarSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    navbar: navbarReducer,
  },
});