import { marketingService } from "@/domains/marketing/services/marketing.service";
import { newsletterService } from "@/domains/newsletter/services/newsletter.service";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { requireAuthWithRole } from "@/shared/auth/dal";
import { MarketingClient } from "./marketing-client";

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

  const statItems = [
    {
      title: "Landing Sections",
      value: new Set(landingContent.map((c) => c.section)).size.toString(),
      iconName: "FileText",
      href: "/admin/marketing/landing",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      description: "Manage page content",
    },
    {
      title: "Testimonials",
      value: testimonials.length.toString(),
      iconName: "Star",
      href: "/admin/marketing/testimonials",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      description: "Client social proof",
    },
    {
      title: "SEO Pages",
      value: seoSettings.length.toString(),
      iconName: "Search",
      href: "/admin/marketing/seo",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      description: "Search optimization",
    },
    {
      title: "Subscribers",
      value: subscribers.toString(),
      iconName: "Users",
      href: "/admin/marketing/subscribers",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      description: "Active subscribers",
    },
    {
      title: "Newsletters",
      value: newsletters.length.toString(),
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
      stats={statItems} 
      newsletters={newsletters}
    />
  );
}
