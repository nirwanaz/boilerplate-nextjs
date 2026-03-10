"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  FileText,
  Users,
  Mail,
  Search,
  Star,
  Globe,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  FileText,
  Users,
  Mail,
  Search,
  Star,
  Globe,
};

export function MarketingClient({ stats, newsletters }: any) {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2 px-2">
        <h1 className="text-4xl font-black tracking-tighter text-white">
          Marketing <span className="text-slate-500 underline decoration-white/10 decoration-2 underline-offset-8">Hub</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Amplify your reach and monitor your audience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat: any) => (
          <Link key={stat.title} href={stat.href} className="group block h-full">
            <Card className="bg-slate-900/40 border-white/[0.05] shadow-sm rounded-3xl overflow-hidden transition-colors hover:border-white/10 h-full">
              <CardContent className="p-8 relative">
                <div className="flex items-center justify-between mb-8">
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border border-white/[0.05] group-hover:bg-slate-900 transition-colors", stat.bg)}>
                    {(() => {
                      const Icon = iconMap[stat.iconName] || Globe;
                      return <Icon className={cn("h-6 w-6", stat.color)} />;
                    })()}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
                    {stat.title === "Subscribers" && <Badge variant="outline" className="bg-blue-500/10 text-blue-400 text-[10px] font-bold border-none px-2 py-0.5 rounded-md">+24%</Badge>}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">{stat.description}</span>
                  <div className="flex items-center text-[10px] text-blue-500 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                    Manage <ArrowRight className="h-3 w-3 ml-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-slate-900/40 border-white/[0.05] shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-8 border-b border-white/[0.05] flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black text-white tracking-tight">Campaign History</CardTitle>
              <CardDescription className="text-slate-500 font-medium uppercase text-[10px] tracking-widest mt-1">Newsletter Synchronization</CardDescription>
            </div>
            <Link
              href="/admin/marketing/newsletters"
              className="px-6 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-[10px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest"
            >
              Full Archive
            </Link>
          </CardHeader>
          <CardContent className="p-8">
            {newsletters.length === 0 ? (
              <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                <Mail className="h-10 w-10 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 font-bold text-lg uppercase tracking-tight">No active campaigns</p>
                <Link href="/admin/marketing/newsletters/new" className="text-blue-500 hover:text-blue-400 font-bold text-sm mt-4 inline-block transition-all">
                  Launch First Campaign <ArrowRight className="inline-block h-3 w-3 ml-1" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {newsletters.map((nl: any) => (
                  <div
                    key={nl.id}
                    className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl group/item hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-default"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-xl bg-slate-950 flex items-center justify-center border border-white/[0.05] group-hover/item:border-white/10 transition-colors">
                        <Mail className="h-5 w-5 text-slate-500 group-hover/item:text-blue-400 transition-colors" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg tracking-tight group-hover/item:text-white transition-colors">{nl.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                            {new Date(nl.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-800" />
                          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">1.2k Recipients</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-emerald-500 tracking-tight">42% OPEN</p>
                      </div>
                      <Badge
                        className={cn(
                          "uppercase text-[10px] font-bold tracking-widest px-3 py-1 rounded-md border-none",
                          nl.status === "sent" ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-800 text-slate-500"
                        )}
                      >
                        {nl.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-white/[0.05] shadow-sm rounded-3xl overflow-hidden flex flex-col justify-between">
          <CardHeader className="p-8 border-b border-white/[0.05]">
            <CardTitle className="text-2xl font-black text-white tracking-tight">Growth Insight</CardTitle>
            <CardDescription className="text-slate-500 font-medium uppercase text-[10px] tracking-widest mt-1">Audience Retention</CardDescription>
          </CardHeader>
          <CardContent className="p-8 flex-1 flex flex-col justify-center gap-10">
            <div className="relative h-44 w-44 mx-auto">
               <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                <circle 
                  cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="6" fill="transparent" 
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * 0.78)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white tracking-tighter">78%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Retention</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                </div>
                <span className="text-xs font-bold text-white">82%</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inactive</span>
                </div>
                <span className="text-xs font-bold text-white">18%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
