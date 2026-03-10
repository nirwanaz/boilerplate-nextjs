import { marketingService } from "@/domains/marketing/services/marketing.service";
import { newsletterService } from "@/domains/newsletter/services/newsletter.service";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { requireAuthWithRole } from "@/shared/auth/dal";
import { MarketingClient } from "./marketing-client";
import {
  FileText,
  Users,
  Mail,
  Search,
  Star,
  Globe,
} from "lucide-react";

export default async function MarketingDashboard() {
  await requireAuthWithRole("admin");

  const [testimonials, seoSettings, subscribers, newsletters, landingContent] =
    await Promise.all([
      marketingService.getTestimonials(),
      marketingService.getSeoSettings(),
      newsletterService.getActiveCount(),
      db.query.newsletters.findMany({
        orderBy: [desc(schema.newsletters.createdAt)],
        limit: 5,
      }),
      marketingService.getLandingContent(),
    ]);

  const stats = [
    {
      title: "Landing Sections",
      value: new Set(landingContent.map((c) => c.section)).size,
      iconName: "FileText",
      href: "/admin/marketing/landing",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      description: "Manage page content",
    },
    {
      title: "Testimonials",
      value: testimonials.length,
      iconName: "Star",
      href: "/admin/marketing/testimonials",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      description: "Client social proof",
    },
    {
      title: "SEO Pages",
      value: seoSettings.length,
      iconName: "Search",
      href: "/admin/marketing/seo",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      description: "Search optimization",
    },
    {
      title: "Subscribers",
      value: subscribers.toLocaleString(),
      iconName: "Users",
      href: "/admin/marketing/subscribers",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      description: "Growth in last 30d",
    },
    {
      title: "Newsletters",
      value: newsletters.length,
      iconName: "Mail",
      href: "/admin/marketing/newsletters",
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      description: "Campaigns sent",
    },
    {
      title: "SEO Coverage",
      value: `${seoSettings.length} pages`,
      iconName: "Globe",
      href: "/admin/marketing/seo",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      description: "Meta visibility",
    },
  ];

  return (
    <MarketingClient 
      stats={stats} 
      newsletters={newsletters}
    />
  );
}
