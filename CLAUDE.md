# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Reserva Florestal** — Gamified micro-learning platform where students earn points by reading content blocks, answering checkpoints, and contributing to a virtual forest. Points unlock biomes (Caatinga → Cerrado → Mata Atlântica → Pantanal → Amazônia) and fund real tree plantings via partner NGOs. AI (Claude API) validates community posts.

Stack: **Next.js 14 + Tailwind CSS + Zustand** (frontend), **Node.js + Express** (API at `/api/v1`), **PostgreSQL + Prisma**, **NextAuth.js**, **Claude API** (post validation + content import).

## Key Documents

| File | Purpose |
|---|---|
| `fases/README.md` | **Start here.** 11-phase implementation roadmap from setup to deploy |
| `sdd.md` | Full technical spec — source of truth for data models, APIs, business rules |
| `projeto.md` | Product vision and feature descriptions |
| `analise-features.md` | Feature analysis with implementation sketches |
| `prisma/schema.prisma` | Database schema (12 models, 2 enums) |
| `prisma/seed.ts` | Seed: 5 biomes, 31 native trees, 1 subject (ICTA13) with 5 blocks |

## Development Commands

```bash
npm run dev          # Next.js dev server (http://localhost:3000)
npm run build        # Production build
npm run db:migrate   # Run Prisma migrations (prisma migrate dev)
npm run db:seed      # Seed biomes, trees, ICTA13 content
npm run db:reset     # Reset DB and re-seed
npm run db:studio    # Open Prisma Studio
npx prisma generate  # Regenerate Prisma client after schema changes
```

Requires `DATABASE_URL` pointing to a PostgreSQL instance. Copy `.env.example` to `.env` and fill in credentials.

## Architecture

### Folder Structure

```
app/                    # Next.js App Router (pages + API routes)
components/             # React components
lib/                    # Services, utilities, AI integrations
  └── ai/               # Claude API agents (post validator, content importer)
prisma/                 # Schema, migrations, seed
public/                 # Static assets (tree illustrations, fauna sprites)
tests/                  # Vitest unit + integration tests
fases/                  # 11-phase development roadmap
docs/                   # Planning documents
```

### Key Design Patterns

**Scoring:** All point events logged in `point_events` with `source` field. `users.total_points` is authoritative balance — recomputable from `point_events`.

**Idempotency:** `POST /blocks/:id/complete` and `POST /checkpoints/:id/answer` are idempotent. Use `user_progress` as guard to prevent double-crediting.

**AI post validation:** Async. Submit returns `status: pending` immediately. Claude API called in background; result updates post and triggers notification.

**Tier gate on trees:** Purchase requires BOTH `total_points >= cost` AND `current_tier >= tier_required`. Pau-Brasil (lendário) requires `tier_required = 5` despite being in Tier 3 biome — intentional late-game goal.

**Role-based access:** `users.role` enum (`student | teacher | admin`). Teacher-only routes protected at middleware level.

**Real planting trigger:** Fires when `COUNT(user_forest WHERE user_id = ?) % 100 = 0` after any planting.

## Database Models

Core entities: `User`, `Biome`, `Tree`, `UserForest`, `UserBiome`, `Subject`, `ContentBlock`, `Checkpoint`, `UserProgress`, `Post`, `PostLike`, `PointEvent`.

Models added incrementally per phase (not all in initial schema): `DailyMission`, `Achievement`, `UserAchievement` (Phase 04), `Notification`, `FaunaSpecies`, `UserFauna` (Phase 06), `Class`, `ClassEnrollment`, `ClassForest`, `Mentorship` (Phase 07), `RealPlanting` (Phase 09).

## Seed Data Notes

Seed uses `upsert` throughout — safe to re-run. Content blocks use deterministic string IDs (`icta13-block-1`, etc.) for reliable upserts. Trees are upserted by positional index — **do not reorder** tree entries in `seed.ts`.

`co2_absorption_kg_year` on trees defaults to `22.0` in schema; seed does not yet set per-species values.

## API Base URL

`/api/v1` — all API routes under this prefix.

## Implementation Phases

Development is sequential. Start at `fases/fase-00-setup.md`. Each phase has acceptance criteria and tests — verify all pass before advancing.

| Phase | Focus |
|---|---|
| 00 | Setup: Next.js + Vitest + initial schema field |
| 01 | Auth: NextAuth + bcrypt |
| 02 | Content + scoring + streak |
| 03 | Forest + tree shop + CO₂ |
| 04 | Daily missions + achievements |
| 05 | Community feed + Claude AI validation |
| 06 | Notifications + fauna |
| 07 | Teacher mode + classes + mentorship |
| 08 | Accessibility: WCAG AA + TTS + dark mode |
| 09 | Dashboard + real plantings + certificates |
| 10 | Deploy: Vercel + Railway + Sentry |