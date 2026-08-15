# Apply Away – Your Personal Opportunity Vault

**Apply Away** is an intelligent, full-stack personal opportunity vault built on Next.js 16 (App Router) and Prisma ORM. It acts as an application tracker that helps users capture, organize, schedule, and reflect on career fellowships, grants, internships, and scholarships.

---

## 1. Core Product Capabilities & Functional Flows

### A. Intelligent AI Quick Capture
- **URL Scraper**: Fetches and strips HTML content directly from target websites, extracting metadata with minimal network overhead.
- **Unstructured Message Parser**: Converts copy-pasted social updates (WhatsApp, LinkedIn, Email newsletters) into structured relational datasets.
- **Duplicate Prevention Engine**: Employs query-matching logic comparing organization names and titles during AI extraction, preventing vault clutter.

### B. Multi-Tenant Vault Dashboard
- **Preparation Workspace**: Features writing prompts and document checklists (Resume/CV, Recommendation letters, Transcripts, Portfolios).
- **Milestone Calendar View**: Interactive monthly view of deadlines powered by FullCalendar.
- **Dashboard Personal Notes**: Displays user-created notes underneath opportunity descriptions and table columns directly inside the dashboard viewport.

---

## 2. Architectural Design Specifications

```mermaid
graph TD
    User([SaaS Client]) -->|Session Request| EdgeProxy[proxy.ts Edge Middleware]
    EdgeProxy -->|Validation: Cookie Inspection| AuthJS[Auth.js Session Context]
    AuthJS -->|Database Multi-Tenant Isolation| PostgreSQL[(PostgreSQL Database)]
    PostgreSQL -->|Repository Pattern| Prisma[Prisma ORM Client]
    Prisma -->|PrismaOpportunityRepository| AppActions[Next.js Server Actions]
```

### A. Strict SaaS Multi-Tenant Isolation
Every schema model (`Opportunity`, `EssayQuestion`, `ActivityLog`, `ReminderLog`, `MonthlyReflection`) references `userId` via foreign key constraints with `onDelete: Cascade`. Database queries are mediated by repositories checking authenticated user sessions (`await auth()`).

### B. Vercel Edge proxy.ts Middleware
Protects route groups at the Vercel Edge layer. Checks session tokens directly from HTTP cookies instead of loading Prisma databases, keeping compiled Edge bundles under **5 KB**.

### C. Timezone-Aware Cron Scheduler
- **Milestone Evaluation**: Checks upcoming deadlines at 5 milestones: `14_DAYS`, `7_DAYS`, `3_DAYS`, `1_DAY`, and `DUE_TODAY`.
- **Hourly Dispatch Loop**: GitHub Actions triggers an hourly scheduler endpoint. The server calculates local times and sends daily briefs at exactly 7:00 AM local time.
- **Atomic Locking & Deduplication**: Database writes log transactions (`prisma.$transaction`) to update `lastDigestDate` and record sent alerts inside the `ReminderLog` table, preventing duplicate dispatches.

---

## 📂 3. Directory Audits

- **`prisma/schema.prisma`**: Database schemas, multi-tenant FK bindings, and composite indexes.
- **`src/app/actions/`**: Next.js Server Actions handling opportunity CRUD modifications, AI parsing calls, reflection logs, and profile updates.
- **`src/app/api/`**: Next.js HTTP controllers handling auth routing and Cron scheduler triggers.
- **`src/app/(dashboard)/`**: Protected route views staging calendar pages, dashboard tables, profiles, and analytics.
- **`src/services/`**: Integration services handling Gemini JSON parsing (`gemini-3.6-flash`), Resend/SMTP email triggers, duplicate checks, and scheduling loops.
- **`src/lib/`**: Singletons (`Prisma`, `Auth.js`) and date helpers.

---

## 🛠️ 4. Quick Start & Environment Configuration

Create a `.env.local` file in the root folder:

```env
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/apply_away?schema=public"

# Auth.js Secrets
NEXTAUTH_SECRET="your-super-secret-key-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini API
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash"

# Resend Email API Key
RESEND_API_KEY="re_your-resend-api-key"
EMAIL_FROM="Apply Away <notifications@yourverifieddomain.me>"

# Default Timezone
DEFAULT_TIMEZONE="Africa/Lagos"

# Application Environment
NODE_ENV="development"
```

Push database schemas and start the development server:
```bash
npm install
npx prisma db push
npm run dev
```
