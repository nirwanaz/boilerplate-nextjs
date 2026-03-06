import { requireAuth } from "@/shared/auth/dal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ShoppingCart, Settings, Shield } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireAuth();
  const { profile } = session;

  const quickLinks = [
    {
      title: "Posts",
      description: "Manage your content",
      href: "/posts",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Orders",
      description: "View order history",
      href: "/orders",
      icon: ShoppingCart,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Settings",
      description: "Configure your account",
      href: "/settings",
      icon: Settings,
      color: "from-orange-500 to-amber-500",
    },
    ...(profile.role === "admin"
      ? [
          {
            title: "Admin",
            description: "User management",
            href: "/admin",
            icon: Shield,
            color: "from-red-500 to-rose-500",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {profile.full_name || profile.email}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {link.title}
                </CardTitle>
                <div
                  className={`h-8 w-8 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <link.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{link.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Account information at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium">{profile.full_name || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{profile.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Role</span>
              <Badge variant="outline" className="uppercase text-xs">
                {profile.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
