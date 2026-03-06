"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useUserSettings } from "@/domains/settings/hooks/use-settings";

/**
 * Syncs the user's saved theme preference from the database to next-themes.
 * This ensures the theme persists across sessions after login.
 */
export function ThemeSync() {
  const { theme, setTheme } = useTheme();
  const { data: settings, isLoading } = useUserSettings();

  useEffect(() => {
    if (!isLoading && settings?.theme && theme !== settings.theme) {
      setTheme(settings.theme);
    }
  }, [settings?.theme, theme, setTheme, isLoading]);

  return null;
}
