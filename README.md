# KukaLog

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-D71F00?logo=python&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

**Industrial robot incident logging system** for KUKA KRC2 robot cells — a web application for production floor operators and maintenance engineers to log, search, and analyze robot incidents (stoppages, hardware failures, software errors) in a manufacturing environment.

## What it does

KukaLog gives maintenance teams a structured way to record what went wrong with a robot cell, what fixed it, and how long the line was down — instead of scattering that knowledge across paper logs or chat messages. Every incident captures the robot/controller/cell/line, the error code and category, symptoms, root cause, the solution applied, and downtime in minutes, so the same failure can be diagnosed faster the next time it happens.

The seed data (`backend/seed_public.py`) ships with **anonymized, realistic sample incidents** for KRC2-class robots (screen failures, drive/axis faults, power supply issues, etc.) — no real plant, company, or personnel data is included.

## Features

- **Incident logging** — structured records: operator, engineer, shift, robot type, controller, cell, line, error code, category, priority, symptoms, root cause, solution, downtime
- **Search & filtering** — full-text search plus filters by status, priority, category, controller, line, robot type, error code, operator, engineer, and cell
- **Statistics dashboard** — totals by status, average downtime, top error codes, top affected robots, breakdowns by category/priority/controller, and a weekly incident trend
- **REST API** — FastAPI backend with auto-generated OpenAPI docs

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI, SQLAlchemy, Pydantic v2, Uvicorn |
| Database | SQLite |
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Charts | Recharts |
| Containerization | Docker, Docker Compose |

## Architecture

```
┌────────────────┐        REST/JSON        ┌───────────────────┐
│  Next.js (SSR)  │  ───────────────────▶  │  FastAPI backend  │
│  frontend:3080  │  ◀───────────────────  │  backend:8002      │
└────────────────┘                         └─────────┬─────────┘
                                                       │ SQLAlchemy
                                                       ▼
                                              SQLite (kukalog.db)
```

The frontend is a Next.js app that calls the backend's REST API (`/api/incidents`, `/api/stats`) via `NEXT_PUBLIC_API_URL`. The backend exposes CRUD endpoints for incidents plus an aggregated stats endpoint, backed by a SQLite database managed through SQLAlchemy models.

## Getting Started

### Option A — Docker Compose (recommended)

```bash
docker compose up --build
```

- Frontend: http://localhost:3080
- Backend API: http://localhost:8002
- Interactive API docs (Swagger UI): http://localhost:8002/docs

### Option B — Run locally

**Backend**

```bash
cd backend
pip install -r requirements.txt
python main.py          # starts FastAPI on http://localhost:8002
```

**Seed demo data**

```bash
# from backend/, with the API running
python seed_public.py
# or, with the API running, trigger via HTTP:
curl -X POST http://localhost:8002/api/seed
```

**Frontend**

```bash
cd frontend
npm install
npm run dev              # starts Next.js on http://localhost:3000
```

Set `NEXT_PUBLIC_API_URL` (e.g. in `frontend/.env.local`) if the backend isn't at the default `http://localhost:8002`.

## Project Structure

```
├── backend/
│   ├── main.py            # FastAPI app & routes
│   ├── database.py         # SQLAlchemy engine, session, Incident model
│   ├── crud.py             # Query/filter/aggregation logic
│   ├── schemas.py           # Pydantic request/response models
│   ├── seed.py / seed_public.py  # Demo data generators (public = anonymized)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/app/            # Next.js App Router pages (dashboard, incidents, search)
│   ├── src/components/     # Sidebar, StatsCard, StatusBadge
│   ├── src/lib/api.ts       # Typed API client
│   └── Dockerfile
├── docs/                    # Project documentation (PDF/LaTeX)
├── docker-compose.yml
└── README.md
```

## License

MIT

## Autor

**Miguel Serra Ferrando** — Telecommunications Engineer
[GitHub](https://github.com/megatron54) · [LinkedIn](https://www.linkedin.com/in/miguel-serra-ferrando) · [Email](mailto:miguel.serra.ferrando@gmail.com)
