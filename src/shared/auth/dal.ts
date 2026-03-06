import { createClient } from "@/shared/lib/supabase/server";
import { getUserProfile, requireRole } from "@/shared/auth/rbac";
import type { Role, Profile, UserSession } from "@/shared/types";
import { redirect } from "next/navigation";

/**
 * Data Access Layer: get the current authenticated user session.
 * Returns null if not authenticated.
 */
export async function getSession(): Promise<UserSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await getUserProfile(supabase);
  if (!profile) return null;

  return {
    user: {
      id: user.id,
      email: user.email!,
    },
    profile,
  };
}

/**
 * DAL: require authentication. Redirects to /login if not authenticated.
 */
export async function requireAuth(): Promise<UserSession> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

/**
 * DAL: require specific role(s). Redirects to /unauthorized or /login.
 */
export async function requireAuthWithRole(
  roles: Role | Role[]
): Promise<{ session: UserSession; profile: Profile }> {
  const supabase = await createClient();
  const profile = await requireRole(supabase, roles);

  return {
    session: {
      user: { id: profile.id, email: profile.email },
      profile,
    },
    profile,
  };
}
