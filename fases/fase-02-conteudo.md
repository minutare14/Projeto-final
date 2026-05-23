# Fase 02 — Conteúdo e Pontuação

## Objetivo
Usuário consegue acessar a matéria ICTA13, ler os 5 micro-blocos de conteúdo com Markdown e fórmulas KaTeX, responder os checkpoints, ganhar pontos de forma idempotente, e ver seu streak diário sendo contabilizado.

## Pré-requisitos
- Fase 01 concluída — usuário autenticado consegue acessar `/dashboard`

## Dependências a Instalar

`react-markdown`, `remark-math`, `rehype-katex`, `katex` já estão instalados (Fase 00).

## Schema Prisma
Sem alterações. Os models `Subject`, `ContentBlock`, `Checkpoint`, `UserProgress`, `PointEvent` já estão prontos.

## Tarefas

### Backend (API Routes)
- [ ] Criar `lib/scoring/service.ts` com função `creditPoints(userId, source, amount, metadata?)` que insere em `point_events` e atualiza `users.total_points`
- [ ] Criar `lib/scoring/streak.ts` com `updateStreakOnLogin(userId)`: incrementa se `last_active` foi ontem, reseta para 1 se mais antigo
- [ ] Criar `lib/scoring/multiplier.ts` com `getStreakMultiplier(streakDays)` retornando `min(1 + days*0.1, 2.0)`
- [ ] Criar `app/api/subjects/route.ts` (GET) — lista todas matérias
- [ ] Criar `app/api/subjects/[code]/blocks/route.ts` (GET) — blocos + checkpoints + progresso do usuário autenticado
- [ ] Criar `app/api/blocks/[id]/complete/route.ts` (POST) — idempotente via `user_progress.completed`
- [ ] Criar `app/api/checkpoints/[id]/answer/route.ts` (POST) — recebe `{ option }`, retorna correção; idempotente em acertos
- [ ] Criar `app/api/points/track-time/route.ts` (POST) — valida `last_interaction_at <= 3min`, limita 30min/dia, credita 2pts/min
- [ ] Implementar bônus de módulo completo (+100) quando todos os blocos de um Subject são marcados como `completed = true`
- [ ] Adicionar middleware de autenticação em todas as routes da API
- [ ] Garantir que a pontuação é multiplicada pelo `streak_multiplier` no momento do crédito

### Frontend
- [ ] Criar `app/(app)/subjects/page.tsx` listando matérias disponíveis
- [ ] Criar `app/(app)/subjects/[code]/page.tsx` exibindo blocos sequencialmente
- [ ] Criar `components/content/ContentBlock.tsx` com `react-markdown` + `rehype-katex`
- [ ] Criar `components/content/Checkpoint.tsx` com seleção de alternativa + feedback visual
- [ ] Criar `components/ui/PointsToast.tsx` com animação de subida + fade
- [ ] Criar `components/ui/StreakBadge.tsx` (chama + número) exibido no header se `streakDays >= 2`
- [ ] Criar `components/ui/ProgressBar.tsx` para mostrar quantos blocos restam no módulo
- [ ] Criar hook `useTimeTracking()` que chama `/api/points/track-time` a cada 60s se houver interação
- [ ] Disparar `PointsToast` após cada evento de pontuação com mensagem contextual

## Arquivos a Criar/Modificar

1. `lib/scoring/service.ts` (criar)
2. `lib/scoring/streak.ts` (criar)
3. `lib/scoring/multiplier.ts` (criar)
4. `app/api/subjects/route.ts` (criar)
5. `app/api/subjects/[code]/blocks/route.ts` (criar)
6. `app/api/blocks/[id]/complete/route.ts` (criar)
7. `app/api/checkpoints/[id]/answer/route.ts` (criar)
8. `app/api/points/track-time/route.ts` (criar)
9. `app/(app)/subjects/page.tsx` (criar)
10. `app/(app)/subjects/[code]/page.tsx` (criar)
11. `components/content/ContentBlock.tsx` (criar)
12. `components/content/Checkpoint.tsx` (criar)
13. `components/ui/PointsToast.tsx` (criar)
14. `components/ui/StreakBadge.tsx` (criar)
15. `components/ui/ProgressBar.tsx` (criar)
16. `lib/hooks/useTimeTracking.ts` (criar)
17. `app/globals.css` (modificar — importar `katex/dist/katex.min.css`)

## Comandos

```bash
# Verificar
npm run dev
# Logar → /subjects → ICTA13 → ler bloco 1 → responder checkpoint
# Total esperado após completar todos 5 blocos: 5×10 + 5×20 + 100 = 250pts

# Testes
npm test -- scoring
npm test -- api/blocks
npm test -- api/checkpoints

# Commit
git add .
git commit -m "fase-02: conteúdo + pontuação + streak"
```

## Testes

- [ ] `tests/lib/scoring/service.test.ts` — creditar pontos cria PointEvent e atualiza User.totalPoints
- [ ] `tests/lib/scoring/streak.test.ts` — last_active ontem → streak++; >1 dia → reset para 1
- [ ] `tests/lib/scoring/multiplier.test.ts` — 0 dias → 1.0; 5 dias → 1.5; 15 dias → 2.0 (cap)
- [ ] `tests/api/blocks/complete.test.ts` — 1ª chamada credita 10pts; 2ª chamada não credita (idempotente)
- [ ] `tests/api/checkpoints/answer.test.ts` — opção correta credita 20pts; opção errada retorna explicação sem deduzir; reanswer após acerto não credita
- [ ] `tests/api/points/track-time.test.ts` — `last_interaction_at` > 3min atrás → 400; ok → +2pts; máx 30 chamadas/dia
- [ ] `tests/integration/icta13-flow.test.ts` — completar todos 5 blocos + 5 checkpoints = 250pts (com bônus de módulo)

Comando: `npm test -- scoring && npm test -- api`

## Critérios de Aceitação

- [ ] `/subjects` lista a matéria ICTA13 com card clicável
- [ ] `/subjects/ICTA13` exibe os 5 blocos em ordem com Markdown renderizado corretamente
- [ ] Fórmula LaTeX do bloco 2 renderiza visualmente (vetor coluna)
- [ ] Bloco completo muda visualmente para "lido" (check verde) e não credita pontos em re-clique
- [ ] Checkpoint correto credita 20 pontos e mostra `<PointsToast>`
- [ ] Checkpoint errado mostra explicação gentil sem deduzir pontos
- [ ] Streak no header exibe chama animada após 2º dia consecutivo
- [ ] Bônus de módulo (+100) é creditado ao completar todos os 5 blocos do ICTA13
- [ ] Tempo ativo é registrado em `point_events` com source `time_active`
- [ ] Após completar tudo: `users.total_points = 250` (5×10 + 5×20 + 100)
- [ ] Todos os testes da fase passam

## Tempo Estimado
5-7 dias

## Próxima Fase
→ [fase-03-floresta.md](./fase-03-floresta.md)
