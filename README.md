# ⚡ DSA Mentor

<p align="center">
  <strong>An AI-Powered Algorithmic Learning & Code Evaluation Platform with Isolated Sandbox Execution, Redis Cache-Aside Persistence, and Playwright BDD Automation.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.12" />
  <img src="https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django 6.0" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 16" />
  <img src="https://img.shields.io/badge/Redis-7.0-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis 7" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Compose" />
  <img src="https://img.shields.io/badge/Playwright-E2E-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
  <img src="https://img.shields.io/badge/OpenRouter-Nemotron_3.5-76B900?style=for-the-badge&logo=nvidia&logoColor=white" alt="Nvidia Nemotron" />
</p>

---

## 📖 Table of Contents
1. [Executive Summary](#-executive-summary)
2. [Key Features](#-key-features)
3. [System Architecture](#-system-architecture)
4. [Technology Stack](#-technology-stack)
5. [Quickstart & Reproduction Guide](#-quickstart--reproduction-guide)
6. [Isolated Execution Engine (Piston API)](#-isolated-execution-engine-piston-api)
7. [In-Memory Cache-Aside Pattern (Redis 7)](#-in-memory-cache-aside-pattern-redis-7)
8. [AI Mentorship & Reasoning Pipeline](#-ai-mentorship--reasoning-pipeline)
9. [Database Schema & Models](#-database-schema--models)
10. [REST API Reference](#-rest-api-reference)
11. [End-to-End Test Automation (Playwright + Pytest-BDD)](#-end-to-end-test-automation-playwright--pytest-bdd)

---

## 🌟 Executive Summary

**DSA Mentor** bridges the gap between passive algorithmic problem-solving and personalized 1-on-1 pedagogical mentorship. Rather than outputting binary pass/fail verdicts or spoiling problems with instant code dumps, DSA Mentor provides:

- **Isolated Sandboxed Execution**: Evaluates untrusted C++, Python, Java, and JavaScript inside a containerized microservice runtime with strict CPU time and memory caps.
- **Cache-Aside State Resilience**: Employs Redis 7 with sliding 72-hour TTLs to persist uncommitted user code drafts across page reloads and problem switches with sub-millisecond retrieval.
- **Pedagogical LLM Mentorship**: Leverages **Nvidia Nemotron 3.5 Super VL** via OpenRouter with activated **Chain-of-Thought (CoT)** reasoning. Provides structured line-by-line bug identification, counterexamples, and 3 progressive hints.
- **Dynamic Problem Synthesis**: Synthesizes custom LeetCode-style algorithmic challenges on demand based on student proficiency, target topics, and learning goals.
- **Enterprise-Grade E2E Test Suite**: Full **Playwright + pytest-bdd** test automation covering virtualized Monaco DOM keyboard typing, network fault injection (504 timeouts, 401 token invalidation), and hybrid REST API seeding with automated teardown.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Cosmic Glassmorphic IDE** | Embedded Monaco Editor (`@monaco-editor/react`) with language switcher (Python, C++, Java, JS), dark/light themes, and automatic boilerplate population. |
| **Multi-Language Sandbox** | Safe, isolated code compilation and execution powered by self-hosted Piston runtime in Docker. |
| **Zero-Loss Editor State** | Redis cache-aside layer ensures your written code is never lost on refresh or tab navigation. |
| **Chain-of-Thought AI Review** | AI deeply simulates edge cases before outputting reviews, guaranteeing accurate bug detection without hallucinating. |
| **Progressive Hints** | Multi-tiered hints that nudge students toward the optimal approach without spoiling the solution. |
| **Real-Time Analytics Dashboard** | Chart.js interactive visualizations tracking total solved/unsolved problems and topic-by-topic mastery distribution. |
| **Automated BDD Test Harness** | 15 fully automated Gherkin scenarios with automated timing telemetry executing across all layers. |

---

## 🏗 System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Layer (React 19 + Vite + Tailwind CSS v4)"]
        UI["Dashboard & Workspace UI"]
        Monaco["Monaco Code Editor (@monaco-editor/react)"]
        Charts["Chart.js Analytics (Pie & Horizontal Bar)"]
    end

    subgraph API["Backend API Gateway (Django 6.0 + DRF)"]
        JWT["SimpleJWT Authentication"]
        Views["API Endpoints & Controllers"]
        StatsEngine["Aggregation Analytics Engine"]
    end

    subgraph Caching["In-Memory Cache (Redis 7 Alpine)"]
        RedisCache["Cache-Aside Layer (TTL: 72 hrs)\nKey: {user}:{ques_no}:source_code"]
    end

    subgraph Sandbox["Execution Sandbox (Self-Hosted Piston API)"]
        Piston["Isolated Container Runtime\n(Python 3.12, C++ GCC, Java, Node.js)"]
    end

    subgraph Database["Persistence Layer (PostgreSQL 16 Alpine)"]
        PostgresDB[(PostgreSQL Database:\ndashboard_DSA_MENTORE)]
    end

    subgraph Inference["AI Reasoning Pipeline (OpenRouter API)"]
        LLM["nvidia/nemotron-3.5-super-vl:free\n(with Reasoning CoT Enabled)"]
    end

    subgraph TestSuite["Playwright + pytest-bdd Automation Suite"]
        E2E["E2E BDD Test Runner\n(run_tests.sh)"]
        RouteMock["Network Route Interception\n(page.route Mocking)"]
    end

    UI -->|JWT Bearer Requests| Views
    Views -->|Verify Credentials| JWT
    Views -->|Read/Write Source Drafts| RedisCache
    Views -->|Relational Queries & CRUD| PostgresDB
    Views -->|HTTP Code Exec / Port 2000| Piston
    Views -->|Structured CoT Review & Synthesis| LLM
    StatsEngine -->|ORM Aggregations| PostgresDB
    StatsEngine -->|Telemetry Data| Charts
    TestSuite -->|Automate & Verify| UI
    TestSuite -->|Direct Data Seeding & Teardown| Views
    TestSuite -->|Fault Injection (504/401)| RouteMock
```

---

## 🛠 Technology Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Monaco Editor (`@monaco-editor/react`), Chart.js, `react-chartjs-2`, Axios, React Router DOM v7 |
| **Backend API** | Python 3.12, Django 6.0, Django REST Framework (DRF), SimpleJWT, `django-ckeditor-5` |
| **Database** | PostgreSQL 16 Alpine, `psycopg2-binary` |
| **Caching Layer** | Redis 7 Alpine, `django-redis` (Cache-Aside pattern, 72-hour sliding TTL) |
| **Code Sandbox** | Self-hosted Piston API Docker Engine (isolated cgroups, memory & CPU limits) |
| **AI Inference** | OpenRouter API, `nvidia/nemotron-3.5-super-vl:free`, OpenAI Python SDK, Chain-of-Thought (CoT) reasoning |
| **Test Automation** | Playwright (Python), `pytest`, `pytest-bdd` (Gherkin BDD), Page Object Model (POM) |
| **DevOps & Infra** | Docker, Docker Compose, Alpine Linux images |

---

## ⚡ Quickstart & Reproduction Guide

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)
- Python 3.12+ (for running Playwright tests locally)
- [OpenRouter API Key](https://openrouter.ai/)

### 1. Clone & Configure Environment
```bash
git clone https://github.com/your-username/DSA_mentor.git
cd DSA_mentor

# Create your .env file in the project root:
cat <<EOF > .env
AI_API_KEY=your_openrouter_api_key_here
POSTGRES_DB=dashboard_DSA_MENTORE
POSTGRES_USER=aditya
POSTGRES_PASSWORD=aditya
POSTGRES_HOST=database
POSTGRES_PORT=5432
REDIS_HOST=redis
REDIS_PORT=6379
EOF
```

### 2. Boot the 5-Container Stack
```bash
docker compose up -d --build
```

Verify that all containers are healthy:
```bash
docker compose ps
```

| Container | Service | Host Port | Purpose |
| :--- | :--- | :---: | :--- |
| `database` | PostgreSQL 16 | `5432` | Relational persistent storage |
| `backend` | Django 6.0 DRF | `8000` | REST API Gateway & Business Logic |
| `frontend` | React 19 + Vite | `5173` | Cosmic glassmorphism web interface |
| `dsa_mentore_redis` | Redis 7 Alpine | `6379` | Cache-aside code & execution cache |
| `dsa_mentore_piston` | Piston Sandbox | `2000` | Isolated compilation & execution runtime |

### 3. Install Piston Language Packages
Initialize execution packages for Python, C++, Node.js, and Java:
```bash
chmod +x piston-api.sh
./piston-api.sh
```

### 4. Database Migrations & Initial Superuser
```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser --username test_dev --email test@example.com
# Set password: 123456
```

### 5. Access the Platform
- **Web Application**: [http://localhost:5173](http://localhost:5173)
- **Django Admin & API**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **Piston Sandbox API**: [http://localhost:2000/api/v2/](http://localhost:2000/api/v2/)

---

## 🔒 Isolated Execution Engine (Piston API)

Untrusted user code is dispatched to the self-hosted **Piston API** container. It executes inside unprivileged Linux namespaces and cgroups with hard resource boundaries:
- **Compile Timeout**: 10,000 ms
- **Run Timeout**: 5,000 ms
- **Memory Cap**: 128 MB RAM
- **Concurrent Jobs**: 6 max

### Execution Dispatch Format (`POST http://localhost:2000/api/v2/execute`):
```json
{
  "language": "python",
  "version": "3.12.0",
  "files": [{ "content": "def solution():\n    print('Hello World')\nsolution()" }],
  "stdin": "",
  "run_timeout": 5000,
  "compile_timeout": 10000
}
```

The backend extracts execution duration (`cpu_time`), memory peak (`memory`), standard output (`stdout`), and standard error (`stderr`), immediately storing the attempt in PostgreSQL and updating Redis.

---

## ⚡ In-Memory Cache-Aside Pattern (Redis 7)

To prevent repetitive database reads every time a student switches tabs or refreshes the page, DSA Mentor implements a **Cache-Aside Caching Strategy**:

```python
# Settings configuration (Backend/backend/settings.py)
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://redis:6379/1",
        "KEY_PREFIX": "dsa_mentor",
    }
}
```

### Cache Key Namespaces:
- **Code Draft**: `{username}:{ques_no}:source_code`
- **Result Cache**: `{username}:{ques_no}:result`
- **Sliding TTL**: `259200` seconds (72 hours)

### Read Path (`GET /api/cache_source_code/<ques_no>`):
1. Check Redis for `{username}:{ques_no}:source_code`.
2. **Cache Hit**: Return cached code in $< 1\text{ms}$.
3. **Cache Miss**: Query PostgreSQL `Submitted_question`, populate Redis with 72h TTL, and return code.
4. **No Prior Code**: Return `{"source_code": null}` (Frontend mounts default starter template).

---

## 🧠 AI Mentorship & Reasoning Pipeline

DSA Mentor integrates the **OpenRouter API** using the `openai` Python SDK.

### Model Configuration:
- **Primary Model**: `nvidia/nemotron-3.5-super-vl:free` (**Nvidia Nemotron 3.5 Super VL**)
- **Fallback Model**: `meta-llama/llama-3.3-70b-instruct:free` (Meta Llama 3.3 70B)
- **Chain-of-Thought (CoT) Reasoning**: Configured via `extra_body={"reasoning": {"enabled": True}}` to simulate runtime behavior and counterexamples before generating feedback.

---

### Pipeline 1: Pedagogical Code Review (`Backend/api/AI_api.py`)
Analyzes student code against constraints and Piston runtime output. Enforces a strict single JSON output schema without markdown code fences:

```json
{
  "review_status": "correct | partially_correct | incorrect | needs_more_info",
  "summary": "High-level review assessment.",
  "logic_analysis": "Algorithmic correctness and complexity breakdown.",
  "issues": [
    {
      "line": 4,
      "severity": "critical | major | minor",
      "title": "Index Collision Bug",
      "description": "Fails to verify index uniqueness when complement equals current number.",
      "counterexample": "nums = [3, 2, 4], target = 6 => returns [0, 0] instead of [1, 2]"
    }
  ],
  "hints": [
    {
      "level": 1,
      "hint": "Check if your hash map entry is at the same index as the loop pointer."
    }
  ],
  "execution_analysis": {
    "status": "passed | failed | error",
    "interpretation": "Interpretation of sandbox standard output."
  },
  "next_step": "One actionable next step for the student.",
  "review": "Full human-readable Markdown review combining the above."
}
```

---

### Pipeline 2: Dynamic Question Generator (`Backend/api/question_AI.py`)
Generates structured algorithmic problems matching user-defined parameters (`topic`, `subtopic`, `level`, `known_topics`, `goal`):

```json
{
  "question": "Validate Binary Search Tree",
  "content": "<h3>Concept</h3><p>...</p><h3>Problem</h3><p>...</p><h3>Input Format</h3><p>...</p><h3>Output Format</h3><p>...</p><h3>Example</h3><pre><code>...</code></pre>",
  "constraints": "1 <= number of nodes <= 10000\n-2^31 <= Node.val <= 2^31 - 1",
  "timelimit": 1.0,
  "memory_limit": 128,
  "topic": "Trees",
  "subtopic": "Binary Search Tree",
  "hint1": "Consider the range of valid values for each node.",
  "hint2": "Use recursion passing min and max allowable bounds.",
  "hint3": "Every left child must be strictly less; every right child strictly greater.",
  "stdin": "3\n2 1 3\n"
}
```

---

## 🗄 Database Schema & Models

Engineered in PostgreSQL 16 via Django ORM:

```
+--------------------+       +----------------------+       +-------------------------+
|      UserInfo      |       |       Question       |       |   Submitted_question    |
+--------------------+       +----------------------+       +-------------------------+
| id (PK)            |       | ques_no (PK Auto)    |       | id (PK)                 |
| user (1-to-1 User) |       | question (Text)      |       | question_no (FK Ques)   |
| user_streak (Int)  |       | question_content (CK)|<------| language (Char)         |
| last_activity (DT) |       | constraints (Text)   |       | source_code (Text)      |
+--------------------+       | timeLimit (Float)    |       | stdin (Text)            |
                             | memoryLimit (Int)    |       | stdout (Text)           |
                             | hint_1..3 (Text)     |       | memory (Char)           |
                             | topic, subtopic      |       | cpu_time (Char)         |
                             | stdin (Text)         |       | user_id (FK UserInfo)   |
                             +----------------------+       +-------------------------+
                                        |
                                        v
                             +----------------------+
                             |      Dashboard       |
                             +----------------------+
                             | id (PK)              |
                             | sr_no (Int)          |
                             | ques_no (Int)        |
                             | username (FK User)   |
                             | question, topic      |
                             | subtopic, date       |
                             | remark (Text)        |
                             | status (Boolean)     |
                             +----------------------+
```

---

## 🌐 REST API Reference

| Method | Endpoint | Auth | Purpose |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/login/` | Public | Obtain JWT Access and Refresh tokens. |
| `POST` | `/api/token/refresh` | Public | Refresh expired JWT access token. |
| `POST` | `/api/register` | Public | Register new user account. |
| `GET` | `/api/questions/<ques_no>/` | Bearer | Fetch problem description, constraints, and runtime limits. |
| `POST` | `/api/submissions/<ques_no>` | Bearer | Execute code in Piston sandbox, save telemetry, and generate AI review. |
| `GET` | `/api/cache_source_code/<ques_no>` | Bearer | Read user draft from Redis cache (or PostgreSQL). |
| `GET` | `/api/ai/review/<ques_no>/` | Bearer | Direct AI review generation. |
| `GET` | `/api/fetch_dashboard_data/` | Bearer | Retrieve student problem tracking table. |
| `POST` | `/api/submit_dashboard_data/` | Bearer | Update question status or notes on dashboard. |
| `POST` | `/api/create_question/` | Bearer | Direct REST endpoint to seed a new question into DB. |
| `POST` | `/api/submit_question_form` | Bearer | Triggers AI question synthesis pipeline from student requirements. |
| `DELETE`| `/api/questions/<ques_no>/delete/`| Bearer | Delete problem from `Question` and `Dashboard` tables (test teardown). |
| `GET` | `/api/status_stats_endpoint` | Bearer | Get `[solved_count, unsolved_count]` for Chart.js Pie charts. |
| `GET` | `/api/subtopic_stats_endpoint` | Bearer | Get `{ "SubtopicName": count }` for Chart.js Horizontal Bar charts. |

---

## 🧪 End-to-End Test Automation (Playwright + Pytest-BDD)

The test suite in `tests/` uses **Playwright (Python)** with **pytest-bdd** following the **Page Object Model (POM)**:

```
tests/
├── conftest.py                   # Playwright browser lifecycle fixtures
├── run_tests.sh                  # Master sequential test runner with timer
├── Network_Mocking/
│   └── AI_NM.py                  # Playwright page.route() network interceptors
├── features/                     # Gherkin BDD Feature specifications
│   ├── login.feature             # Positive & negative authentication
│   ├── codespace.feature         # Monaco editor, Redis reload, AI mocks
│   └── dashboard.feature         # Problem navigation, API seeding & teardown
├── pages/                        # Pytest-BDD Step Definition bindings
│   ├── login_step.py
│   ├── codespace_step.py
│   └── dashboard_step.py
└── web/                          # Low-level Page Object Model driver actions
    ├── login_web.py
    ├── codespace_web.py
    └── dashboard_web.py
```

### Automation Suites:

1. **Suite 1: Authentication & Form Validation (`login.feature`)**:
   - Tests successful login, dashboard redirection, and token storage.
   - Tests bad password and bad username scenarios with error assertions.
2. **Suite 2: Monaco Virtual DOM & Redis State Synchronization (`codespace.feature`)**:
   - Monaco virtualized DOM typing via `page.keyboard.insert_text()`, bypassing autocomplete interference.
   - Multi-language template switching across Python, C++, Java, and JavaScript.
   - Dark and light theme application.
   - **Redis Cache-Aside State Validation**: Types code, submits, reloads browser via `page.reload()`, and verifies `to_contain_text()` reloads state from Redis.
3. **Suite 3: Network Interception & Fault Injection (`AI_NM.py`)**:
   - Uses `page.route()` to deterministically intercept asynchronous LLM API calls.
   - Mocks successful AI reviews, verifying review status badges and hint accordion expansions.
   - Injects **HTTP 504 Gateway Timeouts** to verify frontend error boundary handling.
   - Injects **HTTP 401 Unauthorized** to verify automatic token eviction and redirect to `/login`.
4. **Suite 4: Hybrid API-UI Data Seeding & Teardown (`dashboard.feature`)**:
   - Calls `POST /api/create_question/` directly via HTTP with JWT credentials.
   - Navigates to `/problem/{ques_no}` and validates UI elements (`⏱ 2s`, `💾 256 MB`).
   - Automatically executes `DELETE /api/questions/{ques_no}/delete/` at teardown, ensuring zero test data pollution.

### Run All Automation Suites with Timing Telemetry:
```bash
cd tests
./run_tests.sh
```

Sample output:
```text
==================================================
🚀 Running Suite 1: Authentication & Login
==================================================
3 passed in 4.21s

==================================================
🚀 Running Suite 2: Codespace, Monaco & AI Mocking
==================================================
10 passed in 38.15s

==================================================
🚀 Running Suite 3: Dashboard & API Hybrid Seeding
==================================================
2 passed in 6.42s

==================================================
🎉 ALL E2E AUTOMATION SUITES PASSED SUCCESSFULLY!
⏱  Total Execution Time: 0m 48s (48s total)
==================================================
```

---




