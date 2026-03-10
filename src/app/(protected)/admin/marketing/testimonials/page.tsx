import { requireAuthWithRole } from "@/shared/auth/dal";
import { marketingService } from "@/domains/marketing/services/marketing.service";
import TestimonialList from "@/domains/marketing/components/testimonial-list";

export default async function TestimonialsPage() {
  await requireAuthWithRole("admin");
  const testimonials = await marketingService.getTestimonials();

  return <TestimonialList initialData={testimonials} />;
}
