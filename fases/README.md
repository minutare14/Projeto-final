# Fases de Desenvolvimento — Reserva Florestal

> Roteiro executável de desenvolvimento do zero até o site em produção. Cada fase tem critérios de aceitação claros — **não avance sem completar todos**.

---

## Visão Geral

| # | Fase | Entregável | Tempo |
|---|---|---|---|
| 00 | [Setup](./fase-00-setup.md) | `npm run dev` mostra app Next.js; `npm test` passa | 1-2 dias |
| 01 | [Autenticação](./fase-01-auth.md) | Cadastro + login + sessão persistida | 3-4 dias |
| 02 | [Conteúdo + Pontuação](./fase-02-conteudo.md) | Ler blocos ICTA13, ganhar pontos, streak ativo | 5-7 dias |
| 03 | [Floresta + Loja](./fase-03-floresta.md) | Plantar árvore, ver no mapa, CO₂ calculado | 5-7 dias |
| 04 | [Missões + Achievements](./fase-04-missoes.md) | Missões diárias e conquistas funcionais | 3-5 dias |
| 05 | [Comunidade + IA](./fase-05-comunidade.md) | Posts validados pela IA Claude | 5-7 dias |
| 06 | [Notificações + Fauna](./fase-06-notificacoes.md) | Bell de notificações + animais na floresta | 3-5 dias |
| 07 | [Professor + Turmas](./fase-07-professor.md) | Modo professor + importador IA + turmas | 7-10 dias |
| 08 | [Acessibilidade](./fase-08-acessibilidade.md) | TTS, OpenDyslexic, WCAG AA | 3-5 dias |
| 09 | [Dashboard + Impacto](./fase-09-dashboard.md) | Analytics + plantio real na 100ª árvore | 3-5 dias |
| 10 | [Deploy](./fase-10-deploy.md) | URL pública estável em produção | 2-3 dias |

**Total estimado:** 40-60 dias úteis para um desenvolvedor solo.

---

## Como Usar Este Roteiro

1. **Execute uma fase por vez** — não pule nem misture fases.
2. **Marque os checkboxes** em cada arquivo conforme conclui as tarefas.
3. **Verifique todos os critérios de aceitação** antes de avançar.
4. **Commits frequentes** dentro de cada fase, com prefixo `fase-XX:`.
5. **Cada fase tem testes obrigatórios** — não considere a fase concluída se `npm test` falhar.

---

## Dependências Entre Fases

```
Fase 00 → Fase 01 → Fase 02 → Fase 03 → Fase 04 → Fase 05 → Fase 06 → Fase 07 → Fase 08 → Fase 09 → Fase 10
```

Cada fase depende **apenas da anterior**. Não pule fases mesmo que pareçam independentes — a Fase 06, por exemplo, depende dos serviços de pontuação da Fase 02 e do plantio da Fase 03.

---

## Estado Inicial do Repositório

Quando você começar a Fase 00, o repositório deve conter:

- `prisma/schema.prisma` — 12 models definidos
- `prisma/seed.ts` — 5 biomas, 31 árvores, 5 blocos ICTA13
- `package.json` — dependências e scripts prontos
- Documentos de planejamento: `sdd.md`, `projeto.md`, `analise-features.md`, `CLAUDE.md`, `design-thinking.md`

**Não existe ainda:** `app/`, `pages/`, `.env`, `tsconfig.json`, configs do Next.js, Tailwind, Vitest.

---

## Convenções Globais

### Estrutura de Pastas (a partir da Fase 00)

```
/
├── app/               # Next.js App Router (páginas + API routes)
├── components/        # Componentes React reutilizáveis
├── lib/               # Services, utilitários, helpers
│   └── ai/            # Integrações com Claude API
├── prisma/            # Schema, migrations e seed
├── public/            # Assets estáticos (ilustrações, sprites)
├── tests/             # Testes Vitest
├── fases/             # Esta pasta — roteiro de desenvolvimento
└── docs/              # Documentos de planejamento existentes
```

### Padrões de Código

- **Idempotência** em todas as ações de pontuação (não creditar duas vezes).
- **Validações no servidor**, sempre. Frontend não confia em nada.
- **Tipos compartilhados** via Prisma Client gerado — não duplicar.
- **Mensagens de erro em pt-BR** voltadas ao usuário final.

### Testes

- **Vitest** como runner único.
- Cada serviço crítico em `lib/` precisa de teste unitário.
- Endpoints de API precisam de teste de integração.
- Componentes complexos (ForestMap, Checkpoint) precisam de teste de comportamento.
- `npm test` deve sempre passar antes de avançar de fase.

---

## Próximo Passo

Comece em **[Fase 00 — Setup](./fase-00-setup.md)**.
