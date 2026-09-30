# ProjectPilot AI — Engineering Diagrams & System Architecture

This document contains all formal diagrams corresponding directly to **Chapter 3** and **Chapter 5** of the BE Project Report (`ProjectPilot_AI_Project_Report.docx`).

> 🚀 **Live Interactive Exporter (300 DPI High-Res Download):**  
> Open [http://localhost:3000/diagrams/index.html](http://localhost:3000/diagrams/index.html) or [public/diagrams/index.html](../public/diagrams/index.html) to download clean high-res PNGs and SVGs with one click.

---

## Figure 5.1: Gantt Chart for Next Semester Implementation Plan (16 Weeks)
*Strictly mapped to Table 5.1 of the Project Report.*

| Sr. | Task / Milestone | Weeks | Outcome |
| :---: | :--- | :---: | :--- |
| **1** | Set up environment, agree API contract, receive & log GitHub webhook | **1 – 3** | Working ingestion pipeline |
| **2** | Authentication and dashboard shell with sample data | **2 – 4** | Login and empty dashboard |
| **3** | Requirement-to-task generation using Groq-hosted LLM | **3 – 6** | Task generation module |
| **4** | Sprint planning module & capacity allocation | **5 – 8** | Sprint plan output |
| **5** | Meeting transcription and summary with action items (Whisper) | **5 – 8** | Meeting intelligence module |
| **6** | Prepare training data from public repos; define features & labels | **4 – 7** | Training dataset & Feature Store |
| **7** | Train XGBoost delay/risk model and add SHAP explanation | **7 – 11** | Explainable risk prediction |
| **8** | Bus-factor and workload analysis | **8 – 11** | Workload & single-point-of-failure metrics |
| **9** | Project assistant (RAG), reports and real-time notifications | **9 – 12** | AI Assistant & executive reports |
| **10** | Release Readiness Score calculation | **11 – 13** | Readiness score with reasons |
| **11** | Integration, testing and evaluation (accuracy, AUC, MAE) | **12 – 15** | Tested system & benchmarks |
| **12** | Final report and presentation | **14 – 16** | Final BE project submission & defense |

```mermaid
gantt
    title Figure 5.1: 16-Week Implementation Schedule (Table 5.1)
    dateFormat  YYYY-MM-DD
    axisFormat  W%W

    section Phase 1: Setup & Ingestion
    1. Env setup & GitHub webhook pipeline     :done, t1, 2026-01-05, 3w
    2. Auth & dashboard shell with sample data :active, t2, 2026-01-12, 3w
    3. Requirement-to-task LLM module (Groq)   :t3, 2026-01-19, 4w

    section Phase 2: Modules & Data
    4. Sprint planning & capacity allocation   :t4, 2026-02-02, 4w
    5. Meeting transcription (Whisper)         :t5, 2026-02-02, 4w
    6. Training data prep (features & labels)  :t6, 2026-01-26, 4w

    section Phase 3: AI & Analytics
    7. Train XGBoost model & SHAP explanation  :t7, 2026-02-16, 5w
    8. Bus-factor & workload analysis          :t8, 2026-02-23, 4w
    9. Project assistant (RAG) & reports       :t9, 2026-03-02, 4w
    10. Release Readiness Score calculation    :t10, 2026-03-16, 3w

    section Phase 4: Testing & Finalization
    11. Integration, testing & evaluation      :t11, 2026-03-23, 4w
    12. Final report & project presentation    :t12, 2026-04-06, 3w
```

---

## Figure 3.1: System Architecture of ProjectPilot AI (Short & Compact)

```mermaid
flowchart TB
    classDef lBox fill:#f8fafc,stroke:#2563eb,stroke-width:1.5px,font-weight:bold,color:#1e3a8a,font-size:11px;

    L5["🖥️ Layer 5 (Presentation): Next.js 14 Dashboard | Health Overview | Risk & SHAP Alerts | Sprints | RAG Assistant | Release Gauge"]:::lBox
    L4["⚡ Layer 4 (API & Gateways): FastAPI Engine | WebSockets | Auth & RBAC | HMAC Webhooks | Celery Task Queue"]:::lBox
    L3["🤖 Layer 3 (AI & Analytics): XGBoost Delay Model | SHAP Explainer | Groq Llama-3 | Whisper STT | RAG LangGraph"]:::lBox
    L2["🗄️ Layer 2 (Storage & Vectors): PostgreSQL Database | pgvector Embeddings | Feature Store | Redis Cache"]:::lBox
    L1["🔌 Layer 1 (Integrations & ETL): GitHub Webhooks (Commits/PRs) | Meeting Audio (FFmpeg) | PRDs & User Stories"]:::lBox

    L1 ==> L2 ==> L3 ==> L4 ==> L5
```

---

## Figure 3.2: System Flowchart of ProjectPilot AI

```mermaid
flowchart TD
    classDef startEnd fill:#dbeafe,stroke:#1d4ed8,stroke-width:1.5px,color:#1e3a8a,font-weight:bold;
    classDef stepNode fill:#ffffff,stroke:#475569,stroke-width:1.2px,color:#0f172a,font-size:12px;
    classDef aiNode fill:#faf5ff,stroke:#7e22ce,stroke-width:1.5px,color:#581c87,font-weight:600,font-size:12px;
    classDef decNode fill:#fef3c7,stroke:#b45309,stroke-width:1.5px,color:#78350f,font-weight:bold,font-size:12px;

    S(["Start"]):::startEnd
    P1["1. PM Inputs Requirements / PRD"]:::stepNode
    P2["2. Groq LLM Generates & Prioritizes Tasks"]:::aiNode
    P3["3. Sprint Planning & Capacity Allocation"]:::stepNode
    P4["4. Team Commits Code, Opens PRs & Attends Meetings"]:::stepNode
    P5["5. Automated Ingestion & PostgreSQL Storage"]:::stepNode
    P6["6. XGBoost Predicts Delay & SHAP Computes Reasons"]:::aiNode
    P7["7. Release Readiness Score (RRS) Evaluated"]:::aiNode
    
    D{"RRS &ge; 85%?"}:::decNode
    
    ACT_NO["8a. Trigger Risk Alert & AI Mitigations"]:::stepNode
    ACT_YES["8b. Authorize Release Go-Ahead"]:::stepNode
    E(["End Cycle"]):::startEnd

    S --> P1 --> P2 --> P3 --> P4 --> P5 --> P6 --> P7 --> D
    D -- "No (At Risk)" --> ACT_NO --> P3
    D -- "Yes (Ready)" --> ACT_YES --> E
```

---

## Figure 3.3: Use Case Diagram of ProjectPilot AI

```mermaid
flowchart LR
    classDef actor fill:#eff6ff,stroke:#1d4ed8,stroke-width:2px,color:#1e3a8a,font-weight:bold;
    classDef sysActor fill:#faf5ff,stroke:#7e22ce,stroke-width:2px,color:#581c87,font-weight:bold;
    classDef uc fill:#ffffff,stroke:#334155,stroke-width:1.2px,color:#0f172a,font-size:12px;
    classDef box fill:#f8fafc,stroke:#94a3b8,stroke-width:1.5px,stroke-dasharray: 4 4;

    PM["🧑‍💼 Project Manager"]:::actor
    DEV["👨‍💻 Developer"]:::actor
    STK["👔 Stakeholder"]:::actor
    EXT["🐙 GitHub / AI API"]:::sysActor

    subgraph SYS [" ProjectPilot AI System Boundary "]
        UC1(["UC1: Generate Tasks from PRD"]):::uc
        UC2(["UC2: Sprint Planning & Allocation"]):::uc
        UC3(["UC3: View Risk & SHAP Reasons"]):::uc
        UC4(["UC4: Evaluate Release Readiness"]):::uc
        UC5(["UC5: Track Git Commits & PRs"]):::uc
        UC6(["UC6: Transcribe Meeting Audio"]):::uc
        UC7(["UC7: Chat with RAG AI Assistant"]):::uc
        UC8(["UC8: View Executive Reports"]):::uc
    end

    PM --> UC1
    PM --> UC2
    PM --> UC3
    PM --> UC4
    PM --> UC8

    DEV --> UC5
    DEV --> UC6
    DEV --> UC7

    STK --> UC4
    STK --> UC8

    EXT --> UC5
    EXT -.-> |«AI Support»| UC1 & UC3 & UC6 & UC7

    class SYS box;
```

---

## Figure 3.4: Risk Prediction, Explanation & Release Pipeline

```mermaid
flowchart LR
    classDef step fill:#eff6ff,stroke:#2563eb,stroke-width:1.5px,color:#1e3a8a,font-size:12px;
    classDef ml fill:#faf5ff,stroke:#7c3aed,stroke-width:1.5px,color:#581c87,font-size:12px;
    classDef exp fill:#fffbeb,stroke:#d97706,stroke-width:1.5px,color:#78350f,font-size:12px;
    classDef out fill:#f0fdf4,stroke:#16a34a,stroke-width:1.5px,color:#14532d,font-size:12px;

    subgraph S1 [" 1. Features "]
        F1["Git Churn, PR Lag,<br/>WIP & Bus Factor"]:::step
    end

    subgraph S2 [" 2. XGBoost "]
        M1["Risk: High / Low<br/>Predicted Delay (Days)"]:::ml
    end

    subgraph S3 [" 3. SHAP "]
        E1["Feature Contributions<br/>(&phi;<sub>i</sub> reasons for delay)"]:::exp
    end

    subgraph S4 [" 4. Release Readiness "]
        R1["Score: RRS = &sum; w<sub>j</sub> s<sub>j</sub><br/>Go / No-Go Decision"]:::out
    end

    S1 --> S2 --> S3 --> S4
```

---

## Figure 3.5: Sequence Diagram: GitHub Event to Risk Alert

```mermaid
sequenceDiagram
    autonumber
    actor Dev as 👨‍💻 Developer
    participant GH as 🐙 GitHub
    participant API as ⚡ FastAPI
    participant Worker as ⚙️ Worker / ML
    participant DB as 🗄️ PostgreSQL
    actor PM as 🧑‍💼 PM Dashboard

    Dev->>GH: 1. Push Commits / Open PR
    GH->>API: 2. Webhook Event (HMAC Signed)
    API-->>GH: 3. 202 Accepted
    API->>Worker: 4. Queue Background Event Job
    Worker->>Worker: 5. Extract Feature Vector X
    Worker->>Worker: 6. XGBoost Prediction & SHAP Reasons
    Worker->>DB: 7. Save Risk & SHAP Records
    Worker->>PM: 8. WebSocket Instant Alert Notification
    PM->>PM: 9. Display Risk Badge & Explainable Reasons
```

---

## Figure 3.6: Database Schema / Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ PROJECTS : manages
    USERS ||--o{ TASKS : assigned_to
    PROJECTS ||--o{ SPRINTS : contains
    PROJECTS ||--o{ GIT_EVENTS : tracks
    PROJECTS ||--o{ MEETINGS : records
    SPRINTS ||--o{ TASKS : schedules
    TASKS ||--o{ RISK_PREDICTIONS : has
    RISK_PREDICTIONS ||--o{ SHAP_REASONS : explained_by
    MEETINGS ||--o{ ACTION_ITEMS : generates

    USERS {
        uuid id PK
        string name
        string email
        string role
    }
    PROJECTS {
        uuid id PK
        string name
        string repo_url
    }
    SPRINTS {
        uuid id PK
        uuid project_id FK
        int sprint_num
        string status
    }
    TASKS {
        uuid id PK
        uuid sprint_id FK
        uuid assignee_id FK
        string title
        string priority
        string status
    }
    GIT_EVENTS {
        uuid id PK
        uuid project_id FK
        string event_type
        int churn_lines
    }
    RISK_PREDICTIONS {
        uuid id PK
        uuid task_id FK
        string risk_level
        float delay_days
    }
    SHAP_REASONS {
        uuid id PK
        uuid risk_id FK
        string feature_name
        float shap_value
    }
    MEETINGS {
        uuid id PK
        uuid project_id FK
        text transcript
        text summary
    }
    ACTION_ITEMS {
        uuid id PK
        uuid meeting_id FK
        string task_text
    }
```

---

## Figure 3.7: Data Flow Diagram (DFD Level 1)

```mermaid
flowchart LR
    classDef ent fill:#eff6ff,stroke:#2563eb,stroke-width:1.5px,color:#1e3a8a,font-size:12px;
    classDef prc fill:#ffffff,stroke:#0f172a,stroke-width:1.5px,color:#0f172a,font-size:12px;
    classDef st fill:#f0fdf4,stroke:#16a34a,stroke-width:1.5px,color:#14532d,shape:cylinder,font-size:12px;

    PM["🧑‍💼 PM / Dev"]:::ent
    GH["🐙 GitHub"]:::ent

    P1["1.0 Parse & Plan Tasks"]:::prc
    P2["2.0 Ingest Git Activity"]:::prc
    P3["3.0 Predict Risk & SHAP"]:::prc
    P4["4.0 Release Readiness & Alerts"]:::prc

    D1[("D1: Tasks & Sprints")]:::st
    D2[("D2: Git Telemetry")]:::st
    D3[("D3: Risk & Features")]:::st

    PM -->|Requirements| P1 --> D1
    GH -->|Webhook Events| P2 --> D2
    D1 & D2 --> P3 --> D3
    D3 --> P4 -->|Alerts & Reports| PM
```

---

## Figure 3.8: Deployment & Infrastructure Topology

```mermaid
flowchart TB
    classDef client fill:#eff6ff,stroke:#2563eb,stroke-width:1.5px,color:#1e3a8a,font-size:12px;
    classDef docker fill:#f0fdf4,stroke:#16a34a,stroke-width:1.5px,color:#14532d,font-size:12px;
    classDef ext fill:#faf5ff,stroke:#7c3aed,stroke-width:1.5px,color:#581c87,font-size:12px;

    CLIENT["🖥️ Client Browser (Next.js 14 Web UI)"]:::client

    subgraph DOCKER [" Docker Compose Stack "]
        NGINX["🛡️ Nginx Reverse Proxy (Port 80/443)"]:::docker
        APP["Next.js Server (Port 3000)"]:::docker
        API["FastAPI + Celery Workers (Port 8000)"]:::docker
        DB[("PostgreSQL 16 + pgvector & Redis")]:::docker
    end

    subgraph CLOUD [" Cloud AI APIs "]
        GROQ["⚡ Groq API (Llama-3-70B)"]:::ext
        WHISPER["🎙️ Whisper Transcription"]:::ext
        GITHUB["🐙 GitHub Webhooks"]:::ext
    end

    CLIENT <--> NGINX
    NGINX <--> APP & API
    API <--> DB
    API <--> GROQ & WHISPER & GITHUB
```
