import * as dotenv from "dotenv";
dotenv.config();

import { marketingService } from "../src/domains/marketing/services/marketing.service";
import { newsletterService } from "../src/domains/newsletter/services/newsletter.service";
import { db } from "../src/lib/db";
import { landingContent, testimonials, seoSettings, subscribers, newsletters } from "../src/lib/db/schema";
import { sql } from "drizzle-orm";

async function runDiagnostics() {
  console.log("🔍 Starting Marketing Hub Diagnostics...\n");

  try {
    // 1. Check Database Connection
    console.log("⌛ Checking database connection...");
    await db.execute(sql`SELECT 1`);
    console.log("✅ Database connection established.\n");

    // 2. Check Landing Content
    console.log("⌛ Checking Landing Content...");
    const landingItems = await marketingService.getLandingContent();
    console.log(`✅ Found ${landingItems.length} landing content items.`);
    if (landingItems.length > 0) {
      console.log(`   Sample: [${landingItems[0].section}] ${landingItems[0].key} = ${landingItems[0].value.substring(0, 30)}...`);
    } else {
      console.log("   ⚠️ No landing content found in database.");
    }
    console.log("");

    // 3. Check Testimonials
    console.log("⌛ Checking Testimonials...");
    const allTestimonials = await marketingService.getTestimonials();
    const publishedTestimonials = await marketingService.getPublishedTestimonials();
    console.log(`✅ Found ${allTestimonials.length} total testimonials.`);
    console.log(`✅ Found ${publishedTestimonials.length} published testimonials.`);
    console.log("");

    // 4. Check SEO Settings
    console.log("⌛ Checking SEO Settings...");
    const seoItems = await marketingService.getSeoSettings();
    console.log(`✅ Found ${seoItems.length} SEO settings.`);
    console.log("");

    // 5. Check Newsletter & Subscribers
    console.log("⌛ Checking Newsletter & Subscribers...");
    const activeCount = await newsletterService.getActiveCount();
    console.log(`✅ Active Subscriber Count: ${activeCount}`);
    
    // Test Subscription (internal call)
    const testEmail = `test-${Date.now()}@example.com`;
    console.log(`⌛ Testing subscription for: ${testEmail}`);
    const sub = await newsletterService.subscribe({ email: testEmail });
    console.log(`✅ Subscription successful: ${sub.id}`);
    
    // Clean up test sub
    // await db.delete(subscribers).where(sql`id = ${sub.id}`);
    // console.log("✅ Cleaned up test subscriber.\n");

    console.log("🎉 All diagnostics passed successfully!");
  } catch (error) {
    console.error("\n❌ Diagnostics failed!");
    console.error(error);
    process.exit(1);
  }
}

runDiagnostics();
