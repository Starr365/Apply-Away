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

  console.log("✅ Database schema initialized with empty opportunity vault.");
}

main()
  .catch((e) => {
    console.error("❌ Error during database initialization:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
