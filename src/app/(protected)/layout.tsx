import { requireAuth } from "@/shared/auth/dal";
import { SidebarNav } from "@/shared/components/sidebar-nav";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/shared/components/breadcrumbs";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <SidebarProvider>
        <SidebarNav profile={session.profile} />
        <SidebarInset className="bg-background">
          <header className="flex h-16 shrink-0 items-center gap-4 border-b border-white/[0.05] bg-slate-950 px-6 sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 text-slate-500 hover:text-white transition-colors" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-white/[0.05]" />
              <Breadcrumbs />
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-900 border border-white/[0.05] px-3 py-1.5 rounded-lg">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Online</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-10">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
