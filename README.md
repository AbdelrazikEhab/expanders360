# Expanders360 — Global Expansion Management API

A hiring-quest implementation using **NestJS + MySQL (TypeORM) + MongoDB (Mongoose)** with JWT auth, RBAC, vendor matching, cross-DB analytics, scheduling, notifications, Docker, and seeds.

## Quick Start

```bash
# 1) Clone and enter
npm i
# 2) Prepare env
cp  .env
# 3) Start infra (MySQL + Mongo + API)
docker compose up -d --build
# OR run locally (ensure MySQL+Mongo are running and .env is set)
npm run build && npm run start:dev
```

### Database Setup

```bash
# Run TypeORM migrations
npm run migration:run

# Seed MySQL
npm run seed:mysql

# Seed Mongo
npm run seed:mongo
```

Default accounts:

- Admin: `admin@expanders360.com` / `Admin123!`
- Client: `client@acme.com` / `Client123!`

### API Overview

- `POST /auth/register` — register a client `{ email, password, company_name }`
- `POST /auth/login` — login, returns JWT

- `POST /projects` — create project (client/admin)
- `GET /projects/:id` — get project
- `GET /projects/client/:clientId` — list by client

- `POST /vendors` — create vendor (admin)
- `GET /vendors` — list vendors (admin)

- `POST /projects/:id/matches/rebuild` — rebuild matches for project (client/admin)

- `POST /documents` — upload research doc (client/admin)
- `GET /documents/search?projectId=&tag=&text=` — query docs

- `GET /analytics/top-vendors` — **admin-only**: top 3 vendors per country (avg match score in last 30d) + research doc counts by country

### Matching Rules

- Vendors must **support the project country**
- Must have **at least one service overlap**
- **Score** = `services_overlap * 2 + rating + SLA_weight`
  - `SLA_weight`: `3` if `<= 24h`, `1` if `<= 72h`, else `0`
- Matches are **upserted** (unique `projectId + vendorId`)

### Scheduling

- Daily cron (`03:00`) refreshes matches for **active** projects and flags vendors with expired SLAs.

### Notifications

- On new match creation, an email is sent (mocked to console if SMTP env not provided).

### Tech

- NestJS 10, TypeScript
- MySQL 8 + TypeORM
- MongoDB 7 + Mongoose
- JWT Auth, Passport
- Nest Schedule
- Docker + Compose

### Notes

- Arrays are stored as MySQL JSON columns (`services_needed`, `countries_supported`, `services_offered`).
- The JSON membership check uses a portable fallback in the query builder.
- For a real deployment, add indexing on frequently-filtered fields and text indexes in Mongo.

### Deployment

- The app container builds with the included `Dockerfile`.
- Provide `.env` values (see `.env.example`).

---

**Demo script**: After seeding, login as admin, create an extra vendor or project, call rebuild matches, add documents, and hit analytics endpoint.

Enjoy & good luck! 🚀
