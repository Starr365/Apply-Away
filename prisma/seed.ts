import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with initial default user and sample opportunities...");

  // Create default test user
  const user = await prisma.user.upsert({
    where: { email: "developer@applyaway.app" },
    update: {},
    create: {
      email: "developer@applyaway.app",
      name: "Lead Engineer",
      timezone: "Africa/Lagos",
    },
  });

  console.log(`👤 Default User created with ID: ${user.id}`);

  // Seed sample opportunity 1: Fellowship
  const opp1 = await prisma.opportunity.create({
    data: {
      userId: user.id,
      title: "Mandela Washington Fellowship for Young African Leaders 2027",
      organization: "U.S. Department of State",
      category: "FELLOWSHIP",
      shortDescription:
        "The flagship program of the Young African Leaders Initiative (YALI) bringing young leaders to the United States for academic coursework and leadership training.",
      fullDescription:
        "The Mandela Washington Fellowship for Young African Leaders is the flagship program of YALI. Empowering young leaders through academic coursework, leadership training, and networking.",
      eligibility: [
        "Between 25 and 35 years old",
        "Citizen and resident of a Sub-Saharan African country",
        "Proficient in reading, writing, and speaking English",
      ],
      requirements: ["Resume/CV", "Passport / National ID", "2 Essay Responses"],
      benefits: ["Full Funding", "Travel & Visa Expenses", "Housing & Stipend"],
      officialUrl: "https://www.mandelawashingtonfellowship.org",
      applicationUrl: "https://yali.state.gov/apply",
      deadline: new Date("2026-09-15T23:59:59Z"),
      originalTimezone: "Africa/Lagos",
      status: "IN_PROGRESS",
      priority: "HIGH",
      essayQuestions: {
        create: [
          {
            userId: user.id,
            question: "Describe a leadership project you led in your community and its long-term impact.",
            wordLimit: 500,
            draftResponse: "In 2025, I organized a tech workshop empowering 120 students in Lagos...",
          },
        ],
      },
    },
  });

  console.log(`✅ Sample Opportunity 1 created: ${opp1.title}`);

  // Seed sample opportunity 2: Tech Grant
  const opp2 = await prisma.opportunity.create({
    data: {
      userId: user.id,
      title: "Google for Startups Accelerator Africa Grant 2026",
      organization: "Google",
      category: "GRANT",
      shortDescription:
        "A three-month accelerator program for Seed to Series A technology startups in Africa.",
      eligibility: ["African-based technology startup", "Equity-free funding up to $100,000"],
      requirements: ["Pitch Deck", "Financial Model", "Demo Video"],
      officialUrl: "https://startup.google.com/accelerator/africa",
      deadline: new Date("2026-10-01T23:59:59Z"),
      status: "NOT_STARTED",
      priority: "MEDIUM",
    },
  });

  console.log(`✅ Sample Opportunity 2 created: ${opp2.title}`);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
