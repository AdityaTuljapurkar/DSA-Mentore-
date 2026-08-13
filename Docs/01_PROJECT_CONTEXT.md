
# 01 Project Context
## Vision
Build **DSA Mentor AI**, an autonomous mentor that generates DSA practice, reviews solutions, remembers progress, adapts future learning, and provides analytics.

## Goal
Engineering-first application. AI is one tool inside a modular architecture.

## MVP
1. Generate question
2. Store in SQLite
3. Upload solution
4. AI review
5. Store review
6. Planner chooses next topic
7. Dashboard updates

## Stack
Python, FastAPI, SQLite, SQLAlchemy, React, Tailwind, Chart.js, OpenAI Responses API.

## Principles
- Planner owns decisions
- SQLite is source of truth
- One module = one responsibility
- Simple > clever



<!-- • Keep it very simple:

  1. Fix the database connection so Django can save data.
  2. Make one page where you can:
      - Write a DSA question
      - Write your solution
      - Add a short remark
      - Click Save

  3. Show saved questions below the form.
  4. Test that saving works.
  5. After that, add AI feedback -->