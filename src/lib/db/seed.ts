
import "dotenv/config";
import { db } from "./index";
import { user, session, account, verification } from "./schema";
import { auth } from "../auth";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🚀 Starting database reset and seed...");

  try {
    // 1. Clear existing auth data
    console.log("🧹 Clearing auth tables...");
    await db.delete(session);
    await db.delete(account);
    await db.delete(verification);
    await db.delete(user);
    console.log("✅ Auth tables cleared.");

    // 2. Create Admin User using Better Auth API (handles password hashing)
    console.log("👤 Creating admin user...");
    const adminEmail = "admin@example.com";
    const adminPassword = "Admin123!";
    
    // We use the internal API to sign up the user
    // Note: This expects BETTER_AUTH_URL and BETTER_AUTH_SECRET to be set in .env
    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "System Admin",
      },
    });

    if (!result || !result.user) {
        throw new Error("Failed to create admin user via Better Auth API");
    }

    console.log("✅ Admin user created in 'user' and 'account' tables.");

    // 3. Upgrade to Admin Role
    console.log("👑 Upgrading user to 'admin' role...");
    await db.update(user)
      .set({ role: "admin" })
      .where(eq(user.email, adminEmail));
    
    console.log("✅ User upgraded to 'admin' role.");
    console.log("🎉 Seeding completed successfully!");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
