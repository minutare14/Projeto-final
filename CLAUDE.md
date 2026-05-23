# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Reserva Florestal** — an edtech platform that turns dense academic content into gamified micro-learning. Students earn points by reading fragmented content blocks, answering checkpoints, and contributing to a community feed. Points are spent to plant real Brazilian native trees in a personal virtual forest, unlocking biomes (Caatinga → Cerrado → Mata Atlântica → Pantanal → Amazônia). AI validates community posts.

This is a **pre-implementation planning repository**. The source code has not been scaffolded yet. All specifications are defined in the docs below.

## Key Documents

| File | Purpose |
|---|---|
| `fases/README.md` | **Implementation roadmap — start here.** 11 sequential phase documents from setup to production |
| `sdd.md` | Full Spec-Driven Development document — source of truth for all technical decisions |
| `projeto.md` | Product vision, philosophy, and feature descriptions |
| `analise-features.md` | Analysis of 15 proposed features with implementation sketches |
| `design-thinking.md` | Design Thinking framework template for the project |
| `prisma/schema.prisma` | Complete Prisma schema (12 models, 2 enums) |
| `prisma/seed.ts` | Seed data: 5 biomes, 31 native trees with scientific data, ICTA13 subject with 5 content blocks |

## Implementation Phases

The full development roadmap is broken into 11 sequential phase documents in `/fases/`. Start at `fases/README.md` for the index, then execute `fase-00-setup.md` first. Each phase has its own acceptance criteria, tests (Vitest), and incremental Prisma migrations — verify all criteria before moving to the next.

| Phase | Topic | Days |
|---|---|---|
| 00 | Setup (Next.js + Vitest + co2 field) | 1-2 |
| 01 | Auth (NextAuth + bcrypt) | 3-4 |
| 02 | Content + scoring + streak | 5-7 |
| 03 | Forest + tree shop + CO₂ | 5-7 |
| 04 | Daily missions + achievements | 3-5 |
| 05 | Community feed + Claude validation | 5-7 |
| 06 | Notifications + fauna | 3-5 |
| 07 | Teacher mode + classes + mentorship | 7-10 |
| 08 | Accessibility (WCAG AA + TTS + dark mode) | 3-5 |
| 09 | Dashboard + real plantings + certificates | 3-5 |
| 10 | Deploy (Vercel + Railway + Sentry) | 2-3 |

## Planned Stack

- **Frontend:** Next.js 14 + Tailwind CSS + Zustand + KaTeX + react-markdown
- **Backend:** Node.js + Express (API at `/api/v1`)
- **Database:** PostgreSQL via Prisma ORM + PGVector for semantic search
- **Auth:** NextAuth.js (Google OAuth + email/password)
- **AI:** Claude API (Anthropic) — post validation + content import
- **Jobs:** node-cron for daily mission generation

## Database Commands

```bash
npm run db:migrate      # run pending migrations (prisma migrate dev)
npm run db:seed         # seed biomes, trees, ICTA13 content
npm run db:reset        # reset DB and re-seed (prisma migrate reset --force)
npm run db:studio       # open Prisma Studio UI
npm run generate        # regenerate Prisma client after schema changes
```

Requires `DATABASE_URL` in environment pointing to a PostgreSQL instance.

## Architecture Decisions Recorded in SDD

**Scoring system:** all point events are logged in `point_events` with a `source` field. Point deductions (tree purchases) are negative entries. The `total_points` on `users` is the authoritative balance — recomputable from `point_events` if needed.

**Idempotency:** `POST /blocks/:id/complete` and `POST /checkpoints/:id/answer` are idempotent by design. Second calls must not re-award points. Use `user_progress` as the guard.

**AI post validation:** asynchronous. Submitting a post returns immediately with `status: pending`. Claude API is called in background; result updates the post and triggers a notification.

**Tier gate on trees:** purchasing a tree requires BOTH `total_points >= tree.cost_points` AND `user.current_tier >= tree.tier_required`. The Pau-Brasil (lendário) is in Tier 3 (Mata Atlântica) but requires `tier_required = 5` — intentional design to make it a late-game goal.

**Teacher role:** `users.role` enum (`student | teacher | admin`). Teacher-only routes must be protected at the middleware level. Teachers can create subjects, blocks, and classes; the content importer calls Claude API to fragment raw text into blocks.

**Real planting trigger:** fires when `COUNT(user_forest WHERE user_id = ?) % 100 = 0` after any planting. Creates a `real_plantings` record and a notification.

## Seed Data Notes

The seed in `prisma/seed.ts` uses `upsert` throughout — safe to re-run. Content blocks for ICTA13 use deterministic string IDs (`icta13-block-1`, etc.) to make upserts reliable. Trees are upserted by positional index in the `TREES` array, so order matters — do not reorder entries.

Tree `co2_absorption_kg_year` defaults to `22.0` in the schema; the seed does not override it per species yet. When adding species-accurate values, update each tree entry in `seed.ts` directly.

## Features Not Yet in Schema

The following features from `sdd.md` are fully specified but not yet in `prisma/schema.prisma`. They are added **incrementally** in the phase that consumes them — do not add them all at once.

| Models | Added in Phase |
|---|---|
| `co2_absorption_kg_year` on `Tree` | Phase 00 |
| `daily_missions`, `achievements`, `user_achievements` | Phase 04 |
| `notifications`, `fauna_species`, `user_fauna` | Phase 06 |
| `UserRole` enum, `classes`, `class_enrollments`, `class_forest`, `mentorships` | Phase 07 |
| `preferences` on `User` | Phase 08 |
| `real_plantings` | Phase 09 |
