# Fase 09 — Dashboard e Impacto

## Objetivo
Dashboard pessoal completo com gráficos: pontos por dia (30 dias), heatmap de estudo (estilo GitHub), barra de progresso do próximo bioma, comparativo com média da turma, CO₂ simbólico total, contador de plantios reais. Sistema de plantio real: a cada 100 árvores virtuais plantadas, registra automaticamente 1 árvore real plantada por ONG parceira, com certificado digital gerado.

## Pré-requisitos
- Fase 08 concluída — acessibilidade implementada
- Pelo menos 1 ONG parceira definida (pode ser mockada inicialmente: "SOS Mata Atlântica")

## Dependências a Instalar

```bash
npm install recharts date-fns
npm install @react-pdf/renderer
```

`recharts` para gráficos React; `date-fns` para manipulação de datas; `@react-pdf/renderer` para geração de certificados PDF.

## Schema Prisma

Adicionar ao `prisma/schema.prisma`:

```prisma
model RealPlanting {
  id                     String   @id @default(uuid())
  userId                 String   @map("user_id")
  ngoPartner             String   @db.VarChar(120) @map("ngo_partner")
  species                String   @db.VarChar(120)
  locationName           String?  @db.VarChar(200) @map("location_name")
  gpsLat                 Float?   @map("gps_lat")
  gpsLng                 Float?   @map("gps_lng")
  photoUrl               String?  @map("photo_url")
  certificateUrl         String?  @map("certificate_url")
  plantedAt              DateTime @map("planted_at")
  virtualTreesMilestone  Int      @map("virtual_trees_milestone")
  createdAt              DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("real_plantings")
}
```

Adicionar a `User`: `realPlantings RealPlanting[]`

Migration: `npm run db:migrate -- --name add-real-plantings`

## Tarefas

### Backend — Real Planting
- [ ] Adicionar model `RealPlanting` ao schema e rodar migration
- [ ] Criar `lib/real-planting/trigger.ts` com `checkAndCreateRealPlanting(userId)` que:
  - Conta árvores em `user_forest`
  - Se `count % 100 === 0` e não existe RealPlanting com mesmo milestone → cria
  - Escolhe ONG parceira aleatória de array mockado
  - Escolhe espécie real proporcional ao bioma mais comum do usuário
  - Gera coordenadas GPS mockadas dentro do Brasil (lat -33 a 5, lng -73 a -34)
  - Dispara notificação `real_planting`
  - Gera certificado PDF via service
- [ ] Criar `lib/real-planting/partners.ts` com array de parceiros mockados (SOS Mata Atlântica, Instituto Terra, etc.)
- [ ] Criar `lib/real-planting/certificate.ts` usando `@react-pdf/renderer` para PDF com:
  - Logo placeholder
  - Nome do aluno
  - Espécie plantada
  - Data e localização
  - ID único do certificado
- [ ] Chamar `checkAndCreateRealPlanting` em `app/api/forest/plant/route.ts` após cada plantio
- [ ] Criar `app/api/users/me/plantings/route.ts` (GET) — histórico de plantios reais
- [ ] Criar `app/api/plantings/[id]/certificate/route.ts` (GET) — retorna PDF

### Backend — Dashboard Stats
- [ ] Criar `lib/dashboard/aggregator.ts` com `getDashboardStats(userId)` retornando:
  - `points_history`: array dos últimos 30 dias com pontos por dia
  - `study_heatmap`: array dos últimos 90 dias com `blocks_read` por dia
  - `subject_mastery`: por matéria, % de blocos completados
  - `next_biome`: próximo bioma a desbloquear + pontos restantes
  - `best_study_hour`: hora do dia com mais PointEvents (insight)
  - `class_avg_points`: média dos colegas da turma (se aluno em turma)
  - `user_points`: total do usuário
  - `co2_kg`: cálculo de CO₂ via `lib/forest/co2.ts`
  - `real_plantings_count`: contagem de plantios reais
- [ ] Criar `app/api/dashboard/stats/route.ts` (GET) com cache de 5min via Next.js `revalidate`

### Frontend
- [ ] Refazer `app/(app)/dashboard/page.tsx` completo com layout em grid
- [ ] Criar `components/dashboard/PointsChart.tsx` — line chart com Recharts
- [ ] Criar `components/dashboard/StudyHeatmap.tsx` — heatmap 7×13 (90 dias) estilo GitHub
- [ ] Criar `components/dashboard/SubjectMasteryList.tsx` — barras de progresso por matéria
- [ ] Criar `components/dashboard/NextBiomeProgress.tsx` — barra com pontos restantes
- [ ] Criar `components/dashboard/ClassComparison.tsx` — usuário vs média da turma
- [ ] Criar `components/dashboard/InsightCard.tsx` — "Você estuda melhor às 21h"
- [ ] Criar `components/dashboard/CO2Card.tsx` — destacado com ícone de folha
- [ ] Criar `components/dashboard/RealPlantingsCard.tsx` — contador + link
- [ ] Criar `app/(app)/plantings/page.tsx` — lista de plantios reais com fotos e certificados
- [ ] Criar `components/plantings/PlantingCard.tsx` — card com data, espécie, GPS, botão download certificado
- [ ] Notificação especial ao atingir 100 árvores: modal grande com certificado preview

## Arquivos a Criar/Modificar

1. `prisma/schema.prisma` (modificar — model `RealPlanting`)
2. `lib/real-planting/trigger.ts` (criar)
3. `lib/real-planting/partners.ts` (criar)
4. `lib/real-planting/certificate.ts` (criar)
5. `app/api/users/me/plantings/route.ts` (criar)
6. `app/api/plantings/[id]/certificate/route.ts` (criar)
7. `app/api/forest/plant/route.ts` (modificar — chamar trigger)
8. `lib/dashboard/aggregator.ts` (criar)
9. `app/api/dashboard/stats/route.ts` (criar)
10. `app/(app)/dashboard/page.tsx` (modificar — refatoração completa)
11. `components/dashboard/PointsChart.tsx` (criar)
12. `components/dashboard/StudyHeatmap.tsx` (criar)
13. `components/dashboard/SubjectMasteryList.tsx` (criar)
14. `components/dashboard/NextBiomeProgress.tsx` (criar)
15. `components/dashboard/ClassComparison.tsx` (criar)
16. `components/dashboard/InsightCard.tsx` (criar)
17. `components/dashboard/CO2Card.tsx` (criar)
18. `components/dashboard/RealPlantingsCard.tsx` (criar)
19. `app/(app)/plantings/page.tsx` (criar)
20. `components/plantings/PlantingCard.tsx` (criar)
21. `components/plantings/CertificateModal.tsx` (criar)

## Comandos

```bash
npm install recharts date-fns @react-pdf/renderer

# Schema
npm run db:migrate -- --name add-real-plantings

# Verificar
npm run dev
# /dashboard → ver gráficos populados após algum tempo de uso
# Plantar 100 árvores (forçar via script dev) → ver certificado gerado
# /plantings → ver histórico

# Script de seed para dev: plantar 100 árvores rápido
# tests/dev/plant-100-trees.ts

# Testes
npm test -- dashboard
npm test -- real-planting

# Commit
git add .
git commit -m "fase-09: dashboard com analytics + plantios reais + certificados"
```

## Testes

- [ ] `tests/lib/real-planting/trigger.test.ts`:
  - 99 árvores → não cria RealPlanting
  - 100 árvores → cria; segundo trigger não duplica (idempotente por milestone)
  - 200 árvores → cria 2 (milestones 100 e 200)
- [ ] `tests/lib/real-planting/certificate.test.ts` — gera PDF; binário começa com `%PDF`
- [ ] `tests/lib/dashboard/aggregator.test.ts`:
  - `points_history` retorna 30 itens; dias sem eventos têm 0
  - `next_biome` retorna correto para user com 1200pts (próximo: Mata Atlântica)
  - `subject_mastery` calcula % correto baseado em `user_progress.completed`
  - `best_study_hour` retorna hora com mais point_events (mock dados)
- [ ] `tests/api/dashboard/stats.test.ts` — retorna todas as métricas; revalida a cada 5min
- [ ] `tests/api/users/plantings.test.ts` — lista plantios do usuário ordenados por data
- [ ] `tests/integration/100th-tree-flow.test.ts` — simular 100 plantios → RealPlanting criado + notificação

Comando: `npm test -- dashboard && npm test -- real-planting`

## Critérios de Aceitação

- [ ] Migration criou tabela `real_plantings`
- [ ] `/dashboard` exibe layout com 6+ cards/gráficos
- [ ] `PointsChart` mostra 30 dias de pontuação (line chart suave)
- [ ] `StudyHeatmap` mostra 90 dias com intensidade de cor por blocos lidos
- [ ] `NextBiomeProgress` mostra barra com pontos restantes até o próximo bioma
- [ ] `SubjectMasteryList` mostra % por matéria (com `ICTA13: 100%` se completou tudo)
- [ ] `ClassComparison` aparece se aluno está em turma; mostra "Você: 320 / Média: 280"
- [ ] `InsightCard` mostra horário mais produtivo (ex: "Você rende mais às 21h")
- [ ] `CO2Card` mostra estimativa total com tooltip educacional
- [ ] `RealPlantingsCard` mostra contador "0 árvores reais plantadas" inicialmente
- [ ] Ao atingir 100 árvores virtuais: modal com certificado + notificação
- [ ] `/plantings` lista todos os plantios reais com foto, GPS, espécie, certificado
- [ ] Click em "Baixar certificado" baixa PDF válido
- [ ] PDF contém nome do aluno, espécie, data, ONG parceira, ID único
- [ ] Cache de 5min no endpoint `/api/dashboard/stats` (recalcula com `revalidate`)
- [ ] Todos os testes da fase passam

## Tempo Estimado
3-5 dias

## Próxima Fase
→ [fase-10-deploy.md](./fase-10-deploy.md)
