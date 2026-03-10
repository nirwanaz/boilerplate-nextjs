"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Profile } from "@/shared/types";
import {
  LayoutDashboard,
  FileText,
  Settings,
  ShoppingCart,
  Shield,
  CreditCard,
  Package,
  History,
  Star,
  Search,
  Users,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { UserNav } from "@/shared/components/user-nav";

const mainNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Posts", href: "/posts", icon: FileText },
  { title: "Products", href: "/products", icon: Package },
  { title: "Orders", href: "/orders", icon: ShoppingCart },
];

const adminNavItems = [
  { title: "Admin Panel", href: "/admin", icon: Shield },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Activity Logs", href: "/admin/logs", icon: History },
];

const marketingNavItems = [
  { title: "Marketing Dashboard", href: "/admin/marketing", icon: Shield },
  { title: "Landing Page", href: "/admin/marketing/landing", icon: FileText },
  { title: "Testimonials", href: "/admin/marketing/testimonials", icon: Star },
  { title: "SEO Settings", href: "/admin/marketing/seo", icon: Search },
  { title: "Subscribers", href: "/admin/marketing/subscribers", icon: Users },
  { title: "Newsletters", href: "/admin/marketing/newsletters", icon: Mail },
];

const bottomNavItems = [
  { title: "Settings", href: "/settings", icon: Settings },
];

const NavItem = ({ item, isActive, colorClass }: any) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn(
          "relative group rounded-lg px-4 py-6 transition-colors",
          "hover:bg-white/[0.03]",
          isActive ? "bg-white/[0.05]" : "text-slate-500"
        )}
      >
        <Link href={item.href} className="flex items-center gap-4 z-10 w-full">
          <div 
            className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center transition-colors border border-white/[0.05]",
              isActive ? "bg-slate-900 border-white/10" : "bg-transparent group-hover:border-white/10"
            )}
          >
            <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-white" : "text-slate-600 group-hover:text-slate-400")} />
          </div>
          <span className={cn("font-bold text-sm tracking-tight", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")}>
            {item.title}
          </span>
          {item.title === "Subscribers" && (
            <span className="ml-auto text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
              12+
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

interface SidebarNavProps {
  profile: Profile;
}

export function SidebarNav({ profile }: SidebarNavProps) {
  const pathname = usePathname();
  const isAdmin = profile.role === "admin";

  return (
    <Sidebar className="border-r border-white/[0.05] bg-slate-950">
      <SidebarHeader className="p-8">
        <Link href="/dashboard" className="flex items-center gap-4 group">
          <div 
            className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/10"
          >
            <span className="text-white font-black text-xl tracking-tighter">B</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-white leading-none tracking-tight">
              ANTIGRAVITY
            </span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
              CONSOLE
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-transparent">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 px-2 mb-8 cursor-default">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/[0.05]">
              <Shield className="text-slate-400 h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight">NEXTURA</span>
              <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">Admin Engine</span>
            </div>
          </div>

          <div className="relative group mb-8 px-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600 group-focus-within:text-slate-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search Intelligence..." 
              className="w-full bg-slate-900/50 border border-white/[0.05] rounded-xl py-2.5 pl-11 pr-11 text-xs font-medium text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-white/10 transition-all"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
              ⌘K
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-slate-500 text-[11px] font-black uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
            Main Interface
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {mainNavItems.map((item) => (
                <NavItem 
                  key={item.href} 
                  item={item} 
                  isActive={pathname === item.href || pathname.startsWith(item.href + "/")} 
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-slate-500 text-[11px] font-black uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
              Administrative
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {adminNavItems.map((item) => {
                  const isActive = item.href === "/admin" 
                    ? pathname === item.href 
                    : pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <NavItem 
                      key={item.href} 
                      item={item} 
                      isActive={isActive} 
                    />
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-slate-500 text-[11px] font-black uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
              Marketing Hub
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {marketingNavItems.map((item) => (
                  <NavItem 
                    key={item.href} 
                    item={item} 
                    isActive={pathname === item.href || pathname.startsWith(item.href + "/")} 
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-6 bg-white/[0.02] backdrop-blur-md border-t border-white/5 mt-auto">
        <SidebarMenu className="gap-2 mb-6">
          {bottomNavItems.map((item) => (
            <NavItem 
              key={item.href} 
              item={item} 
              isActive={pathname === item.href || pathname.startsWith(item.href + "/")} 
            />
          ))}
        </SidebarMenu>
        <div className="bg-slate-900/50 rounded-2xl p-2 border border-white/5">
          <UserNav profile={profile} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
