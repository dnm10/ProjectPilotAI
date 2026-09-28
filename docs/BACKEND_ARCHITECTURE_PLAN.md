# ProjectPilot AI — Complete Backend Architecture & Build Guide (Node.js / Express)

## 1. Executive Architecture Summary

The ProjectPilot AI backend is built with a **Layered MVC (Model-Schema-Service-Controller-Routes)** pattern on **Node.js (Express)** using **Supabase PostgreSQL**.

### Technology Stack

| Layer | Technology | Responsibility |
| :--- | :--- | :--- |
| **API Framework** | Express.js (Node.js 18+ / 20+) | HTTP REST endpoints & middleware routing |
| **Architecture** | Layered MVC + Service + Model Repositories | Clear separation of concerns & thin controllers |
| **Database** | PostgreSQL (Supabase) | Persistent relational data storage |
| **Data Access** | `@supabase/supabase-js` | Queries, mutations, and RLS policies |
| **Validation & Serialization** | Schemas (Zod / Joi / Pure JS Schemas) | Request input validation and response shaping |
| **Authentication** | Supabase Auth JWT | User sessions, login with GitHub OAuth |
| **Authorization** | Express Auth Middleware + RBAC | Team-level multi-tenancy & Lead vs Member roles |
| **Background Jobs** | BullMQ / Redis | Asynchronous ML runs, Webhook ingestion, Transcription |
| **AI / LLM Engine** | Groq SDK (`groq-sdk`), LangChain.js | Task generation, Sprint planning, Report generation |
| **Speech-to-Text** | OpenAI / Groq Whisper API | Meeting recording transcription |
| **ML & Explainable Risk** | XGBoost / ONNX Runtime + SHAP | Delay risk, Code-aware risk, Burnout detection |
| **Vector Database (RAG)** | Supabase `pgvector` / Chroma | Grounded Chatbot semantic document embeddings |
| **External Integrations** | GitHub REST / Webhooks, Jira Cloud REST | Commits, PRs, Jira sprint issues |
| **Testing** | Node.js Test Runner (`node:test`) & `node:assert` | Unit and integration test suites |

---

## 2. Layered MVC Directory & File Structure

```text
ProjectPilotAI-Backend/
├── config/
│   ├── supabase.js             # Supabase Client initialization (Service Role / Anon)
│   ├── env.js                  # Environment configuration
│   └── redis.js                # Redis / BullMQ connection
│
├── middleware/
│   ├── authMiddleware.js       # Supabase JWT decoding & req.user attachment
│   ├── requireLead.js          # RBAC guard: restricts lead-only data (Burnout)
│   ├── validateSchema.js       # Generic schema validation middleware
│   └── errorHandler.js         # Centralized 404 & JSON error handler
│
├── models/
│   ├── userModel.js            # profiles table data operations
│   ├── teamModel.js            # teams & team_members operations
│   ├── sprintModel.js          # sprints table operations
│   ├── ticketModel.js          # tickets table operations
│   ├── commitModel.js          # commits table operations
│   ├── pullRequestModel.js     # pull_requests table operations
│   ├── riskModel.js            # risk_scores table operations (shared polymorphic risk)
│   ├── meetingModel.js         # meetings & action_items operations
│   ├── workloadModel.js        # workload_snapshots operations
│   ├── simulationModel.js      # simulation_runs operations
│   ├── reportModel.js          # reports table operations
│   ├── notificationModel.js    # notifications operations
│   ├── chatModel.js            # chat_messages & document_embeddings operations
│   └── integrationModel.js     # integrations table operations (OAuth credentials)
│
├── schemas/
│   ├── authSchema.js           # Auth & profile request/response schemas
│   ├── teamSchema.js           # Team creation and member schemas
│   ├── sprintSchema.js         # Sprint validation & sanitization
│   ├── ticketSchema.js         # Ticket validation and status schemas
│   ├── riskSchema.js           # Risk scores, SHAP explanations serialization
│   ├── meetingSchema.js        # Meeting upload & action item schemas
│   ├── workloadSchema.js       # Workload snapshots and burnout schemas
│   ├── simulationSchema.js     # Simulation scenario schemas
│   ├── reportSchema.js         # Technical / Stakeholder report schemas
│   ├── notificationSchema.js   # Notification validation & filters
│   └── chatSchema.js           # RAG Chatbot queries & response schemas
│
├── services/
│   ├── authService.js          # User profile sync & session verification
│   ├── teamService.js          # Team creation, roster management, role assignments
│   ├── sprintService.js        # Sprint lifecycle & velocity calculations
│   ├── ticketService.js        # Ticket CRUD, status transitions, assignments
│   ├── githubService.js        # GitHub commits/PR ingestion & webhooks
│   ├── jiraService.js          # Jira issue synchronization
│   ├── taskGeneratorService.js # AI task generation using Groq LLM
│   ├── sprintPlannerService.js # AI Sprint capacity & story point planning
│   ├── meetingService.js       # Audio upload, Whisper transcription & summary
│   ├── actionItemService.js    # Closed-loop meeting action items verification
│   ├── riskService.js          # ML Risk scoring (Delay, Code-Aware, Burnout) & SHAP
│   ├── workloadService.js      # Workload aggregation & lead-only burnout telemetry
│   ├── simulationService.js    # Monte Carlo sprint timeline simulations (500+ runs)
│   ├── reportService.js        # Weekly technical and stakeholder reports delivery
│   ├── chatService.js          # RAG Chatbot with pgvector retrieval
│   └── notificationService.js  # Notifications dispatcher & realtime alerts
│
├── controllers/
│   ├── authController.js       # Auth endpoints
│   ├── teamController.js       # /api/team endpoints
│   ├── sprintController.js     # /api/sprints endpoints
│   ├── ticketController.js     # /api/tickets endpoints
│   ├── integrationController.js# /api/integrations (GitHub, Jira OAuth)
│   ├── webhookController.js    # /api/webhooks (GitHub webhooks)
│   ├── meetingController.js    # /api/meetings & /api/action-items
│   ├── riskController.js       # /api/risk endpoints
│   ├── workloadController.js   # /api/workload endpoints
│   ├── simulationController.js # /api/simulation endpoints
│   ├── reportController.js     # /api/reports & /reports endpoints
│   ├── chatController.js       # /api/chat endpoints
│   ├── notificationController.js # /api/notifications endpoints
│   └── dashboardController.js  # /api/dashboard summary & activity feed
│
├── routes/
│   ├── authRoutes.js
│   ├── teamRoutes.js
│   ├── sprintRoutes.js
│   ├── ticketRoutes.js
│   ├── integrationRoutes.js
│   ├── webhookRoutes.js
│   ├── meetingRoutes.js
│   ├── riskRoutes.js
│   ├── workloadRoutes.js
│   ├── simulationRoutes.js
│   ├── reportRoutes.js
│   ├── chatRoutes.js
│   ├── notificationRoutes.js
│   └── dashboardRoutes.js
│
├── workers/
│   ├── queue.js                # BullMQ / Async Queue manager
│   ├── githubWorker.js         # Commits and PRs batch processor
│   ├── meetingWorker.js        # Background Whisper transcription processor
│   ├── verificationWorker.js   # Closed-loop action item verification job
│   ├── riskCalculationWorker.js# Periodic ML risk computation & SHAP attribution
│   └── reportGeneratorWorker.js# Scheduled weekly AI report generator
│
├── migrations/
│   ├── 001_create_reports_table.sql
│   ├── 002_create_sprints_and_tickets_tables.sql
│   └── 003_create_notifications_table.sql
│
├── tests/
│   ├── report.test.js          # 13 tests
│   ├── sprint.test.js          # 6 tests
│   └── notification.test.js    # 7 tests
│
├── server.js                   # Express application entry point
├── package.json
└── .env
```

---

## 3. Database Schema & Key Architectural Decisions

### 3.1 The Shared `risk_scores` Table
Instead of creating 3 fragmented tables (`delay_risks`, `code_risks`, `burnout_risks`), one polymorphic table powers all risk dimensions:
* `entity_type`: `'ticket'`, `'pull_request'`, `'user'`
* `risk_type`: `'delay'`, `'code_aware'`, `'burnout'`
* `score`: `0` to `100`
* `shap_explanation`: JSONB array of feature contribution weights (e.g. `[ { "feature": "No commits in 3 days", "weight": 0.29 } ]`)

### 3.2 Closed-Loop Meeting Verification (`action_items`)
* `status`: `'pending'`, `'verified_done'`, `'flagged_incomplete'`
* Background worker checks commit logs and Jira ticket transitions on due dates, updating `verification_reason` and `verified_at`.

---

## 4. Complete Endpoints Map

| Category | Method | Endpoint | Purpose |
| :--- | :--- | :--- | :--- |
| **System** | `GET` | `/api/health` | Service health status |
| **Auth** | `GET` | `/api/auth/me` | Current authenticated user profile |
| **Teams** | `GET` | `/api/team/list` | List all teams |
| | `GET` | `/api/team?team_id=<id>` | Team roster & members |
| | `POST` | `/api/team` | Create new team |
| | `PUT` | `/api/team/:teamId` | Update team details |
| | `DELETE` | `/api/team/:teamId` | Delete team |
| **Sprints** | `GET` | `/api/sprints?team_id=<id>` | List team sprints |
| | `POST` | `/api/sprints` | Create sprint |
| | `GET` | `/api/sprints/:sprintId/tickets`| Sprint tickets with assigned profile details |
| | `DELETE` | `/api/sprints/:sprintId` | Delete sprint and tickets |
| **Tickets** | `POST` | `/api/tickets` | Batch/single ticket creation |
| | `PATCH` | `/api/tickets/:ticketId/status`| Kanban status update |
| **AI Planning** | `POST` | `/api/ai/generate-tasks` | AI task generation from requirements (Groq) |
| | `POST` | `/api/ai/plan-sprint` | AI sprint capacity & story point planning |
| **Reports** | `GET` | `/api/reports/latest` | Latest team report (technical \| stakeholder) |
| | `GET` | `/api/reports/:reportId` | Specific report (with cross-team authorization) |
| **Notifications** | `GET` | `/api/notifications` | List user/team notifications |
| | `PATCH` | `/api/notifications/:id/read` | Mark single notification as read |
| | `PATCH` | `/api/notifications/read-all` | Bulk mark notifications read |
| | `DELETE` | `/api/notifications/:id` | Delete notification |
| **Meetings** | `POST` | `/api/meetings/upload` | Upload meeting audio to Supabase Storage |
| | `GET` | `/api/meetings` | List team meetings and transcripts |
| | `GET` | `/api/action-items` | Closed-loop meeting action items |
| **Risk** | `GET` | `/api/risk/tickets/:id` | Ticket delay risk score & SHAP explanation |
| | `GET` | `/api/risk/prs/:id` | PR code-aware risk & coverage delta |
| **Workload** | `GET` | `/api/workload/team` | Team workload telemetry |
| | `GET` | `/api/workload/burnout` | Lead-only burnout predictions (RBAC guarded) |
| **Simulation** | `POST` | `/api/simulation/run` | Monte Carlo sprint simulation |
| | `GET` | `/api/simulation/:id` | Simulation percentiles (P50, P90) |
| **Chatbot** | `POST` | `/api/chat/message` | RAG Chatbot query grounded on project documents |

---

## 5. Standard JSON Response Formats

### Success
```json
{
  "success": true,
  "data": {},
  "message": "Sprint created successfully"
}
```

### Error
```json
{
  "success": false,
  "message": "Invalid version parameter 'executive'. Allowed values: technical, stakeholder",
  "error": "BAD_REQUEST"
}
```

### List / Paginated
```json
{
  "success": true,
  "count": 25,
  "data": [],
  "pagination": {
    "offset": 0,
    "limit": 25,
    "total": 100
  }
}
```
