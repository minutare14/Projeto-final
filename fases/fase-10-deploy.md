# Fase 10 — Deploy

## Objetivo
Plataforma rodando em produção com URL pública estável. Frontend hospedado no Vercel, banco PostgreSQL no Railway (ou Supabase), cron jobs ativos, variáveis de ambiente configuradas, monitoramento básico de erros, e fluxo completo (signup → ler bloco → plantar árvore → submeter post) funcionando ponta a ponta em produção.

## Pré-requisitos
- Fase 09 concluída — todas as funcionalidades implementadas e testadas localmente
- Conta no GitHub com o repositório
- Conta no Vercel (gratuita)
- Conta no Railway, Supabase ou Neon (Postgres gratuito)
- Conta na Anthropic com créditos disponíveis
- Domínio próprio (opcional)

## Dependências a Instalar

```bash
npm install -D @sentry/nextjs
```

Sentry para captura de erros em produção (gratuito até 5k erros/mês).

## Schema Prisma
Sem alterações.

## Tarefas

### Preparação do Repositório
- [ ] Garantir que `.env.local` está em `.gitignore` e nunca foi commitado
- [ ] Criar `.env.production` listando todas as variáveis necessárias (vazias, só nomes)
- [ ] Revisar `next.config.js`: garantir `images.remotePatterns` para sprites externos
- [ ] Configurar `output: 'standalone'` no `next.config.js` se for usar Docker
- [ ] Adicionar `engines.node: ">=20"` no `package.json`
- [ ] Verificar que `npm run build` roda sem erros localmente
- [ ] Verificar que `npm test` passa com 100% dos testes
- [ ] Criar `README.md` com seções: Apresentação, Stack, Setup Local, Deploy, Licença

### Database — Provisão e Migration
- [ ] Criar instância Postgres em Railway (ou Supabase/Neon)
- [ ] Habilitar SSL na connection string
- [ ] Configurar `DATABASE_URL` para produção (com `?sslmode=require`)
- [ ] Rodar `npx prisma migrate deploy` apontando para o DB de produção
- [ ] Rodar `npm run db:seed` para popular biomas, árvores, achievements, fauna
- [ ] Verificar no Prisma Studio remoto (ou psql) que dados estão lá

### Deploy do Frontend — Vercel
- [ ] Conectar repositório GitHub ao Vercel
- [ ] Configurar build command: `npm run build`
- [ ] Configurar todas as env vars no painel Vercel:
  - `DATABASE_URL` (Postgres prod)
  - `NEXTAUTH_SECRET` (gerado com `openssl rand -base64 32`)
  - `NEXTAUTH_URL` (URL pública do Vercel)
  - `ANTHROPIC_API_KEY` (chave de produção)
  - `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` (atualizar URI no console)
  - `NEXT_PUBLIC_APP_URL` (URL pública)
- [ ] Configurar custom domain (opcional)
- [ ] Deploy inicial
- [ ] Verificar build logs sem erros
- [ ] Smoke test em produção

### Cron Jobs
- [ ] **Opção A — Vercel Cron** (recomendado): criar `vercel.json` com:
  ```json
  {
    "crons": [
      { "path": "/api/cron/daily-missions", "schedule": "1 0 * * *" },
      { "path": "/api/cron/mentor-points", "schedule": "0 1 * * *" }
    ]
  }
  ```
- [ ] Criar endpoints HTTP em `app/api/cron/*` que disparam os jobs (proteger com `CRON_SECRET`)
- [ ] Migrar lógica do `node-cron` (Fase 04) para esses endpoints
- [ ] **Opção B — Railway Cron**: criar serviço separado em `cron/` rodando 24/7

### Monitoramento
- [ ] Configurar Sentry para Next.js: `npx @sentry/wizard@latest -i nextjs`
- [ ] Adicionar `SENTRY_DSN` às env vars
- [ ] Testar captura de erro em produção (provocar erro intencional, verificar dashboard Sentry)
- [ ] Configurar alertas Sentry para erros críticos via email

### Analytics (opcional)
- [ ] Adicionar Plausible Analytics ou PostHog (ambos free tier)
- [ ] Eventos a trackear: signup, login, block_complete, tree_planted, post_submitted

### Segurança
- [ ] Revisar todas as API routes: validação de input com Zod
- [ ] Rate limiting básico em rotas sensíveis (`/api/auth/*`, `/api/posts`) via middleware
- [ ] Configurar CORS apenas para o domínio próprio
- [ ] Headers de segurança em `next.config.js`: CSP, X-Frame-Options, X-Content-Type-Options
- [ ] Verificar que `ANTHROPIC_API_KEY` nunca é exposta ao frontend

### Documentação
- [ ] Atualizar `README.md` com badge de deploy e link público
- [ ] Documentar processo de promoção de usuário a teacher em produção
- [ ] Atualizar `CLAUDE.md` removendo nota "código 0% implementado"
- [ ] Adicionar ao `CLAUDE.md` URL de produção e instruções de troubleshooting comum

### Smoke Test em Produção
- [ ] Criar conta nova em produção
- [ ] Logar
- [ ] Acessar ICTA13 e ler 5 blocos
- [ ] Responder todos os checkpoints
- [ ] Confirmar pontuação acumulada (250pts esperados)
- [ ] Plantar primeiro Mandacaru
- [ ] Submeter post no feed
- [ ] Aguardar validação IA
- [ ] Verificar notificações chegando
- [ ] Testar em mobile (responsividade)
- [ ] Verificar Lighthouse score em produção ≥ 90

## Arquivos a Criar/Modificar

1. `.env.production` (criar — sem valores reais, apenas nomes)
2. `vercel.json` (criar — config de cron jobs)
3. `next.config.js` (modificar — security headers, Sentry, images)
4. `sentry.client.config.ts` (criar — via wizard)
5. `sentry.server.config.ts` (criar — via wizard)
6. `sentry.edge.config.ts` (criar — via wizard)
7. `app/api/cron/daily-missions/route.ts` (criar — substitui node-cron)
8. `app/api/cron/mentor-points/route.ts` (criar)
9. `lib/cron/protect.ts` (criar — validação do CRON_SECRET)
10. `README.md` (substituir/criar — apresentação completa)
11. `middleware.ts` (modificar — rate limiting)
12. `lib/validation/*.ts` (criar — schemas Zod por endpoint)
13. `package.json` (modificar — engines.node, script "postinstall": "prisma generate")
14. `CLAUDE.md` (modificar — atualizar estado para "implementado e em produção")

## Comandos

```bash
npm install -D @sentry/nextjs

# Setup Sentry (interativo)
npx @sentry/wizard@latest -i nextjs

# Build local (validação)
npm run build

# Configurar Vercel CLI (opcional, mas útil)
npm install -g vercel
vercel login
vercel link

# Migrations em produção
DATABASE_URL="postgresql://...prod..." npx prisma migrate deploy
DATABASE_URL="postgresql://...prod..." npm run db:seed

# Deploy
git push origin main   # Vercel auto-deploya da branch principal
# Ou: vercel --prod

# Smoke test
curl -I https://reservaflorestal.vercel.app   # 200 OK

# Commit
git add .
git commit -m "fase-10: deploy em produção + monitoramento + segurança"
```

## Testes

- [ ] `tests/lib/cron/protect.test.ts` — endpoint sem CRON_SECRET retorna 401
- [ ] `tests/lib/validation/*.test.ts` — schemas Zod validam corretamente
- [ ] `tests/middleware/rate-limit.test.ts` — 11ª chamada em 1 minuto retorna 429
- [ ] Smoke test em produção (manual, documentado em `docs/production-smoke.md`)

Comando: `npm test -- cron && npm test -- validation && npm test -- middleware`

## Critérios de Aceitação

- [ ] `npm run build` completa sem erros
- [ ] Deploy no Vercel finaliza com sucesso (verde no painel)
- [ ] URL pública acessível (`https://[seu-projeto].vercel.app`)
- [ ] Postgres de produção contém todos os seeds (biomas, árvores, achievements, fauna)
- [ ] Signup funciona em produção
- [ ] Login funciona em produção
- [ ] Leitura de bloco credita pontos em produção
- [ ] Plantio de árvore funciona em produção
- [ ] Submissão de post dispara validação IA real em produção
- [ ] Cron Vercel está habilitado (verificar no painel)
- [ ] Sentry captura erros de teste (provocar 1 erro intencional, verificar dashboard)
- [ ] Lighthouse score (mobile) em `/`, `/dashboard`, `/forest`: ≥ 90 para Performance e Accessibility
- [ ] README.md atualizado com link público e instruções
- [ ] Nenhuma chave secreta no código fonte (`grep -r "sk-ant" .` retorna vazio)
- [ ] Todos os testes da fase passam

## Tempo Estimado
2-3 dias

## Próxima Fase
🎉 **Fim do roteiro.** A plataforma está em produção.

**Próximos passos sugeridos:**
- Lançar para um grupo piloto de alunos (ex: 1 turma da UFBA)
- Coletar feedback via formulário in-app
- Iterar nas features de menor prioridade da `analise-features.md` (Eventos Sazonais, Tutor IA Conversacional, Revisão Espaçada)
- Buscar parcerias reais com ONGs para o sistema de plantio real
- Considerar publicação como projeto acadêmico ou TCC
