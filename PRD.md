# Product Requirements Document (PRD)

# Apply Away – Opportunity Vault

**Version**: 1.0 (MVP)  
**Status**: Draft  

---

## 1. Product Overview

### Product Name
**Apply Away – Opportunity Vault**

### Tagline
*Your AI-powered personal opportunity vault.*

### Purpose
Apply Away is a personal AI-powered opportunity management system designed to help users collect, organize, track, and manage opportunities from different sources in one centralized dashboard.

Instead of manually keeping track of deadlines across WhatsApp, LinkedIn, Telegram, emails, and websites, the application extracts key information automatically, stores it in a structured format, and sends reminders before important deadlines.

The MVP is designed for **personal use only** and will later evolve into a multi-user SaaS platform.

---

## 2. Problem Statement

Opportunities are discovered across multiple platforms, making them difficult to manage. Important deadlines are often forgotten, application requirements become scattered, and tracking progress manually is inefficient.

The goal of Apply Away is to become a single source of truth for every opportunity.

---

## 3. Goals

The MVP should allow the user to:
- Capture opportunities quickly.
- Automatically extract important information using AI.
- Organize opportunities in one dashboard.
- Track application progress.
- View deadlines in a calendar.
- Receive timely reminders before deadlines.
- View simple analytics about saved opportunities.

---

## 4. Target User

- **Single User (Developer / Personal Use)**
- This version is built specifically for personal use. Authentication, accounts, and multi-user support are intentionally excluded for the initial MVP scope, though multi-tenant structure is prepared for future SaaS expansion.

---

## 5. Out of Scope (MVP)

The following features are intentionally excluded from the initial release:
- User authentication (optional / future expansion)
- Multi-user support
- Team collaboration
- Browser extension
- Mobile app
- AI essay writing
- Resume generation
- Cover letter generation
- Email synchronization
- Opportunity recommendations
- Payments
- Public sharing

---

## 6. Functional Requirements

### Module 1 – Opportunity Capture
**Description**: The user can quickly save opportunities from multiple sources.

**Supported Inputs**:
- Website URL
- Plain text
- WhatsApp messages
- Telegram messages
- LinkedIn posts
- X (Twitter) posts
- Email content

**Workflow**:
1. User pastes a URL or text.
2. AI reads the content.
3. AI extracts relevant information.
4. Information is standardized.
5. Opportunity is saved.

---

### Module 2 – AI Information Extraction
The AI should automatically extract:

#### Basic Information
- Opportunity Name
- Organization
- Category (`Fellowship`, `Scholarship`, `Internship`, `Job`, `Grant`, `Competition`, `Research`, `Conference`, `Bootcamp`, `Training`, `Other`)
- Short Description

#### Dates
- Opening Date
- Deadline
- Interview Date (if available)
- Program Start
- Program End

*Storage*:
- Original timezone
- UTC timestamp
- Converted Nigeria time (`Africa/Lagos`)

#### Eligibility
- Eligible Countries
- Education Level
- Degree Requirements
- Experience
- Language Requirements
- Age (if applicable)

#### Application Requirements
- Resume/CV
- Transcript
- Passport
- Recommendation Letter
- Essay
- Portfolio
- GitHub
- LinkedIn

#### Benefits
- Funding
- Stipend
- Travel
- Visa
- Accommodation
- Certification

#### Links
- Official Website
- Application Link

#### Essay Questions
- If the opportunity contains essay questions, save every prompt.

---

### Module 3 – Opportunity Dashboard
Display all saved opportunities in a searchable table.

**Columns**:
- Opportunity Name
- Organization
- Category
- Deadline
- Days Remaining
- Status (`Not Started`, `In Progress`, `Submitted`, `Interview`, `Accepted`, `Rejected`)
- Priority (`High`, `Medium`, `Low`)

**Features**:
- Search
- Filter
- Sorting

---

### Module 4 – Opportunity Details
Each opportunity should have its own page containing:
- Overview
- Description
- Eligibility
- Requirements
- Benefits
- Deadlines
- Essay Questions
- Links
- Personal Notes
- Checklist

#### Activity Log
Each opportunity should automatically maintain a timeline of important actions:
- Opportunity Added
- Priority Updated
- Status Changed
- Notes Added
- Reminder Sent
- Application Submitted

---

### Module 5 – Calendar
Display all opportunity deadlines in a calendar.

**Features**:
- Monthly calendar view
- Click a date to view opportunities
- Multiple opportunities on one day
- Open opportunity details from calendar

---

### Module 6 – Reflection Dashboard
Provides a visual summary of the user's application journey, helping them reflect on consistency, progress, outcomes, and areas for improvement.

#### Monthly Summary Cards
- Opportunities Saved
- Applications Submitted
- Successful Applications (Acceptances/Wins)
- ❌ Rejected Applications

#### Monthly Activity Trend
- Line chart or grouped bar chart showing by month: Opportunities Saved vs. Applications Submitted.

#### Application Outcomes
- Bar chart comparing: Applications Submitted, Acceptances/Wins, Rejections.

#### Opportunity Breakdown
- Pie chart (or donut chart) showing distribution of saved opportunities by category.

#### Upcoming Deadlines
- Due This Week
- Due This Month
- Includes: Opportunity Name, Deadline, Days Remaining.

#### Recent Activity
- Chronological timeline of recent actions.

#### Monthly Reflection
- Dedicated section at the end of the dashboard allowing the user to write and save one reflection per month to observe personal growth over time.

---

### Module 7 – Notifications
Automatically send reminder emails before deadlines.

**Default Reminder Schedule**:
- 14 Days
- 7 Days
- 3 Days
- 24 Hours
- 12 Hours

*Timezone*: Must use stored timezone information (`Africa/Lagos`).

---

### Module 8 – Duplicate Detection
Before saving a new opportunity, compare:
- Opportunity Name
- Organization
- Official Application Link

If a duplicate is found, prompt the user to update the existing record instead of creating a new one.

---

## 7. Database Model (Normalized Summary)

- **Opportunities**: `id`, `title`, `organization`, `category`, `description`, `eligibility`, `requirements`, `benefits`, `application_url`, `official_url`, `start_date`, `deadline`, `interview_date`, `original_timezone`, `deadline_utc`, `deadline_local`, `status`, `priority`, `notes`, `created_at`, `updated_at`
- **Essay Questions**: `id`, `opportunity_id`, `question`, `word_limit`, `draft_response`, `created_at`
- **Activity Logs**: `id`, `opportunity_id`, `action`, `description`, `created_at`
- **Reminder Logs**: `id`, `opportunity_id`, `reminder_type`, `sent_at`
- **Monthly Reflections**: `id`, `user_id`, `month_year`, `content`, `created_at`, `updated_at`

---

## 8. Tech Stack

- **Frontend**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Server Components, Server Actions & Route Handlers, TypeScript
- **Database**: PostgreSQL (Neon / Local), Prisma ORM
- **AI**: OpenAI API (Structured JSON Extraction)
- **Email**: Resend
- **Scheduler**: node-cron
- **Calendar**: FullCalendar
- **Analytics**: Recharts

---

## 9. MVP Success Criteria

The MVP is successful if the user can:
1. Paste a URL or copied opportunity text.
2. Have AI automatically extract and save structured information.
3. View and manage opportunities from a dashboard table.
4. Open a detailed page for each opportunity.
5. Track changes through an activity log.
6. View deadlines in a calendar.
7. Receive timezone-aware email reminders.
8. See a simple analytics overview of saved opportunities.
9. Search, filter, sort, and update opportunities.
