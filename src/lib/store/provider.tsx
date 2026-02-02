"use client";

import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "./index";

export function ReduxProvider({ children }: PropsWithChildren) {
  // plain provider (redux-persist removed)
  return <Provider store={store}>{children}</Provider>;
}
