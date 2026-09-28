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