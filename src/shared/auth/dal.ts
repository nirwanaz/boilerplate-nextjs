import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { transformUserToProfile } from "@/shared/auth/rbac";
import type { UserSession, Profile, Role } from "@/shared/types";

/**
 * Data Access Layer: get the current authenticated user session.
 * Returns null if not authenticated.
 */
export async function getSession(): Promise<UserSession | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || null,
    },
    profile: transformUserToProfile(session.user),
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
 * Note: Role-based logic should be integrated with Better Auth's custom properties or plugins.
 */
export async function requireAuthWithRole(
  roles: Role | Role[]
): Promise<{ session: UserSession; profile: Profile }> {
  const session = await requireAuth();
  
  const userRoles = Array.isArray(roles) ? roles : [roles];
  const userRole = session.profile.role;

  if (!userRoles.includes(userRole)) {
    redirect("/unauthorized");
  }

  return {
    session,
    profile: session.profile,
  };
}
