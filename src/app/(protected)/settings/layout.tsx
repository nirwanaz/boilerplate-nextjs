"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Palette, Bell, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const settingsTabs = [
  { title: "Profile", href: "/settings/profile", icon: User },
  { title: "Appearance", href: "/settings/appearance", icon: Palette },
  { title: "Notifications", href: "/settings/notifications", icon: Bell },
  { title: "General", href: "/settings/general", icon: Wrench, adminOnly: true },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <nav className="flex md:flex-col gap-1 md:w-48 shrink-0">
          {settingsTabs.map((tab) => (
            <Button
              key={tab.href}
              variant={pathname === tab.href ? "secondary" : "ghost"}
              className="justify-start"
              asChild
            >
              <Link href={tab.href}>
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.title}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
