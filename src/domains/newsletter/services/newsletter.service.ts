import { SubscriberRepository } from "../repositories/subscriber.repository";
import { NewsletterRepository } from "../repositories/newsletter.repository";
import { createSubscriberSchema } from "../entities/subscriber";
import { createNewsletterSchema, updateNewsletterSchema } from "../entities/newsletter";
import type { CreateSubscriberInput, Subscriber } from "../entities/subscriber";
import type { CreateNewsletterInput, UpdateNewsletterInput, Newsletter } from "../entities/newsletter";
import { hasPermission } from "@/shared/auth/rbac";
import { getSession } from "@/shared/auth/dal";
import { resend } from "@/lib/mail";

class NewsletterService {
  private subscriberRepo = new SubscriberRepository();
  private newsletterRepo = new NewsletterRepository();

  private async requireAdmin() {
    const session = await getSession();
    if (!session || !hasPermission(session.profile.role, ["admin"])) {
      throw new Error("Forbidden");
    }
    return session;
  }

  // --- Subscribers ---

  async getSubscribers(): Promise<Subscriber[]> {
    await this.requireAdmin();
    return this.subscriberRepo.findAll();
  }

  async getActiveCount(): Promise<number> {
    return this.subscriberRepo.countActive();
  }

  async subscribe(input: CreateSubscriberInput): Promise<Subscriber> {
    const validated = createSubscriberSchema.parse(input);
    // Check if already subscribed
    const existing = await this.subscriberRepo.findByEmail(validated.email);
    if (existing) {
      if (existing.status === "unsubscribed") {
        await this.subscriberRepo.resubscribe(existing.id);
        return (await this.subscriberRepo.findById(existing.id))!;
      }
      return existing; // already active
    }
    return this.subscriberRepo.create(validated);
  }

  async unsubscribe(id: string): Promise<void> {
    await this.requireAdmin();
    await this.subscriberRepo.unsubscribe(id);
  }

  async deleteSubscriber(id: string): Promise<void> {
    await this.requireAdmin();
    await this.subscriberRepo.delete(id);
  }

  // --- Newsletters ---

  async getNewsletters(): Promise<Newsletter[]> {
    await this.requireAdmin();
    return this.newsletterRepo.findAll();
  }

  async getNewsletter(id: string): Promise<Newsletter | null> {
    await this.requireAdmin();
    return this.newsletterRepo.findById(id);
  }

  async createNewsletter(input: CreateNewsletterInput): Promise<Newsletter> {
    await this.requireAdmin();
    const validated = createNewsletterSchema.parse(input);
    return this.newsletterRepo.create(validated);
  }

  async updateNewsletter(id: string, input: UpdateNewsletterInput): Promise<Newsletter> {
    await this.requireAdmin();
    const existing = await this.newsletterRepo.findById(id);
    if (!existing) throw new Error("Newsletter not found");
    if (existing.status === "sent") throw new Error("Cannot edit a sent newsletter");
    const validated = updateNewsletterSchema.parse(input);
    return this.newsletterRepo.update(id, validated);
  }

  async deleteNewsletter(id: string): Promise<void> {
    await this.requireAdmin();
    await this.newsletterRepo.delete(id);
  }

  async sendNewsletter(id: string): Promise<{ sentCount: number }> {
    await this.requireAdmin();
    const newsletter = await this.newsletterRepo.findById(id);
    if (!newsletter) throw new Error("Newsletter not found");
    if (newsletter.status === "sent") throw new Error("Newsletter already sent");

    await this.newsletterRepo.markSending(id);

    try {
      const activeSubscribers = await this.subscriberRepo.findActive();
      if (activeSubscribers.length === 0) {
        await this.newsletterRepo.markFailed(id);
        throw new Error("No active subscribers");
      }

      // Send in batches of 50
      const batchSize = 50;
      let sentCount = 0;
      for (let i = 0; i < activeSubscribers.length; i += batchSize) {
        const batch = activeSubscribers.slice(i, i + batchSize);
        const emails = batch.map((s) => s.email);

        await resend.emails.send({
          from: "newsletter@updates.nextura.app",
          to: emails,
          subject: newsletter.subject,
          html: newsletter.body,
        });

        sentCount += emails.length;
      }

      await this.newsletterRepo.markSent(id, sentCount);
      return { sentCount };
    } catch (error) {
      if (error instanceof Error && error.message === "No active subscribers") {
        throw error;
      }
      await this.newsletterRepo.markFailed(id);
      throw error;
    }
  }
}

export const newsletterService = new NewsletterService();
