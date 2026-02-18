"use client";

import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/src/lib/theme/ThemeProvider";

const ThemeToggle = () => {
  const { theme, setTheme, clearOverride, isDark } = useThemeContext();

  const handleClick = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      // shift+click => follow system
      clearOverride();
      return;
    }

    // toggle between light/dark
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      aria-label="Toggle theme (Shift+click to follow system)"
      title="Toggle theme (Shift+click to follow system)"
      onClick={handleClick}
      className="p-2"
    >
      {theme === "light" ? (
        <Sun className="h-6 w-6" />
      ) : theme === "dark" ? (
        <Moon className="h-6 w-6" />
      ) : (
        <Monitor className="h-6 w-6" />
      )}
    </Button>
  );
};

export default ThemeToggle;
