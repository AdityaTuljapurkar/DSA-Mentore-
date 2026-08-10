
# 04 Engineering Decisions

Record every major technical decision.

---

## Decision Template

### Decision

### Date

### Context

### Options Considered

1.
2.
3.

### Chosen Solution

### Why

### Tradeoffs

### Future Revisit?

---

# Initial Decisions

## D-001

SQLite instead of MongoDB

Reason:
- Zero configuration
- Strong SQL skills
- Local development
- Excellent for MVP

---

## D-002

FastAPI instead of Django

Reason:
- Lightweight
- API-first
- Async support
- Better fit for AI services

---

## D-003

Planner Agent owns workflow

Reason:
Keeps business logic outside prompts and makes the system modular.
