"use client";

import { useActivityLogs } from "@/domains/activity-logs/hooks/use-activity-logs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Activity, ShieldAlert, Fingerprint, Terminal, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AdminLogsPage() {
  const { data: logs, isLoading } = useActivityLogs();

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            Activity <span className="text-slate-500 underline decoration-white/10 decoration-2 underline-offset-8">Sentinel</span>
          </h1>
          <p className="text-slate-500 font-medium">Complete audit trail of all system operations.</p>
        </div>
        <div className="hidden sm:flex items-center gap-4 bg-slate-900/40 border border-white/[0.05] rounded-3xl px-6 py-4 shadow-sm">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Protocol Stance</span>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-tight">Synchronized</span>
          </div>
          <div className="h-8 w-[1px] bg-white/[0.05]" />
          <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/[0.05]">
            <Activity className="h-5 w-5 text-blue-500" />
          </div>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-white/[0.05] shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="p-8 border-b border-white/[0.05] flex flex-row items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-slate-950 flex items-center justify-center border border-white/[0.05]">
                <ShieldAlert className="h-4 w-4 text-slate-500" />
              </div>
              <CardTitle className="text-2xl font-black text-white tracking-tight uppercase">Audit Surveillance</CardTitle>
            </div>
            <CardDescription className="text-slate-500 font-medium uppercase text-[10px] tracking-widest mt-1">
              Monitoring node interaction across organizational grid
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
             <Terminal className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System.Log</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-40">
              <Loader2 className="h-10 w-10 animate-spin text-slate-700" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.05] hover:bg-transparent">
                  <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6 pl-8">Initiator</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6">Operation</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6">Subject</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6">Intelligence</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6 pr-8 text-right">Chronology</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs?.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={5} className="text-center py-32">
                      <div className="flex flex-col items-center justify-center gap-6 opacity-30">
                        <Fingerprint className="h-14 w-14 text-slate-400" />
                        <div className="space-y-1">
                          <p className="text-xl font-black text-white uppercase tracking-tighter">No Events Detected</p>
                          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Awaiting system interaction</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs?.map((log) => (
                    <TableRow 
                      key={log.id}
                      className="border-white/[0.05] hover:bg-white/[0.02] transition-colors group cursor-default"
                    >
                      <TableCell className="py-6 pl-8">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-slate-950 border border-white/[0.05] flex items-center justify-center group-hover:border-white/10 transition-colors">
                            <User className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-white text-base tracking-tight group-hover:text-white transition-colors">
                              {(log as any).user?.name || "CORE SYSTEM"}
                            </span>
                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest opacity-60 truncate max-w-[180px]">
                              {(log as any).user?.email || "INTERNAL_DAEMON"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={cn(
                            "font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-md border-none",
                            log.action.includes("DELETE") ? "bg-rose-500/10 text-rose-500" :
                            log.action.includes("CREATE") ? "bg-emerald-500/10 text-emerald-500" :
                            "bg-blue-500/10 text-blue-500"
                          )}
                        >
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-400 text-xs uppercase tracking-tight">{log.entityType}</span>
                          <span className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">ID://{log.entityId?.slice(0, 8)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs text-slate-500 font-medium leading-none max-w-[200px] truncate">{log.details}</span>
                          <div className="flex items-center gap-2 pt-1.5 border-t border-white/[0.05] w-fit">
                            <Fingerprint className="h-3 w-3 text-slate-700" />
                            <span className="text-[9px] text-slate-700 font-bold tracking-widest uppercase">IP: {log.ipAddress}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-sm font-bold text-white tracking-tighter">
                            {format(new Date(log.createdAt), "HH:mm:ss")}
                          </span>
                          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest opacity-60">
                            {format(new Date(log.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
