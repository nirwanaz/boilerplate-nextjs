import { requireAuthWithRole } from "@/shared/auth/dal";
import { newsletterService } from "@/domains/newsletter/services/newsletter.service";
import SubscriberList from "@/domains/newsletter/components/subscriber-list";

export default async function SubscribersPage() {
  await requireAuthWithRole("admin");
  const subscribers = await newsletterService.getSubscribers();

  return <SubscriberList initialData={subscribers} />;
}
