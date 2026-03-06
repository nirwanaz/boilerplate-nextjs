import { SupabaseClient } from "@supabase/supabase-js";
import type { Role, Profile } from "@/shared/types";

const ROLE_HIERARCHY: Record<Role, number> = {
  user: 0,
  manager: 1,
  admin: 2,
};

/**
 * Check if a user's role meets the required role(s).
 * Uses role hierarchy: admin > manager > user
 */
export function hasPermission(
  userRole: Role,
  requiredRoles: Role | Role[]
): boolean {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.some(
    (required) => ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[required]
  );
}

/**
 * Fetch the current user's profile from the database.
 */
export async function getUserProfile(
  supabase: SupabaseClient
): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

/**
 * Server-side guard: throws if the user doesn't have the required role.
 */
export async function requireRole(
  supabase: SupabaseClient,
  requiredRoles: Role | Role[]
): Promise<Profile> {
  const profile = await getUserProfile(supabase);

  if (!profile) {
    throw new Error("Unauthorized: not authenticated");
  }

  if (!hasPermission(profile.role, requiredRoles)) {
    throw new Error(
      `Forbidden: requires role ${Array.isArray(requiredRoles) ? requiredRoles.join(" or ") : requiredRoles}`
    );
  }

  return profile;
}
