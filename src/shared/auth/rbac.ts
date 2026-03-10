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
 * Fetch a profile-like object from a session user.
 */
export function transformUserToProfile(user: {
  id: string;
  email: string;
  name?: string | null;
  role?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}): Profile {
  return {
    id: user.id,
    email: user.email,
    fullName: user.name || null,
    role: (user.role as Role) || "user",
    createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
  };
}
