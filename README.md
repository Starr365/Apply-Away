# Apply Away – Your Intelligent Opportunity Vault

**Apply Away** is an intelligent, full-stack personal opportunity vault designed for professionals, researchers, and students to centralize, track, and prepare career and academic applications. The platform acts as a secure "second brain," enabling users to instantly extract opportunities from across the web, monitor deadlines in their local timezones, draft essays, track required documents, and reflect on their application progress.

---

## 🏛️ System Architecture

```mermaid
graph TD
    User([SaaS Client]) -->|1. Auth Requests| Proxy[proxy.ts Edge Middleware]
    Proxy -->|2. Cookie Validation| Session[Auth.js Session Context]
    Session -->|3. Invoke Actions| ServerActions[Next.js Server Actions]
    ServerActions -->|4. Query Wrapper| Repositories[PrismaOpportunityRepository]
    Repositories -->|5. Read/Write Transaction| PostgreSQL[(PostgreSQL Database)]
    ServerActions -->|6. JSON Schema Extraction| Gemini[Google Gemini API]
    ServerActions -->|7. Email Notifications| Resend[Resend API / SMTP]
```

---

## ✨ Core Product Capabilities

- **AI Quick Capture**: Scrapes web links and parses unstructured text messages (e.g. copied from WhatsApp or LinkedIn) to automatically extract titles, hosts, requirements, benefits, and essay prompts into structured vault records.
- **Duplicate Prevention Warning**: Compares host organization details and opportunity names during parsing, alerting you to potential duplicates before they get saved.
- **Milestone Deadline Calendar**: Visualizes upcoming deadlines on an interactive month calendar widget styled with responsive glassmorphic interfaces.
- **Dashboard Personal Notes**: Renders user-written personal notes directly under opportunity cards and table columns on the main dashboard layout for immediate context.
- **TimeZone-Aware Daily Digests**: Processes local dates and schedules consolidated morning briefings to deliver exactly at 7:00 AM in each user's respective timezone (e.g. `Africa/Lagos`, `America/New_York`).
- **Preparation Workspace & Checklists**: Hosts essay editors and interactive checklist trackers for key application documents (Resume, Transcripts, Recommendations).
- **Reflection Journal & Analytics**: Features data charts (velocity trends, category distribution, conversion pipelines) and monthly journal prompts to audit and refine application strategies.

---

## 🛠️ Technology Stack Specifications

- **Frontend & Routing**: **Next.js 16 (App Router)** with **TypeScript 5 (Strict)** for fast initial loads, component reuse, and strict type safety.
- **Database & Data Access**: **PostgreSQL** coupled with **Prisma v6 ORM**, utilizing database indices on composite keys to ensure high-performance queries.
- **Authentication**: **Auth.js v5 (`next-auth`)** managing secure credential logins and Google OAuth redirects with multi-tenant database isolation.
- **AI Processing**: **Google Gemini API (`gemini-3.6-flash`)** using structured JSON schemas to constrain decoding models.
- **Notifications**: **Resend API** and **Nodemailer (SMTP)** with exponential backoff handling to prevent delivery failure rate limits.

---

## 🏛️ Architectural & Technical Decisions

### 1. Prisma Client Singleton Pattern
During local Next.js development, hot reloading frequently instantiates new Prisma Client connections on every code change, rapidly leading to database connection pool starvation. To prevent this, we instantiate Prisma on the global scope (`globalThis.prisma`), ensuring connection reuse across rebuild cycles.

### 2. Next.js Server Actions vs. REST API Handlers
Instead of setting up traditional REST endpoints, we implemented Next.js Server Actions for all database mutations. This architecture choice eliminates the boilerplate of dedicated route controllers, provides end-to-end type safety directly between client components and the backend, and handles session validation on server invocation.

### 3. Atomic Database Transactions (`prisma.$transaction`)
To guarantee that users do not receive duplicate email notifications in the event of worker or network failures, the timezone-based reminder service logs alerts inside the `ReminderLog` table and updates the user's `lastDigestDate` lock inside a single atomic database transaction. If any part of the query fails, the entire block rolls back.

---

## 🚀 Local Setup & Configuration Guide

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Starr365/Apply-Away.git
cd apply-away
npm install
```

### 2. Environment Configuration
Create an `.env.local` file in the root folder:
```env
# Relational Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/apply_away?schema=public"

# Auth.js Authentication Keys
NEXTAUTH_SECRET="your-super-secret-key-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini API Keys
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-3.6-flash"

# Resend Transactional Email Keys
RESEND_API_KEY="re_your-resend-api-key"
EMAIL_FROM="Apply Away <notifications@yourverifieddomain.me>"

# Timezone Defaults
DEFAULT_TIMEZONE="Africa/Lagos"

# Application Environment
NODE_ENV="development"
```

### 3. Database Push & Launch
Initialize database structures and launch the Next.js development server:
```bash
npx prisma db push
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view your vault locally.
