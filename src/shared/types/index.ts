export type Role = "admin" | "manager" | "user";

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  profile: Profile;
}
