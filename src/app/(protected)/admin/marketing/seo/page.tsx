import { requireAuthWithRole } from "@/shared/auth/dal";
import { marketingService } from "@/domains/marketing/services/marketing.service";
import SeoList from "@/domains/marketing/components/seo-list";

export default async function SeoPage() {
  await requireAuthWithRole("admin");
  const seo = await marketingService.getSeoSettings();

  return <SeoList initialData={seo} />;
}
