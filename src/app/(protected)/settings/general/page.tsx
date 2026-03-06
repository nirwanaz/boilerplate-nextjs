"use client";

import { useState } from "react";
import { useAppSettings, useUpdateAppSettings } from "@/domains/settings/hooks/use-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export default function GeneralSettingsPage() {
  const { data: settings, isLoading } = useAppSettings();
  const updateSetting = useUpdateAppSettings();

  const [siteName, setSiteName] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (settings && !initialized) {
    const nameVal = settings.find((s) => s.key === "site_name");
    if (nameVal) setSiteName(nameVal.value);
    setInitialized(true);
  }

  const maintenanceMode = settings?.find((s) => s.key === "maintenance_mode")?.value === "true";

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateSetting.mutateAsync({ key: "site_name", value: siteName });
      toast.success("Site name updated!");
    } catch {
      toast.error("Failed to update site name");
    }
  }

  async function handleToggleMaintenance(value: boolean) {
    try {
      await updateSetting.mutateAsync({ key: "maintenance_mode", value: String(value) });
      toast.success(`Maintenance mode ${value ? "enabled" : "disabled"}`);
    } catch {
      toast.error("Failed to update maintenance mode");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Admin-only: configure global application settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveName} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="My App"
              />
            </div>
            <Button type="submit" disabled={updateSetting.isPending}>
              {updateSetting.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
          <CardDescription>
            When enabled, the app shows a maintenance page to non-admin users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                {maintenanceMode
                  ? "App is currently in maintenance mode"
                  : "App is currently live"}
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={handleToggleMaintenance}
              disabled={updateSetting.isPending}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
