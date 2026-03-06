"use client";

import { useUserSettings, useUpdateUserSettings } from "@/domains/settings/hooks/use-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function NotificationsSettingsPage() {
  const { data: settings, isLoading } = useUserSettings();
  const updateSettings = useUpdateUserSettings();

  async function handleToggle(key: "email_notifications" | "push_notifications", value: boolean) {
    try {
      await updateSettings.mutateAsync({ [key]: value });
      toast.success("Notification preference updated");
    } catch {
      toast.error("Failed to update notifications");
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
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Configure how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications via email
            </p>
          </div>
          <Switch
            checked={settings?.email_notifications ?? true}
            onCheckedChange={(checked) => handleToggle("email_notifications", checked)}
            disabled={updateSettings.isPending}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive push notifications in browser
            </p>
          </div>
          <Switch
            checked={settings?.push_notifications ?? false}
            onCheckedChange={(checked) => handleToggle("push_notifications", checked)}
            disabled={updateSettings.isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
}
