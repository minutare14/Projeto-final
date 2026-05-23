# Fase 04 — Missões e Conquistas

## Objetivo
3 missões diárias são geradas para cada usuário ativo às 00:01, exibidas no dashboard, com progresso atualizado em tempo real conforme o usuário age. Achievements (conquistas) são desbloqueadas automaticamente quando o usuário atinge marcos pré-definidos (1ª árvore, tier 3, 100 árvores, etc.) e exibidas em uma galeria.

## Pré-requisitos
- Fase 03 concluída — plantio funcional, biomas desbloqueando, PointEvents fluindo

## Dependências a Instalar

```bash
npm install node-cron canvas-confetti
npm install -D @types/node-cron @types/canvas-confetti
```

## Schema Prisma

Adicionar ao `prisma/schema.prisma`:

```prisma
model DailyMission {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  type         String   @db.VarChar(40)
  target       Int
  progress     Int      @default(0)
  rewardPoints Int      @map("reward_points")
  rewardType   String   @default("points") @map("reward_type")
  completed    Boolean  @default(false)
  expiresAt    DateTime @map("expires_at")
  createdAt    DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, expiresAt])
  @@map("daily_missions")
}

model Achievement {
  id          Int    @id @default(autoincrement())
  code        String @unique @db.VarChar(60)
  name        String @db.VarChar(120)
  description String
  iconUrl     String? @map("icon_url")
  criteria    Json

  users UserAchievement[]
  @@map("achievements")
}

model UserAchievement {
  userId        String   @map("user_id")
  achievementId Int      @map("achievement_id")
  unlockedAt    DateTime @default(now()) @map("unlocked_at")

  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievement Achievement @relation(fields: [achievementId], references: [id])
  @@id([userId, achievementId])
  @@map("user_achievements")
}
```

Adicionar a `User` o reverse: `missions DailyMission[]` e `achievements UserAchievement[]`.

Migration: `npm run db:migrate -- --name add-missions-achievements`

## Tarefas

### Backend
- [ ] Adicionar models ao schema e rodar migration
- [ ] Atualizar `prisma/seed.ts` com 9 achievements: `first_seed`, `caatinga_guardian`, `tier_3`, `curator`, `pollinator`, `century_reserve`, `legendary_one`, `week_streak`, `thousand_points`
- [ ] Criar `lib/missions/generator.ts` com `generateDailyMissions(userId)` que escolhe 3 missões aleatórias do pool (read_blocks, answer_checkpoints, plant_tree, social_like, post_resolution, visit_forest)
- [ ] Criar `lib/missions/tracker.ts` com `incrementMissionProgress(userId, type, delta)` que atualiza missões ativas
- [ ] Integrar tracker em todos os pontos relevantes: `creditPoints`, plantio, like (a ser adicionado na fase 05 — preparar hook)
- [ ] Criar `lib/cron/daily-missions.ts` que roda diariamente às 00:01 para todos usuários ativos nos últimos 7 dias
- [ ] Inicializar cron job em `instrumentation.ts` (Next.js 14 hook de bootstrap)
- [ ] Criar `app/api/missions/today/route.ts` (GET) — retorna missões do dia com progresso
- [ ] Criar `lib/achievements/checker.ts` com `checkAchievements(userId)` que verifica todos os critérios pendentes
- [ ] Implementar suporte aos tipos de critério: `tree_count`, `tree_count_by_biome`, `tier_reached`, `total_points`, `streak_days`, `post_approved`, `likes_received`, `rarity_owned`
- [ ] Chamar `checkAchievements(userId)` após eventos relevantes (plantio, post aprovado — fase 05, mudança de streak)
- [ ] Creditar +25 pts ao desbloquear cada achievement
- [ ] Criar `app/api/achievements/route.ts` (GET) — lista todos + status do usuário autenticado
- [ ] Criar `app/api/users/[id]/achievements/route.ts` (GET) — achievements de um perfil público

### Frontend
- [ ] Criar `app/(app)/missions/page.tsx` — missões do dia + histórico
- [ ] Criar `app/(app)/achievements/page.tsx` — galeria com desbloqueadas e bloqueadas (silhueta)
- [ ] Criar `components/missions/MissionCard.tsx` — barra de progresso animada, contador de expiração
- [ ] Criar `components/achievements/AchievementBadge.tsx` — ícone + nome + estado (locked/unlocked)
- [ ] Criar `components/ui/CelebrationToast.tsx` com `canvas-confetti` para desbloqueio de achievement
- [ ] Adicionar widget de "Missões de Hoje" ao `/dashboard`
- [ ] Exibir achievements desbloqueados no perfil público (`/forest/[userId]` da Fase 03)

## Arquivos a Criar/Modificar

1. `prisma/schema.prisma` (modificar — 3 novos models)
2. `prisma/seed.ts` (modificar — adicionar 9 achievements)
3. `lib/missions/generator.ts` (criar)
4. `lib/missions/tracker.ts` (criar)
5. `lib/cron/daily-missions.ts` (criar)
6. `instrumentation.ts` (criar — bootstrap do cron)
7. `app/api/missions/today/route.ts` (criar)
8. `lib/achievements/checker.ts` (criar)
9. `lib/achievements/criteria.ts` (criar — implementações por tipo)
10. `app/api/achievements/route.ts` (criar)
11. `app/api/users/[id]/achievements/route.ts` (criar)
12. `app/(app)/missions/page.tsx` (criar)
13. `app/(app)/achievements/page.tsx` (criar)
14. `components/missions/MissionCard.tsx` (criar)
15. `components/achievements/AchievementBadge.tsx` (criar)
16. `components/ui/CelebrationToast.tsx` (criar)
17. `app/(app)/dashboard/page.tsx` (modificar — adicionar widget de missões)
18. `app/forest/[userId]/page.tsx` (modificar — exibir achievements)

## Comandos

```bash
npm install node-cron canvas-confetti
npm install -D @types/node-cron @types/canvas-confetti

# Schema
npm run db:migrate -- --name add-missions-achievements
npm run db:seed   # re-seed para adicionar achievements

# Verificar
npm run dev
# Plantar 1ª árvore → achievement first_seed desbloqueia com confetti
# Forçar geração de missões via endpoint dev `/api/dev/generate-missions`

# Testes
npm test -- missions
npm test -- achievements

# Commit
git add .
git commit -m "fase-04: missões diárias + achievements"
```

## Testes

- [ ] `tests/lib/missions/generator.test.ts` — gera exatamente 3 missões, targets dentro dos ranges, expires_at no fim do dia
- [ ] `tests/lib/missions/tracker.test.ts` — incrementar progresso de tipo `plant_tree` em missão ativa funciona; missão completada credita pontos e marca `completed`
- [ ] `tests/lib/achievements/checker.test.ts` — desbloqueio idempotente (chamar 2x não duplica); critério `tree_count: 1` desbloqueia first_seed
- [ ] `tests/lib/achievements/criteria.test.ts` — cada tipo de critério avalia corretamente (mock de prisma)
- [ ] `tests/api/missions/today.test.ts` — retorna missões do dia atual ordenadas; missões expiradas filtradas
- [ ] `tests/api/achievements.test.ts` — lista com flag `unlocked: boolean` correta por user
- [ ] `tests/integration/first-seed-flow.test.ts` — plantar 1ª árvore → achievement first_seed desbloqueado → +25 pts

Comando: `npm test -- missions && npm test -- achievements`

## Critérios de Aceitação

- [ ] Após rodar migration, tabelas `daily_missions`, `achievements`, `user_achievements` existem
- [ ] Seed criou 9 achievements visíveis no Prisma Studio
- [ ] Plantar 1ª árvore desbloqueia achievement `first_seed` com toast de confetti + +25 pts
- [ ] `/achievements` lista 9 cards; desbloqueados coloridos, bloqueados como silhueta
- [ ] `/missions` mostra 3 missões do dia com barras de progresso
- [ ] Plantar uma árvore atualiza progresso da missão `plant_tree` em tempo real
- [ ] Completar missão credita os pontos e exibe badge "Concluída"
- [ ] Widget de missões aparece no `/dashboard`
- [ ] Atingir 1000 pontos desbloqueia `thousand_points` automaticamente
- [ ] Cron de geração de missões dispara à 00:01 (testável manualmente via endpoint dev)
- [ ] Todos os testes da fase passam

## Tempo Estimado
3-5 dias

## Próxima Fase
→ [fase-05-comunidade.md](./fase-05-comunidade.md)
