# Fase 05 — Comunidade e IA

## Objetivo
Alunos publicam resoluções de exercícios no feed. A IA Claude analisa cada post automaticamente em background. Posts aprovados aparecem no feed público e creditam +50pts + bônus de relevância. Posts rejeitados ficam privados com feedback pedagógico. O leaderboard de pontos e biodiversidade está funcional.

## Pré-requisitos
- Fase 04 concluída — pontuação, missões e achievements operando
- Conta na Anthropic com `ANTHROPIC_API_KEY` válido

## Dependências a Instalar

```bash
npm install @anthropic-ai/sdk
```

## Schema Prisma
Sem alterações. Models `Post`, `PostLike`, enum `PostStatus` já existem.

## Tarefas

### Backend — IA
- [ ] Configurar `ANTHROPIC_API_KEY` no `.env.local` e `.env.example`
- [ ] Criar `lib/ai/client.ts` com client `Anthropic` configurado
- [ ] Criar `lib/ai/prompts/post-validator.ts` com system prompt do SDD seção 6.1
- [ ] Criar `lib/ai/post-validator.ts` com função `validatePost(postId, body, subjectName)`
  - Chama Claude com modelo `claude-sonnet-4-6`
  - Faz parse do JSON retornado (status, justificativa, bonus_relevancia, dica_botanica)
  - Atualiza `posts` com resultado
  - Se aprovado: credita +50 + bonus, `is_public = true`, dispara achievement `curator`
  - Se reprovado: `is_public = false`, mantém `ai_feedback` privado
- [ ] Criar fila simples em memória ou usar `setTimeout` em background (para MVP)
- [ ] Tratar timeouts (máx 30s); em erro, manter status `pending` e logar

### Backend — API
- [ ] Criar `app/api/posts/route.ts` (POST) — submete; credita +15 imediatamente; dispara validação assíncrona
- [ ] Criar `app/api/posts/route.ts` (GET) — lista paginada com `is_public = true`, filtro por `subject_id`
- [ ] Criar `app/api/posts/[id]/route.ts` (GET) — detalhe; inclui `ai_feedback` apenas se `authorId === session.user.id`
- [ ] Criar `app/api/posts/[id]/like/route.ts` (POST) — toggle like idempotente; atualiza `likes_count`; credita +10pts ao autor (uma vez por like, removível)
- [ ] Criar `app/api/ranking/route.ts` (GET) — query param `type=points|biodiversity`
  - `points`: ordena por `total_points DESC`
  - `biodiversity`: score = `SUM(rarity_weight)` por usuário; pesos comum=1, incomum=2, raro=4, epico=8, lendario=15

### Frontend
- [ ] Criar `app/(app)/community/page.tsx` — feed paginado de posts aprovados
- [ ] Criar `app/(app)/community/new/page.tsx` — formulário de submissão (textarea + seleção de matéria)
- [ ] Criar `app/(app)/community/my-posts/page.tsx` — posts do usuário (incluindo rejeitados com feedback privado)
- [ ] Criar `app/(app)/ranking/page.tsx` — tabs (Pontos | Biodiversidade) com leaderboard
- [ ] Criar `components/posts/PostCard.tsx` — autor, matéria, conteúdo (Markdown), likes, badge veterano
- [ ] Criar `components/posts/PostForm.tsx` — submissão com loading state durante validação
- [ ] Criar `components/posts/PostFeedback.tsx` — exibe `ai_feedback` privado em posts rejeitados (apenas para autor)
- [ ] Criar `components/ranking/LeaderboardTable.tsx` — tabela responsiva com link para floresta
- [ ] Indicador de "aguardando validação" para posts pending
- [ ] Atualização em tempo real do feed após aprovação (polling a cada 10s ou refresh manual)

## Arquivos a Criar/Modificar

1. `lib/ai/client.ts` (criar)
2. `lib/ai/prompts/post-validator.ts` (criar)
3. `lib/ai/post-validator.ts` (criar)
4. `app/api/posts/route.ts` (criar)
5. `app/api/posts/[id]/route.ts` (criar)
6. `app/api/posts/[id]/like/route.ts` (criar)
7. `app/api/ranking/route.ts` (criar)
8. `app/(app)/community/page.tsx` (criar)
9. `app/(app)/community/new/page.tsx` (criar)
10. `app/(app)/community/my-posts/page.tsx` (criar)
11. `app/(app)/ranking/page.tsx` (criar)
12. `components/posts/PostCard.tsx` (criar)
13. `components/posts/PostForm.tsx` (criar)
14. `components/posts/PostFeedback.tsx` (criar)
15. `components/ranking/LeaderboardTable.tsx` (criar)
16. `.env.example` (modificar — adicionar `ANTHROPIC_API_KEY`)
17. `lib/missions/tracker.ts` (modificar — integrar tipos `post_resolution` e `social_like`)

## Comandos

```bash
npm install @anthropic-ai/sdk

# Configurar
# Adicionar ANTHROPIC_API_KEY=sk-ant-... ao .env.local

# Verificar
npm run dev
# Logar → /community/new → submeter resolução correta de matriz → aguardar ~10s → ver no feed público
# Submeter resolução errada → ver em /community/my-posts com feedback privado

# Testes
npm test -- posts
npm test -- ai
npm test -- ranking

# Commit
git add .
git commit -m "fase-05: comunidade + validação por IA + ranking"
```

## Testes

- [ ] `tests/lib/ai/post-validator.test.ts` — mock do `@anthropic-ai/sdk`; post correto → status approved + pontos; post incorreto → rejected
- [ ] `tests/lib/ai/post-validator.test.ts` — JSON inválido do Claude → status mantido como pending + log
- [ ] `tests/api/posts/create.test.ts` — submissão credita +15 imediatamente; status = pending no DB
- [ ] `tests/api/posts/get.test.ts` — feed só retorna `is_public = true`; detalhe omite `ai_feedback` se não for autor
- [ ] `tests/api/posts/like.test.ts` — like cria registro + atualiza count + credita +10; segundo like remove e descredita
- [ ] `tests/api/ranking.test.ts` — `type=points` ordena por total_points; `type=biodiversity` calcula score por raridade
- [ ] `tests/integration/post-flow.test.ts` — submeter → aguardar mock de IA → verificar feed atualizado

Comando: `npm test -- posts && npm test -- ai && npm test -- ranking`

## Critérios de Aceitação

- [ ] `/community/new` permite submeter post com matéria selecionada e Markdown
- [ ] Ao submeter: +15pts creditados, redirect para `/community/my-posts`, status "aguardando validação"
- [ ] Em até 30s a IA processa e o status muda
- [ ] Post aprovado: aparece em `/community`, autor recebe +50 + bônus
- [ ] Post rejeitado: aparece apenas em `/community/my-posts` com texto do feedback
- [ ] Like em post incrementa contador e credita +10 ao autor
- [ ] Segundo clique no like remove (toggle); pontos do autor são revertidos
- [ ] `/ranking?type=points` lista top 20 por pontos
- [ ] `/ranking?type=biodiversity` lista top 20 por score de biodiversidade
- [ ] Click em usuário no ranking abre `/forest/[userId]` (público)
- [ ] Achievement `curator` desbloqueia ao atingir 50 posts aprovados
- [ ] Achievement `pollinator` desbloqueia ao receber 100 likes
- [ ] Todos os testes da fase passam

## Tempo Estimado
5-7 dias

## Próxima Fase
→ [fase-06-notificacoes.md](./fase-06-notificacoes.md)
