"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AppSettings, UserSettings, UpdateUserSettingsInput } from "../entities/settings";

export function useAppSettings() {
  return useQuery<AppSettings[]>({
    queryKey: ["app-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings/app");
      if (!res.ok) throw new Error("Failed to fetch app settings");
      return res.json();
    },
  });
}

export function useUserSettings() {
  return useQuery<UserSettings | null>({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings/user");
      if (!res.ok) throw new Error("Failed to fetch user settings");
      return res.json();
    },
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateUserSettingsInput) => {
      const res = await fetch("/api/settings/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
    },
  });
}

export function useUpdateAppSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { key: string; value: string }) => {
      const res = await fetch("/api/settings/app", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to update app setting");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-settings"] });
    },
  });
}
