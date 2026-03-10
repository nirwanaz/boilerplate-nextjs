import { requireAuthWithRole } from "@/shared/auth/dal";
import { DashboardClient } from "./dashboard-client";

export default async function AdminPage() {
  await requireAuthWithRole("admin");

  return <DashboardClient />;
}
