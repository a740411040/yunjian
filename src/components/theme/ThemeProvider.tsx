"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import {
  THEME_STORAGE_KEY,
  type ThemeMode
} from "@/lib/site-theme";

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.themeMode = mode;
  window.localStorage.setItem(THEME_STORAGE_KEY, mode);
}

function resolveInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "day";
  }

  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (
    saved === "day" ||
    saved === "night-dark" ||
    saved === "night-light"
  ) {
    return saved;
  }

  return "day";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("day");

  useEffect(() => {
    const initialTheme = resolveInitialTheme();
    setMode(initialTheme);
    applyTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    applyTheme(mode);
  }, [mode]);

  function handleSetMode(nextMode: ThemeMode) {
    setMode(nextMode);

    if (typeof window !== "undefined") {
      applyTheme(nextMode);
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode: handleSetMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeMode must be used within ThemeProvider.");
  }

  return context;
}
