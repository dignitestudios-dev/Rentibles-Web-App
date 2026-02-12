import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/authSlice";
import categoryReducer from "./feature/appSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  categories: categoryReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
