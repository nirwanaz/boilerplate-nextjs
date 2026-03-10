import { LandingContentRepository } from "../repositories/landing-content.repository";
import { TestimonialRepository } from "../repositories/testimonial.repository";
import { SeoRepository } from "../repositories/seo.repository";
import { upsertLandingContentSchema } from "../entities/landing-content";
import { createTestimonialSchema, updateTestimonialSchema } from "../entities/testimonial";
import { upsertSeoSchema } from "../entities/seo";
import type { UpsertLandingContentInput } from "../entities/landing-content";
import type { CreateTestimonialInput, UpdateTestimonialInput, Testimonial } from "../entities/testimonial";
import type { UpsertSeoInput, SeoSetting } from "../entities/seo";
import type { LandingContent } from "../entities/landing-content";
import { hasPermission } from "@/shared/auth/rbac";
import { getSession } from "@/shared/auth/dal";

class MarketingService {
  private landingRepo = new LandingContentRepository();
  private testimonialRepo = new TestimonialRepository();
  private seoRepo = new SeoRepository();

  private async requireAdmin() {
    const session = await getSession();
    if (!session || !hasPermission(session.profile.role, ["admin"])) {
      throw new Error("Forbidden");
    }
    return session;
  }

  // --- Landing Content ---

  async getLandingContent(): Promise<LandingContent[]> {
    return this.landingRepo.findAll();
  }

  async getLandingSection(section: string): Promise<LandingContent[]> {
    return this.landingRepo.findBySection(section);
  }

  async getLandingValue(section: string, key: string): Promise<string> {
    const item = await this.landingRepo.findBySectionAndKey(section, key);
    return item?.value ?? "";
  }

  async updateLandingContent(items: UpsertLandingContentInput[]): Promise<void> {
    await this.requireAdmin();
    const validated = items.map((i) => upsertLandingContentSchema.parse(i));
    await this.landingRepo.bulkUpsert(validated);
  }

  // --- Testimonials ---

  async getTestimonials(): Promise<Testimonial[]> {
    return this.testimonialRepo.findAll();
  }

  async getPublishedTestimonials(): Promise<Testimonial[]> {
    return this.testimonialRepo.findPublished();
  }

  async createTestimonial(input: CreateTestimonialInput): Promise<Testimonial> {
    await this.requireAdmin();
    const validated = createTestimonialSchema.parse(input);
    return this.testimonialRepo.create(validated);
  }

  async updateTestimonial(id: string, input: UpdateTestimonialInput): Promise<Testimonial> {
    await this.requireAdmin();
    const existing = await this.testimonialRepo.findById(id);
    if (!existing) throw new Error("Testimonial not found");
    const validated = updateTestimonialSchema.parse(input);
    return this.testimonialRepo.update(id, validated);
  }

  async deleteTestimonial(id: string): Promise<void> {
    await this.requireAdmin();
    const existing = await this.testimonialRepo.findById(id);
    if (!existing) throw new Error("Testimonial not found");
    await this.testimonialRepo.delete(id);
  }

  // --- SEO ---

  async getSeoSettings(): Promise<SeoSetting[]> {
    return this.seoRepo.findAll();
  }

  async getSeoByPath(pagePath: string): Promise<SeoSetting | null> {
    return this.seoRepo.findByPath(pagePath);
  }

  async upsertSeo(input: UpsertSeoInput): Promise<SeoSetting> {
    await this.requireAdmin();
    const validated = upsertSeoSchema.parse(input);
    return this.seoRepo.upsert(validated);
  }

  async deleteSeo(id: string): Promise<void> {
    await this.requireAdmin();
    await this.seoRepo.delete(id);
  }
}

export const marketingService = new MarketingService();
