import { requireAuthWithRole } from "@/shared/auth/dal";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure only admins can access any route within /(protected)/admin
  await requireAuthWithRole("admin");

  return <>{children}</>;
}
