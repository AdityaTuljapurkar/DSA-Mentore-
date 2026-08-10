
# PROJECT_CONTEXT.md
# DSA Mentor AI (Django Edition)

> **Read this file completely before writing any code.**
> This document is the permanent context for every future development session.

---

# Project Vision

Build an **AI-powered DSA Mentor** that helps users improve their problem-solving skills through adaptive learning.

The system should:

- Generate personalized DSA questions.
- Review submitted solutions using an LLM.
- Remember historical performance.
- Adapt future questions based on strengths and weaknesses.
- Present progress through a modern dashboard.

This project is an **engineering project with AI**, not an AI demo.

---

# Primary Goal

Create a modular system where:

Observe
→ Remember
→ Reason
→ Act
→ Improve

The AI should make learning decisions, not simply generate text.

---

# Target User

Initially:

- Single user
- Local development
- Portfolio project

Future:

- Multiple users
- Cloud deployment
- Authentication

---

# Technology Stack (LOCKED)

Backend
- Django 5
- Django REST Framework
- Python 3.12+

Frontend
- React (Vite)
- Tailwind CSS
- Chart.js

Database
- PostgreSQL
- Django ORM

AI
- OpenAI Responses API
- Gemini support later

Testing
- pytest / Django Test Framework

Automation (Future)
- GitHub Actions

Browser Automation (Optional)
- Playwright

---

# Why Django?

The developer already has experience with:

- Django
- Django REST Framework
- React + Django
- JWT Authentication
- ORM
- PostgreSQL

The project focuses on AI architecture and software engineering rather than learning a new backend framework.

Do NOT replace Django with FastAPI unless explicitly requested.

---

# Architecture

                React Frontend
                       │
                       ▼
              Django REST API
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
 Planner Service  Review Service  Generator Service
        │              │              │
        └──────────────┼──────────────┘
                       ▼
               Analytics Service
                       │
                       ▼
                 Django ORM
                       │
                       ▼
                    PostgreSQL

LLM APIs are accessed only through dedicated service classes.

---

# Django Apps

backend/

planner/
generator/
reviewer/
analytics/
dashboard/
common/

Each app should have a single responsibility.

---

# Core Workflow

1. Planner determines today's task.
2. Generator creates question.
3. Store question.
4. User solves problem.
5. User uploads solution.
6. Reviewer evaluates solution.
7. Store review.
8. Analytics updates statistics.
9. Planner selects next topic.

---

# Database Models

Question
- topic
- title
- difficulty
- prompt
- created_at

Solution
- question
- source_code
- submitted_at

Review
- solution
- correctness
- score
- complexity
- edge_cases
- interview_feedback

Statistics
- streak
- average_score
- weakest_topic
- strongest_topic

---

# Coding Principles

- Clean Architecture
- Small reusable services
- Thin Views
- Business logic inside services
- ORM for database access
- Type hints where practical
- Environment variables for secrets
- Never hardcode API keys

---

# What Codex Should Do

- Preserve architecture.
- Build incrementally.
- Keep modules independent.
- Explain significant design choices.
- Prefer readability over cleverness.
- Reuse existing services instead of duplicating logic.

---

# What Codex Should NOT Do

- Introduce FastAPI.
- Introduce LangChain unless requested.
- Replace PostgreSQL.
- Mix business logic into prompts.
- Overengineer the MVP.

---

# Development Order

Phase 1
✔ Project Setup

Phase 2
✔ Database Models

Phase 3
✔ REST APIs

Phase 4
✔ Question Generator

Phase 5
✔ AI Reviewer

Phase 6
✔ Planner Service

Phase 7
✔ Dashboard

Phase 8
✔ Automation

Phase 9
✔ Testing
✔ Documentation

Never start a new phase until the previous phase is stable.

---

# Definition of Done

The project is considered complete when:

- Planner autonomously manages the learning workflow.
- AI reviews are stored and searchable.
- Dashboard accurately reflects learning progress.
- Codebase is modular and documented.
- A new developer can clone the repository, configure environment variables, and run the application successfully.

---

# North Star

Every architectural decision should answer one question:

**Does this make the AI mentor smarter, or does it merely make the codebase more complicated?**

If it only adds complexity, do not implement it.
