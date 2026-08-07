# 🚀 Apply Away – AI-Powered Opportunity Vault

> **Apply Away** is an intelligent, full-stack personal opportunity vault that empowers professionals, researchers, and students to effortlessly capture, organize, track, and analyze fellowships, scholarships, grants, internships, and career opportunities in one secure dashboard.

---

## 📌 Executive Summary (For Product & Business Readers)

### ❓ The Problem
High-achieving applicants often discover opportunities scattered across WhatsApp messages, LinkedIn posts, email newsletters, and web links. Managing deadlines, application requirements, essay prompts, and progress across spreadsheets leads to missed deadlines, lost information, and administrative overwhelm.

### 💡 The Solution
**Apply Away** acts as a centralized "second brain" for your career and academic applications:
- **Instant AI Extraction**: Simply paste a web link or text message—our AI automatically extracts the title, host organization, application deadlines, requirements, benefits, and essay prompts into your vault.
- **Duplicate Prevention**: Warns you if you try to add an opportunity you are already tracking.
- **Smart Deadline Calendar & Reminders**: Visualizes upcoming deadlines on an interactive calendar and dispatches timely email alerts in your local timezone (`Africa/Lagos`, `America/New_York`, etc.) so you never miss a submission window.
- **Essay & Preparation Tracker**: Provides dedicated drafting space for every essay prompt, interactive document checklists (Resume, Transcripts, Recommendations), and personal vault notes.
- **Reflection & Growth Dashboard**: Visualizes your application progress over time with charts, track acceptance rates, and log monthly reflection notes.

---

## ✨ Product Capabilities & User Flows

```mermaid
graph TD
    A[Raw Link or Copied Text] -->|Paste into AI Capture| B(AI Extraction Service)
    B -->|Zod Structured Parsing| C{Duplicate Check}
    C -->|New Record| D[(Personal Opportunity Vault)]
    C -->|Candidate Match| E[Duplicate Warning & Update Dialog]
    D --> F[Interactive Dashboard & Filters]
    D --> G[FullCalendar Deadline View]
    D --> H[Essay Prompts & Checklist Manager]
    D --> I[Reflection Analytics & Charts]
    D --> J[Automated Timezone Email Reminders]
```

### 1. AI Quick Capture & Text Parsing
- **Web Link Extraction**: Paste an official URL—Apply Away fetches the page and extracts program details automatically.
- **Social & Chat Message Parsing**: Paste raw text from WhatsApp groups, LinkedIn posts, or email newsletters.
- **Structured Data Generation**: AI converts unstructured text into standardized opportunity records (Category, Host, Benefits, Deadlines, Prompts).

### 2. Centralized Vault & Smart Filters
- **Filter & Search**: Search by title or organization, and filter by Category (*Fellowship, Scholarship, Internship, Job, Grant, Competition*), Status (*Not Started, In Progress, Submitted, Interview, Accepted, Rejected*), or Priority (*High, Medium, Low*).
- **Responsive Layout**: Desktop data table view and mobile-friendly card grid layout.

### 3. Preparation Workspace & Essay Manager
- **Essay Prompt Space**: Work on specific essay responses right next to the application details.
- **Interactive Document Checklist**: Check off items like *Resume/CV, Academic Transcripts, Passport, Recommendation Letters, Portfolio, Final Review*.
- **Audit Timeline**: View a timeline of all updates made to each opportunity.

### 4. Application Analytics & Reflection Journal
- **Visual Charts**: Application velocity over time, category distribution, and status conversion pipeline.
- **Monthly Reflection Notes**: Write monthly journal entries to document wins, lessons learned, and strategy adjustments.

---

## 🛠️ Technical Architecture Specification (For Engineers)

### Technology Stack Overview

| Domain | Technology Chosen | Purpose & Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | Full-stack React framework utilizing Server Components for fast initial loads and Server Actions for mutation safety. |
| **Language** | **TypeScript 5 (Strict)** | End-to-end type safety spanning domain entities, DB models, AI schemas, and UI components. |
| **Database** | **PostgreSQL & Prisma v6** | ACID-compliant relational storage using Prisma ORM with native text arrays (`String[]`) for eligibility/benefits lists. |
| **Authentication**| **Auth.js v5 (`next-auth`)** | Google OAuth & Credentials auth with custom JWT session callbacks and multi-tenant DB isolation (`userId` FK). |
| **Edge Security** | **Lightweight Middleware** | Zero-dependency cookie inspection (`<5KB`) ensuring Edge Function compliance under Vercel's 1MB limit. |
| **AI Integration**| **OpenAI API (`gpt-4o-mini`)** | Structured Output parsing via strict JSON schema enforcement to ensure predictable JSON payloads. |
| **Calendar** | **FullCalendar v6** | Interactive month day-grid calendar widget customized with dark-mode glassmorphic design tokens. |
| **Analytics** | **Recharts** | Composable, responsive SVG chart library for data visualizations. |
| **Notifications** | **Sonner** | Non-blocking toast notification provider for real-time action feedback. |
| **Scheduling** | **`node-cron` & Nodemailer** | Background cron scanner with `date-fns-tz` timezone conversion and exponential backoff retries (`retryWithBackoff`). |

---

## 📐 Architectural Design Decisions

1. **Multi-Tenant SaaS Data Isolation**:
   - Every single database model (`Opportunity`, `EssayQuestion`, `ActivityLog`, `ReminderLog`, `MonthlyReflection`) references `userId` via foreign key constraints with `onDelete: Cascade`.
   - Repositories and Server Actions strictly pull `userId` from verified `await auth()` session context.

2. **Vercel Edge Function Optimization**:
   - Resolved Edge Function bundle size bloat by removing heavy Prisma dependencies from `middleware.ts`.
   - `middleware.ts` reads session tokens directly from HTTP cookies, reducing Edge bundle size from **1.09 MB** to **< 5 KB**.

3. **Idempotent Email Reminders with Exponential Backoff**:
   - Evaluates active deadlines across 5 milestone windows (`14_DAYS`, `7_DAYS`, `3_DAYS`, `24_HOURS`, `12_HOURS`).
   - Queries `reminder_logs` before dispatch to prevent duplicate email alerts.
   - Converts UTC deadlines into the user's timezone (`user.timezone`) before formatting alerts.
   - Retries failed SMTP sends up to 3 times using exponential backoff.

---

## 📁 Repository Directory Structure

```
apply-away/
├── prisma/
│   └── schema.prisma            # Multi-tenant PostgreSQL models & composite indexes
├── src/
│   ├── app/
│   │   ├── (auth)/login/        # Login page with Google OAuth & Credentials
│   │   ├── (dashboard)/         # Authenticated route group
│   │   │   ├── dashboard/       # Main Vault Dashboard & Data Table
│   │   │   ├── opportunities/   # Dynamic Detail Page [id]
│   │   │   ├── calendar/        # FullCalendar Deadline View
│   │   │   ├── reflection/      # Analytics & Journal Dashboard
│   │   │   └── profile/         # Timezone & User Profile Settings
│   │   ├── actions/             # Server Actions (Opportunity, AI, Detail, Reflection)
│   │   ├── api/                 # API Controllers ([...nextauth], Cron triggers)
│   │   ├── globals.css          # Glassmorphic CSS design system tokens
│   │   └── layout.tsx           # Root layout mounting Sonner Toaster provider
│   ├── components/
│   │   ├── modules/             # Feature components (Dashboard, Capture, Details, Calendar, Reflection)
│   │   └── ui/                  # Atomic UI primitives (Badge, Skeleton, Toaster)
│   ├── domain/                  # Strongly typed domain entities & Zod schemas
│   ├── repositories/            # Repository contracts & PrismaOpportunityRepository
│   ├── services/                # Dedicated AI, Duplicate Detector, Email, and Reminder Services
│   └── lib/                     # Prisma singleton, Auth.js config, Retry & Timezone helpers
├── middleware.ts                # Ultra-lightweight Edge Route Protection Middleware (<5KB)
└── README.md
```

---

## 💻 Quick Start & Setup Guide

### 1. Prerequisites
- **Node.js 18+**
- **PostgreSQL Database**

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/Starr365/Apply-Away.git
cd apply-away

# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root folder:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/apply_away?schema=public"

# Auth.js Secrets
AUTH_SECRET="your-super-secret-32-character-key"
AUTH_URL="http://localhost:3000"

# OpenAI API Key (For AI Extraction)
OPENAI_API_KEY="sk-proj-your-openai-api-key"

# Optional SMTP Settings (Falls back to mock console logs if empty)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM='"Apply Away" <reminders@applyaway.app>'

# Optional Cron Secret for Vercel Cron
CRON_SECRET="your-cron-secret-token"
```

### 4. Database Setup & Migrations

```bash
# Push Prisma schema to PostgreSQL
npx prisma db push
```

### 5. Launch Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Quality Verification

```bash
# Run ESLint checks
npm run lint

# Compile production build
npm run build
```

---

