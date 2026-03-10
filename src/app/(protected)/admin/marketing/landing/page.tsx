import { requireAuthWithRole } from "@/shared/auth/dal";
import { marketingService } from "@/domains/marketing/services/marketing.service";
import LandingEditor from "@/domains/marketing/components/landing-editor";

export default async function LandingContentPage() {
  await requireAuthWithRole("admin");
  const content = await marketingService.getLandingContent();

  return (
    <LandingEditor
      initialContent={content.map((c) => ({
        section: c.section,
        key: c.key,
        value: c.value,
      }))}
    />
  );
}
