
# 02 System Design

## Architecture

User
↓
Planner Agent
├── Generator Agent
├── Reviewer Agent
├── Analytics
└── Memory Manager
        ↓
   LLM / SQLite / Dashboard

## Folder Structure

backend/
 agents/
 tools/
 api/
 models/
 prompts/
 tests/

frontend/
 src/
 components/

## Database

questions
solutions
reviews
statistics
topics

## API (initial)

GET /question/today
POST /question/generate
POST /solution
GET /dashboard
GET /statistics

## Agent Flow

Generate → Store → Solve → Review → Save → Analyze → Plan Next
