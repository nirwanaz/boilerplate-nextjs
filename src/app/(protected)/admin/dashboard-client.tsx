"use client";

import { useActivityLogs } from "@/domains/activity-logs/hooks/use-activity-logs";
import { usePosts } from "@/domains/posts/hooks/use-posts";
import { useProducts } from "@/domains/products/hooks/use-products";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Shield,
  CreditCard,
  Users,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  {
    title: "Project Revenue",
    value: "$42,500",
    change: "+12.5%",
    trend: "up",
    icon: CreditCard,
    description: "Total net income this cycle",
  },
  {
    title: "Active Users",
    value: "2,420",
    change: "+18%",
    trend: "up",
    icon: Users,
    description: "Verified unique sessions",
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "-2%",
    trend: "down",
    icon: TrendingUp,
    description: "Visitor to customer ratio",
  },
  {
    title: "System Uptime",
    value: "99.99%",
    change: "0%",
    trend: "neutral",
    icon: Shield,
    description: "High-availability monitoring",
  },
];

export function DashboardClient() {
  const { data: logs } = useActivityLogs();
  const { data: posts } = usePosts();
  const { data: products } = useProducts();

  const counts = [
    { label: "Products", count: products?.length || 0, icon: Package },
    { label: "Posts", count: posts?.length || 0, icon: LayoutDashboard },
    { label: "Orders", count: 0, icon: ShoppingCart },
    { label: "Logs", count: logs?.length || 0, icon: Activity },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            Intelligence <span className="text-slate-500 underline decoration-white/10 decoration-2 underline-offset-8">Cockpit</span>
          </h1>
          <p className="text-slate-500 font-medium">Real-time operational metrics and system status.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/10 bg-slate-900/50 hover:bg-slate-900 text-slate-400 font-bold px-6 h-12 rounded-xl transition-all">
            Export Data
          </Button>
          <Button className="bg-white text-black hover:bg-slate-200 font-bold px-8 h-12 rounded-xl transition-all shadow-xl shadow-white/10">
            System Scan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-slate-900/40 border-white/[0.05] shadow-sm hover:border-white/10 transition-colors rounded-2xl overflow-hidden">
            <CardContent className="p-8 flex flex-col justify-between h-full relative">
              <div className="flex items-start justify-between mb-8">
                <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/[0.05]">
                  <stat.icon className="h-5 w-5 text-slate-400" />
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                  stat.trend === "up" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : 
                  stat.trend === "down" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : 
                  "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                )}>
                  {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : stat.trend === "down" ? <TrendingDown className="h-3 w-3" /> : null}
                  {stat.change}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 block">
                  {stat.title}
                </span>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-black text-white tracking-tighter">
                    {stat.value}
                  </h2>
                </div>
                <p className="text-[10px] text-slate-600 font-bold mt-4 uppercase tracking-widest">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-slate-900/40 border-white/[0.05] shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-8 border-b border-white/[0.05] flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black text-white tracking-tight">Active Matrix</CardTitle>
              <CardDescription className="text-slate-500 font-medium">Global entity status and synchronization</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Live View</span>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {counts.map((item) => (
                <div key={item.label} className="group cursor-default">
                  <div className="flex flex-col gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-950 border border-white/[0.05] flex items-center justify-center transition-colors group-hover:bg-slate-900">
                      <item.icon className="h-6 w-6 text-slate-500 group-hover:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tighter">{item.count}</h3>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1 group-hover:text-slate-400">{item.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-white/[0.05] shadow-sm rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="p-8 border-b border-white/[0.05]">
            <CardTitle className="text-2xl font-black text-white tracking-tight">System Feed</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Latest background operations</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-white/[0.05]">
              {logs?.slice(0, 5).map((log) => (
                <div key={log.id} className="p-6 hover:bg-white/[0.02] transition-colors cursor-default">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center border",
                        log.action === "CREATE" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                        log.action === "DELETE" ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                        "bg-blue-500/10 border-blue-500/20 text-blue-500"
                      )}>
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white tracking-tight">{log.entityType}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">{log.action}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-3 w-3 text-slate-700" />
                  </div>
                </div>
              ))}
              {(!logs || logs.length === 0) && (
                <div className="p-10 text-center text-slate-600 italic text-sm">
                  Waiting for system telemetry...
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-6 border-t border-white/[0.05]">
            <Link href="/admin/logs">
              <Button variant="ghost" className="w-full text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest py-6">
                View Full Audit
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
