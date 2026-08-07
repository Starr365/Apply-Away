# 🚀 Apply Away – AI-Powered Opportunity Vault

**Apply Away** is a state-of-the-art, full-stack personal opportunity vault designed to help professionals, researchers, and students collect, organize, track, and manage career opportunities, fellowships, scholarships, grants, and internships in one centralized dashboard.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, **OpenAI Structured Outputs**, **FullCalendar**, and **Recharts**.

---

## ✨ Key Features & Capabilities

### 🤖 1. AI Quick Capture & Extraction
- **Website URL Scraping**: Automatically scrapes application web pages and extracts structured opportunity data.
- **Raw Text & Message Parsing**: Paste WhatsApp messages, LinkedIn posts, Telegram alerts, or emails directly into the capture modal.
- **OpenAI Structured Outputs**: Uses `gpt-4o-mini` with strict Zod schema validation to extract title, organization, category, short/full description, eligibility criteria, application requirements, financial benefits, URLs, deadlines, and essay question prompts.

### 🔍 2. Duplicate Detection Engine
- Scans user vault records before saving to prevent duplicate entries based on title, host organization, or official application portal link.
- Displays candidate duplicate warning alerts with one-click resolution.

### 📊 3. Opportunity Vault Management
- **Multi-Tenant SaaS Security**: Every record is isolated per authenticated user account with Prisma `onDelete: Cascade` rules.
- **Real-Time Search & Filtering**: Instant search across opportunity titles, host organizations, descriptions, category filters, status filters, and priority levels.
- **URL-Synchronized Query State**: Bookmarkable and shareable search/filter queries.
- **Responsive Layout**: Desktop sortable data table and touch-optimized mobile card grid view.
- **Pagination Controls**: Server-side pagination for smooth performance.

### 📑 4. Detailed Opportunity Breakdown & Essay Editor
- **5 Sectioned Interactive Tabs**:
  - **Overview**: Program details, Eligibility, Requirements, and Financial Benefits.
  - **Essay Prompts & Drafts**: Dedicated response editor for each essay prompt with word limit badges and instant draft saving.
  - **Interactive Preparation Checklist**: Interactive task checklist (Resume/CV, Transcripts, Passport, Recommendation Letters, Portfolio, Final Review, Application Submission).
  - **Personal Vault Notes**: Private application notes editor.
  - **Activity Audit Log**: Chronological audit trail of all historical updates (`OPPORTUNITY_CREATED`, `STATUS_CHANGED`, `PRIORITY_UPDATED`, `ESSAY_DRAFT_UPDATED`, `NOTES_UPDATED`).

### 📅 5. FullCalendar Deadline Overview
- **FullCalendar Integration**: Interactive month day-grid calendar visualizing all upcoming application deadlines.
- **Color-Coded Priority Events**: Distinct color themes for High Priority/Due Soon (Rose), Medium Priority (Amber), Submitted/Accepted (Emerald), and Standard Opportunities (Purple).
- **Responsive Event Popover**: Click any calendar event for a quick-view modal with direct access to full details.

### 📈 6. Reflection & Analytics Dashboard
- **Responsive Recharts Visualizations**:
  - **Application Velocity**: Area chart tracking monthly opportunity creation vs. submissions over time.
  - **Category Breakdown**: Donut chart illustrating application distribution across fellowships, scholarships, grants, and jobs.
  - **Status Conversion Funnel**: Bar chart analyzing application pipeline stage progression.
- **Monthly Reflection Journal**: Month selector (`2026-08`, `2026-07`, etc.) for saving monthly career progress, win logs, and growth notes.
- **Recent Audit Feed**: Real-time activity audit timeline.

### ⏰ 7. Automated Email Reminder System
- **Milestone Notification Windows**: Automatically dispatches alerts for `14_DAYS`, `7_DAYS`, `3_DAYS`, `24_HOURS`, and `12_HOURS` remaining.
- **Timezone Conversion Engine**: Formats dates according to each user's configured local timezone (`Africa/Lagos`, `America/New_York`, etc.).
- **Idempotency Log Tracking**: Ensures zero duplicate emails using `reminder_logs` database verification.
- **Exponential Backoff Retry Strategy**: Retries failed email dispatches up to 3 times.
- **Dual Scheduler Architecture**: `node-cron` persistent background runner + Vercel API Cron route (`/api/cron/reminders`).

---

## 🛠️ Technology Stack

| Layer | Technology Used |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack, React Server Components, Server Actions) |
| **Language** | TypeScript (Strict Mode) |
| **Database & ORM** | PostgreSQL & Prisma ORM v6 |
| **Authentication** | Auth.js v5 (`next-auth@beta`, `@auth/prisma-adapter`) |
| **AI Extraction** | OpenAI API (`gpt-4o-mini` with Zod Structured Outputs) |
| **Styling & UI** | Tailwind CSS v4 & Glassmorphism CSS Design Tokens |
| **Calendar Widget** | FullCalendar (`@fullcalendar/react`, `@fullcalendar/daygrid`, `@fullcalendar/interaction`) |
| **Data Analytics** | Recharts (`recharts`) |
| **Toast Notifications**| Sonner (`sonner`) |
| **Email & Scheduling**| Nodemailer, `node-cron`, `date-fns-tz` |

---

## 📁 Clean Architecture & Folder Structure

```
apply-away/
├── prisma/
│   ├── schema.prisma            # Multi-tenant PostgreSQL relational schema & indexes
│   └── seed.ts                  # Database seed script
├── src/
│   ├── app/
│   │   ├── (auth)/              # Authentication route group (Login Page)
│   │   ├── (dashboard)/         # Authenticated Dashboard route group
│   │   │   ├── dashboard/       # Main Vault Dashboard & Data Table
│   │   │   ├── opportunities/   # Dynamic Opportunity Detail Page [id]
│   │   │   ├── calendar/        # FullCalendar Deadline View
│   │   │   ├── reflection/      # Analytics & Monthly Journal Dashboard
│   │   │   └── profile/         # User Timezone Profile Settings
│   │   ├── actions/             # Server Actions (Opportunity, AI, Detail, Reflection)
│   │   ├── api/                 # API Routes (Auth.js [...nextauth], Cron reminders)
│   │   ├── globals.css          # Glassmorphism & FullCalendar design system tokens
│   │   └── layout.tsx           # Root Layout with Sonner Toaster Provider
│   ├── components/
│   │   ├── modules/             # Feature module components (Dashboard, Capture, Details, Calendar, Reflection)
│   │   ├── ui/                  # Atomic UI primitives (Badge, Skeleton, Toaster)
│   │   └── providers/           # Session Provider
│   ├── domain/                  # Strongly typed domain entities & Zod validation schemas
│   ├── repositories/            # Repository contracts & PrismaOpportunityRepository
│   ├── services/                # Dedicated services (AI Extraction, Duplicate Detector, Email, Reminder Scheduler)
│   └── lib/                     # Singleton Prisma Client, Auth.js config, Retry & Timezone helpers
├── middleware.ts                # Ultra-lightweight Edge Route Protection Middleware (<5KB)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 18+** installed and access to a **PostgreSQL** database.

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Starr365/Apply-Away.git
cd apply-away
npm install
```

### 2. Environment Variables Setup

Create a `.env` file in the root directory:

```env
# PostgreSQL Database Connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/apply_away?schema=public"

# Auth.js Authentication Secrets
AUTH_SECRET="your-super-secret-auth-key-generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# Google OAuth Credentials (Optional)
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# OpenAI API Key (For AI Opportunity Extraction)
OPENAI_API_KEY="sk-proj-your-openai-api-key"

# SMTP Email Credentials (Optional - Mock mode active if unconfigured)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM='"Apply Away" <reminders@applyaway.app>'

# Cron Secret for Vercel Cron
CRON_SECRET="your-cron-secret-token"
```

### 3. Run Prisma Migrations

```bash
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Build

To run code quality checks and compile the production build:

```bash
npm run lint
npm run build
```

---

## 📄 License

This project is open-source under the **MIT License**.
