<<<<<<< HEAD
# ProjectPilot AI — Backend API

Backend REST service for **ProjectPilot AI**, built with **Express.js (Node.js)**, **Supabase PostgreSQL**, and a **Layered MVC Architecture** (Model-Schema-Service-Controller-Routes).

---

## 🏗️ Architecture Overview

The backend is structured into modular layers following clean code and domain separation:

```text
ProjectPilotAI-Backend/
├── config/             # Supabase client & environment configuration
├── controllers/        # Thin HTTP request & response handlers
├── docs/               # Architecture plans & database specifications
├── migrations/         # SQL migration DDL, triggers, and RLS policies
├── models/             # Data access layer (Supabase PostgreSQL operations)
├── routes/             # Express route declarations
├── schemas/            # Input validation & response serialization
├── services/           # Business logic & cross-team authorization checks
├── tests/              # Automated unit & integration test suites
└── server.js           # Server bootstrap and middleware pipeline
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
```

### 3. Run Database Migrations
Execute the SQL files in `migrations/` inside your Supabase SQL Editor:
* `migrations/001_create_reports_table.sql`
* `migrations/002_create_sprints_and_tickets_tables.sql`
* `migrations/003_create_notifications_table.sql`

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production start
npm start
```

---

## 🧪 Running Tests

Execute the automated test suite powered by the native Node.js test runner:
```bash
npm test
```

---

## 📚 Documentation

Detailed specifications and architectural guides are available in the [`docs/`](./docs) directory:
* **[Backend Architecture Plan](./docs/PROJECTPILOT_BACKEND_ARCHITECTURE_PLAN.txt)** (or [`BACKEND_ARCHITECTURE_PLAN.md`](./BACKEND_ARCHITECTURE_PLAN.md))
* **[Supabase Database Guide](./docs/ProjectPilot_AI_Supabase_Database_Guide.pdf)**
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> 3fc8cf54aee7ee738fe78e818024411248d4c59c
