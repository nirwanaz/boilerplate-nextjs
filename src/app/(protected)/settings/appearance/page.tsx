"use client";

import { useTheme } from "next-themes";
import { useUpdateUserSettings } from "@/domains/settings/hooks/use-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Moon, Sun, Monitor } from "lucide-react";

export default function AppearanceSettingsPage() {
  const { theme: currentTheme, setTheme } = useTheme();
  const updateSettings = useUpdateUserSettings();

  async function handleThemeChange(newTheme: "light" | "dark" | "system") {
    try {
      // Apply theme immediately to DOM via next-themes
      setTheme(newTheme);
      
      // Persist to database in background
      await updateSettings.mutateAsync({ theme: newTheme });
      
      toast.success(`Theme changed to ${newTheme}`);
    } catch {
      toast.error("Failed to save theme preference");
    }
  }



  const themes = [
    { value: "light" as const, label: "Light", icon: Sun, description: "Light background with dark text" },
    { value: "dark" as const, label: "Dark", icon: Moon, description: "Dark background with light text" },
    { value: "system" as const, label: "System", icon: Monitor, description: "Follow system preference" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Theme</Label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((theme) => (
              <Button
                key={theme.value}
                variant={currentTheme === theme.value ? "default" : "outline"}
                className="h-auto flex-col gap-2 p-4"
                onClick={() => handleThemeChange(theme.value)}
                disabled={updateSettings.isPending}
              >
                <theme.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{theme.label}</span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {theme.description}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
