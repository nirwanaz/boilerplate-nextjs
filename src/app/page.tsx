import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Showcase from "@/components/landing/Showcase";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import { marketingService } from "@/domains/marketing/services/marketing.service";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await marketingService.getSeoByPath("/");
  if (!seo) return {};

  return {
    title: seo.metaTitle || undefined,
    description: seo.metaDescription || undefined,
    keywords: seo.keywords || undefined,
    openGraph: seo.ogImage
      ? {
          images: [{ url: seo.ogImage }],
        }
      : undefined,
  };
}

export default async function HomePage() {
  const [content, testimonials] = await Promise.all([
    marketingService.getLandingContent(),
    marketingService.getPublishedTestimonials(),
  ]);

  // Helper to get value by section and key
  const getC = (section: string, key: string, fallback: string) => {
    return content.find((item) => item.section === section && item.key === key)?.value || fallback;
  };

  return (
    <main className="bg-slate-950 text-white overflow-x-hidden">
      <Navbar />
      <Hero 
        badge_text={getC("hero", "badge_text", "Now in Public Beta — Join 2,000+ early adopters")}
        title_line1={getC("hero", "title_line1", "Build the Future")}
        title_line2={getC("hero", "title_line2", "Ship Faster")}
        subtitle={getC("hero", "subtitle", "The all-in-one platform that transforms how teams design, develop, and deploy digital products. Powered by AI. Loved by developers.")}
        cta_primary={getC("hero", "cta_primary", "Start Building Free")}
        cta_secondary={getC("hero", "cta_secondary", "Watch Demo")}
        social_proof={getC("hero", "social_proof", "Loved by 2,000+ developers")}
      />
      <Features 
        title={getC("features", "title", "Everything you need to ship")}
        subtitle={getC("features", "subtitle", "Powerful tools designed to work together.")}
      />
      <Showcase 
        title={getC("showcase", "title", "Engineered for excellence")}
        subtitle={getC("showcase", "subtitle", "Experience the most intuitive workflow ever built.")}
      />
      <HowItWorks 
        title={getC("how_it_works", "title", "How it works")}
        subtitle={getC("how_it_works", "subtitle", "Simplicity meets performance in every step.")}
      />
      <Testimonials testimonials={testimonials} />
      <CTA 
        title={getC("cta", "title", "Ready to build the future?")}
        subtitle={getC("cta", "subtitle", "Join thousands of teams shipping faster with Nextura.")}
        button_text={getC("cta", "button_text", "Get Started Now")}
      />
      <Footer />
    </main>
  );
}
