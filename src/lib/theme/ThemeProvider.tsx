"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  clearOverride: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // default to light on SSR; client effect will correct to system
    return "light";
  });

  // useEffect(() => {
  //   const mq = window.matchMedia("(prefers-color-scheme: dark)");

  //   const stored = localStorage.getItem("theme-override");
  //   if (stored === "dark" || stored === "light") {
  //     setThemeState(stored as Theme);
  //   } else {
  //     setThemeState(mq.matches ? "dark" : "light");
  //   }

  //   const onChange = (e: MediaQueryListEvent) => {
  //     const stillStored = localStorage.getItem("theme-override");
  //     if (stillStored === null) {
  //       setThemeState(e.matches ? "dark" : "light");
  //     }
  //   };

  //   // modern browsers support addEventListener on MediaQueryList
  //   if (mq.addEventListener) {
  //     mq.addEventListener("change", onChange);
  //   } else {
  //     // fallback
  //     // @ts-ignore
  //     mq.addListener(onChange);
  //   }

  //   return () => {
  //     if (mq.removeEventListener) {
  //       mq.removeEventListener("change", onChange);
  //     } else {
  //       // @ts-ignore
  //       mq.removeListener(onChange);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   const el = document.documentElement;
  //   if (theme === "dark") {
  //     el.classList.add("dark");
  //   } else {
  //     el.classList.remove("dark");
  //   }
  // }, [theme]);

  const setTheme = (t: Theme) => {
    localStorage.setItem("theme-override", t);
    setThemeState(t);
  };

  const clearOverride = () => {
    localStorage.removeItem("theme-override");
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setThemeState(mq.matches ? "dark" : "light");
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    clearOverride,
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
};

export default ThemeProvider;
