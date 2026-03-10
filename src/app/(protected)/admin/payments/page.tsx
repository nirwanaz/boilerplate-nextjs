import { requireAuthWithRole } from "@/shared/auth/dal";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { CreditCard, DollarSign, PackageCheck, ArrowUpRight, History, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminPaymentsPage() {
  await requireAuthWithRole("admin");

  const orders = await db.query.orders.findMany({
    with: {
      user: true,
    },
    orderBy: [desc(schema.orders.createdAt)],
  });

  type OrderWithUser = typeof schema.orders.$inferSelect & { user: typeof schema.user.$inferSelect | null };

  const totalRevenue = orders
    .filter((o: OrderWithUser) => o.status === "paid")
    .reduce((sum: number, o: OrderWithUser) => sum + o.amount, 0);

  const stats = [
    {
      title: "Total Revenue",
      value: `$${(totalRevenue / 100).toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-500",
      description: "Net processed volume",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: CreditCard,
      color: "text-blue-500",
      description: "Lifetime transactions",
    },
    {
      title: "Successful",
      value: orders.filter((o: OrderWithUser) => o.status === "paid").length,
      icon: PackageCheck,
      color: "text-indigo-500",
      description: "Completed fulfillment",
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            Financial <span className="text-slate-500 underline decoration-white/10 decoration-2 underline-offset-8">Intelligence</span>
          </h1>
          <p className="text-slate-500 font-medium">Real-time surveillance of global transaction flow.</p>
        </div>
        <div className="hidden sm:flex items-center gap-4 bg-slate-900/40 border border-white/[0.05] rounded-3xl px-6 py-4 shadow-sm">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live Volume</span>
            <span className="text-xs font-bold text-white uppercase tracking-tight">Active Stream</span>
          </div>
          <div className="h-8 w-[1px] bg-white/[0.05]" />
          <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border border-white/[0.05]">
            <Activity className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-slate-900/40 border-white/[0.05] shadow-sm rounded-3xl overflow-hidden group hover:border-white/10 transition-colors">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="h-12 w-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/[0.05] group-hover:bg-slate-900 transition-colors">
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.title}</p>
                <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
                <p className="text-xs text-slate-600 font-medium italic pt-4 border-t border-white/[0.05] mt-4">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900/40 border-white/[0.05] shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="p-8 border-b border-white/[0.05] flex flex-row items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-slate-950 flex items-center justify-center border border-white/[0.05]">
                <History className="h-4 w-4 text-slate-500" />
              </div>
              <CardTitle className="text-2xl font-black text-white tracking-tight uppercase">Audit Trail</CardTitle>
            </div>
            <CardDescription className="text-slate-500 font-medium uppercase text-[10px] tracking-widest mt-1">
              Cross-network financial monitoring
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-white/[0.03] border-white/10 text-slate-400 font-bold px-4 py-1.5 rounded-lg uppercase text-[10px] tracking-widest">
            Live Feed
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.05] hover:bg-transparent">
                <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6 pl-8">ID Reference</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6">Intelligence</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6">Volume</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6">Status</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6 pr-8 text-right">Chronology</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-slate-600 italic">
                    No transaction records found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order: OrderWithUser) => (
                  <TableRow 
                    key={order.id}
                    className="border-white/[0.05] hover:bg-white/[0.02] transition-colors group"
                  >
                    <TableCell className="py-6 pl-8">
                      <Link href={`/admin/payments/${order.id}`} className="font-mono text-[10px] text-blue-500/80 hover:text-blue-500 font-bold flex items-center gap-2">
                        {order.id.slice(0, 8)}
                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-base tracking-tight group-hover:text-white transition-colors">
                          {order.user?.name || "System Record"}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                          {order.user?.email || "EXTERNAL_CLIENT"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-white text-lg tracking-tighter">
                      ${(order.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          "font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-md border-none",
                          order.status === "paid" ? "bg-emerald-500/10 text-emerald-500" :
                          order.status === "failed" ? "bg-rose-500/10 text-rose-500" :
                          "bg-slate-800 text-slate-500"
                        )}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-sm font-bold text-white tracking-tighter">
                          {new Date(order.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                          {new Date(order.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
