import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Initializing clean database setup...");

  // Create default initial user account (no fake/mock opportunities)
  await prisma.user.upsert({
    where: { email: "user@applyaway.app" },
    update: {},
    create: {
      email: "user@applyaway.app",
      name: "Apply Away User",
      timezone: "Africa/Lagos",
    },
  });

  // Create test user with plaintext password (for development only)
  const testUser = await prisma.user.upsert({
    where: { email: "test@applyaway.app" },
    update: {},
    create: {
      email: "test@applyaway.app",
      name: "Apply Away Tester",
      passwordPlain: "SeedPass123!",
      timezone: "Africa/Lagos",
    },
  });

  console.log("✅ Database schema initialized with empty opportunity vault.");
  console.log(`✅ Seeded test user: ${testUser.email} (password: SeedPass123!)`);
}

main()
  .catch((e) => {
    console.error("❌ Error during database initialization:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
