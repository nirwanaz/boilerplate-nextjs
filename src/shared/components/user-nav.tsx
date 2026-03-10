"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/shared/auth/auth-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/shared/types";
import Link from "next/link";

const roleBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  admin: "destructive",
  manager: "default",
  user: "secondary",
};

interface UserNavProps {
  profile: Profile;
}

export function UserNav({ profile }: UserNavProps) {
  const router = useRouter();

  const initials = profile.fullName
    ? profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : profile.email.slice(0, 2).toUpperCase();

  async function handleLogout() {
    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-slate-800 bg-slate-900 shadow-xl overflow-hidden group hover:scale-105 transition-all duration-300 p-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-blue-500/30 transition-all duration-300">
            <AvatarFallback className="bg-transparent text-slate-100 font-medium text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 bg-slate-950/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold leading-none text-white tracking-tight">
                {profile.fullName || "User"}
              </p>
              <Badge variant={roleBadgeVariant[profile.role] ?? "secondary"} className="text-[10px] uppercase h-5">
                {profile.role}
              </Badge>
            </div>
            <p className="text-xs leading-none text-slate-400 font-medium truncate">
              {profile.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem asChild className="rounded-lg focus:bg-white/10 focus:text-white cursor-pointer py-2.5">
          <Link href="/settings/profile" className="flex items-center w-full">
            <UserCircle className="mr-2 h-4 w-4 text-blue-400" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-lg focus:bg-white/10 focus:text-white cursor-pointer py-2.5">
          <Link href="/settings" className="flex items-center w-full">
            <Settings className="mr-2 h-4 w-4 text-purple-400" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem onClick={handleLogout} className="rounded-lg focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer py-2.5">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
