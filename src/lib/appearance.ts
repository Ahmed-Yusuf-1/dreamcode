"use client";

import { useCallback, useEffect, useState } from "react";

export type AppearancePreference = "automatic" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const APPEARANCE_STORAGE_KEY = "dc_appearance";
export const APPEARANCE_CHANGE_EVENT = "dc_appearance_change";

export function isAppearancePreference(value: unknown): value is AppearancePreference {
  return value === "automatic" || value === "light" || value === "dark";
}

export function resolveTheme(
  preference: AppearancePreference,
  date = new Date(),
): ResolvedTheme {
  if (preference !== "automatic") return preference;
  const hour = date.getHours();
  return hour >= 7 && hour < 19 ? "light" : "dark";
}

function readPreference(): AppearancePreference {
  try {
    const saved = localStorage.getItem(APPEARANCE_STORAGE_KEY);
    return isAppearancePreference(saved) ? saved : "automatic";
  } catch {
    return "automatic";
  }
}

function applyTheme(preference: AppearancePreference) {
  const theme = resolveTheme(preference);
  document.documentElement.dataset.appearance = preference;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function AppearanceController() {
  useEffect(() => {
    const refresh = () => applyTheme(readPreference());
    refresh();

    // Automatic mode can cross the 07:00/19:00 boundary while the app stays open.
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener(APPEARANCE_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener(APPEARANCE_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return null;
}

export function useAppearance() {
  const [preference, setPreferenceState] = useState<AppearancePreference>("automatic");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");

  useEffect(() => {
    const refresh = () => {
      const next = readPreference();
      setPreferenceState(next);
      setResolvedTheme(resolveTheme(next));
    };
    refresh();
    window.addEventListener(APPEARANCE_CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(APPEARANCE_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const setPreference = useCallback((next: AppearancePreference) => {
    try {
      localStorage.setItem(APPEARANCE_STORAGE_KEY, next);
    } catch {
      // The choice still applies for the current page in storage-restricted browsers.
    }
    applyTheme(next);
    setPreferenceState(next);
    setResolvedTheme(resolveTheme(next));
    window.dispatchEvent(new Event(APPEARANCE_CHANGE_EVENT));
  }, []);

  return { preference, resolvedTheme, setPreference };
}
