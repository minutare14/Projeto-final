# Fase 06 — Notificações e Fauna

## Objetivo
Sistema de notificações central com bell no header e badge de não lidas. Notificações são criadas automaticamente em eventos-chave (desbloqueio de bioma, achievement, post aprovado/rejeitado, like recebido, fauna desbloqueada). Animais nativos brasileiros aparecem visitando a reserva conforme o aluno planta combinações específicas de árvores.

## Pré-requisitos
- Fase 05 concluída — comunidade e IA funcionando

## Dependências a Instalar

Sem novas dependências (animações com framer-motion ou CSS nativo).

```bash
npm install framer-motion
```

## Schema Prisma

Adicionar ao `prisma/schema.prisma`:

```prisma
model Notification {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  type      String   @db.VarChar(40)
  title     String   @db.VarChar(120)
  body      String
  link      String?
  readAt    DateTime? @map("read_at")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, readAt, createdAt])
  @@map("notifications")
}

model FaunaSpecies {
  id           Int    @id @default(autoincrement())
  name         String @db.VarChar(100)
  scientific   String? @db.VarChar(120)
  description  String
  spriteUrl    String @map("sprite_url")
  triggerLogic Json   @map("trigger_logic")

  unlocked UserFauna[]
  @@map("fauna_species")
}

model UserFauna {
  userId     String   @map("user_id")
  faunaId    Int      @map("fauna_id")
  unlockedAt DateTime @default(now()) @map("unlocked_at")

  user  User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  fauna FaunaSpecies @relation(fields: [faunaId], references: [id])
  @@id([userId, faunaId])
  @@map("user_fauna")
}
```

Adicionar a `User`: `notifications Notification[]` e `fauna UserFauna[]`.

Migration: `npm run db:migrate -- --name add-notifications-fauna`

## Tarefas

### Backend
- [ ] Adicionar models ao schema e rodar migration
- [ ] Expandir `prisma/seed.ts` com 6 espécies iniciais de fauna:
  - Borboleta-Morpho (Mata Atlântica, 3 árvores no bioma 3)
  - Arara-Azul-de-Lear (Mandacaru + Xique-Xique, mín 2)
  - Cutia (Castanheira-do-Pará, mín 1)
  - Tucano (5 árvores frutíferas: Pequi, Buriti, Cagaita, Açaí, Umbu)
  - Lobo-Guará (Cerrado, 4 árvores no bioma 2)
  - Onça-Pintada (Amazônia, 10 árvores no bioma 5)
- [ ] Criar `lib/notifications/service.ts` com `createNotification(userId, type, title, body, link?)`
- [ ] Implementar regra anti-spam: máx 1 notificação do mesmo `type` por dia
- [ ] Disparar notificações em pontos-chave:
  - Bioma desbloqueado (em `lib/biome/unlock.ts`)
  - Achievement desbloqueado (em `lib/achievements/checker.ts`)
  - Post aprovado/rejeitado (em `lib/ai/post-validator.ts`)
  - Like recebido (em `app/api/posts/[id]/like/route.ts`)
- [ ] Criar `lib/fauna/checker.ts` com `checkFaunaUnlocks(userId)` rodando após cada plantio
- [ ] Implementar avaliação de `triggerLogic` para os tipos:
  - `tree_count_by_ids` (ex: arara-azul precisa de IDs específicos)
  - `tree_count_by_biome` (ex: lobo-guará precisa de N árvores no Cerrado)
  - `tree_count_by_category` (ex: tucano precisa de árvores marcadas como frutíferas)
- [ ] Disparar notificação ao desbloquear fauna
- [ ] Criar `app/api/notifications/route.ts` (GET) — paginado, mais recentes primeiro
- [ ] Criar `app/api/notifications/[id]/read/route.ts` (PATCH) — marca uma como lida
- [ ] Criar `app/api/notifications/read-all/route.ts` (PATCH) — marca todas como lidas
- [ ] Criar `app/api/users/[id]/fauna/route.ts` (GET) — fauna desbloqueada de um perfil público

### Frontend
- [ ] Criar `components/notifications/NotificationBell.tsx` no header
- [ ] Criar `components/notifications/NotificationDropdown.tsx` — 5 mais recentes
- [ ] Criar `components/notifications/NotificationItem.tsx` — ícone por tipo, título, body, link
- [ ] Criar `app/(app)/notifications/page.tsx` — lista completa paginada
- [ ] Criar `components/forest/FaunaSprite.tsx` — sprite animado cruzando o `<ForestMap>`
- [ ] Implementar lógica de aparição aleatória de fauna no mapa (intervalos de 30-90s)
- [ ] Clique em fauna mostra modal com nome, nome científico, descrição ecológica
- [ ] Criar `components/forest/FaunaGallery.tsx` no perfil público listando fauna descoberta
- [ ] Polling do contador de não lidas a cada 30s (ou WebSocket — fica como TODO)
- [ ] Adicionar achievement extra `wildlife_friend`: desbloquear 5 espécies de fauna

## Arquivos a Criar/Modificar

1. `prisma/schema.prisma` (modificar — 3 novos models)
2. `prisma/seed.ts` (modificar — adicionar 6 fauna species)
3. `lib/notifications/service.ts` (criar)
4. `lib/notifications/types.ts` (criar — definições de tipos de notificação)
5. `lib/fauna/checker.ts` (criar)
6. `lib/fauna/triggers.ts` (criar — implementação por tipo)
7. `app/api/notifications/route.ts` (criar)
8. `app/api/notifications/[id]/read/route.ts` (criar)
9. `app/api/notifications/read-all/route.ts` (criar)
10. `app/api/users/[id]/fauna/route.ts` (criar)
11. `app/(app)/notifications/page.tsx` (criar)
12. `components/notifications/NotificationBell.tsx` (criar)
13. `components/notifications/NotificationDropdown.tsx` (criar)
14. `components/notifications/NotificationItem.tsx` (criar)
15. `components/forest/FaunaSprite.tsx` (criar)
16. `components/forest/FaunaGallery.tsx` (criar)
17. `components/Header.tsx` (modificar — incluir NotificationBell)
18. `lib/biome/unlock.ts` (modificar — disparar notificação)
19. `lib/achievements/checker.ts` (modificar — disparar notificação)
20. `lib/ai/post-validator.ts` (modificar — disparar notificação)
21. `app/api/posts/[id]/like/route.ts` (modificar — disparar notificação)
22. `app/api/forest/plant/route.ts` (modificar — chamar checkFaunaUnlocks)
23. `public/sprites/fauna/*.svg` (criar 6 sprites)

## Comandos

```bash
npm install framer-motion

# Schema
npm run db:migrate -- --name add-notifications-fauna
npm run db:seed   # re-seed para popular fauna_species

# Verificar
npm run dev
# Plantar Mandacaru + Xique-Xique → notificação de Arara-Azul + sprite aparece no mapa
# Atingir 500 pts → notificação de desbloqueio do Cerrado
# Like em post de outro user → autor recebe notificação

# Testes
npm test -- notifications
npm test -- fauna

# Commit
git add .
git commit -m "fase-06: notificações + fauna visitante"
```

## Testes

- [ ] `tests/lib/notifications/service.test.ts` — cria notificação; anti-spam bloqueia segunda do mesmo tipo no dia
- [ ] `tests/lib/fauna/checker.test.ts` — usuário com Mandacaru + Xique-Xique desbloqueia arara-azul; idempotente
- [ ] `tests/lib/fauna/triggers.test.ts` — cada tipo de trigger (`by_ids`, `by_biome`, `by_category`) avalia corretamente
- [ ] `tests/api/notifications/list.test.ts` — paginação funciona; ordem por created_at DESC
- [ ] `tests/api/notifications/read.test.ts` — read marca read_at; read-all marca todas em um update
- [ ] `tests/integration/biome-unlock-flow.test.ts` — atingir 500pts dispara desbloqueio + notificação
- [ ] `tests/integration/fauna-flow.test.ts` — plantar combinação correta dispara desbloqueio + notificação

Comando: `npm test -- notifications && npm test -- fauna`

## Critérios de Aceitação

- [ ] Tabelas `notifications`, `fauna_species`, `user_fauna` criadas
- [ ] Seed populou 6 espécies de fauna
- [ ] Bell no header exibe contador de não lidas em vermelho
- [ ] Click no bell abre dropdown com 5 últimas notificações
- [ ] Click em notificação marca como lida e navega para o link (se houver)
- [ ] `/notifications` lista todas com paginação
- [ ] "Marcar todas como lidas" funciona
- [ ] Plantar Mandacaru + Xique-Xique desbloqueia arara-azul: notificação + sprite animado no mapa
- [ ] Sprite de fauna aparece aleatoriamente no `<ForestMap>` cruzando a tela
- [ ] Click em fauna abre modal com info
- [ ] Galeria de fauna no perfil público mostra animais descobertos
- [ ] Achievement `wildlife_friend` desbloqueia ao atingir 5 espécies
- [ ] Anti-spam: plantar 10 árvores do Cerrado em sequência gera 1 notificação (não 10)
- [ ] Todos os testes da fase passam

## Tempo Estimado
3-5 dias

## Próxima Fase
→ [fase-07-professor.md](./fase-07-professor.md)
