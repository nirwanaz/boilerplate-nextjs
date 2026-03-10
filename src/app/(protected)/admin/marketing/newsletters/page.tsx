import { requireAuthWithRole } from "@/shared/auth/dal";
import { newsletterService } from "@/domains/newsletter/services/newsletter.service";
import NewsletterList from "@/domains/newsletter/components/newsletter-list";

export default async function NewslettersPage() {
  await requireAuthWithRole("admin");
  const [newsletters, count] = await Promise.all([
    newsletterService.getNewsletters(),
    newsletterService.getActiveCount(),
  ]);

  return <NewsletterList initialData={newsletters} subscriberCount={count} />;
}
