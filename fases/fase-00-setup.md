# Fase 00 — Setup

## Objetivo
Ter um app Next.js 14 funcional rodando localmente com Prisma conectado a um Postgres, Tailwind configurado, Vitest passando em um teste smoke e o seed completo executado no banco.

## Pré-requisitos
- Node.js 20+ instalado
- PostgreSQL local (via Docker) ou conta no Railway
- Git configurado
- `DATABASE_URL` definida (em `.env.local`)

## Dependências a Instalar

Já presentes no `package.json`:
- `next@^14`, `react@^18`, `@prisma/client`, `next-auth`, `katex`, `react-markdown`, `remark-math`, `rehype-katex`, `zustand`, `clsx`

A adicionar:
```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom prettier eslint-config-prettier
```

## Schema Prisma

Adicionar campo ao model `Tree`:
```prisma
model Tree {
  // ... campos existentes
  co2AbsorptionKgYear Float @default(22.0) @map("co2_absorption_kg_year")
}
```

Migration: `npm run db:migrate -- --name add-co2-to-trees`

## Tarefas

- [ ] Criar `.gitignore` com `node_modules`, `.next`, `.env*`, `coverage/`
- [ ] Criar `.env.example` com `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- [ ] Criar `.env.local` (não commitado) com valores reais
- [ ] Criar `tsconfig.json` com paths `@/*` → `./` e strict mode
- [ ] Criar `next.config.js` com config básica
- [ ] Criar `tailwind.config.ts` com `content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}']`
- [ ] Criar `postcss.config.js` com tailwindcss e autoprefixer
- [ ] Criar `app/globals.css` com diretivas `@tailwind`
- [ ] Criar `app/layout.tsx` com html/body básico
- [ ] Criar `app/page.tsx` com tela de boas-vindas simples
- [ ] Criar `.prettierrc` com regras de formatação
- [ ] Configurar `eslint-config-prettier` no `.eslintrc.json`
- [ ] Criar `vitest.config.ts` com `environment: 'jsdom'` e setup file
- [ ] Criar `tests/setup.ts` com `@testing-library/jest-dom`
- [ ] Criar `tests/smoke.test.ts` testando 1 + 1 = 2 (smoke)
- [ ] Adicionar script `"test": "vitest"` ao `package.json`
- [ ] Adicionar `co2AbsorptionKgYear` ao model `Tree` em `prisma/schema.prisma`
- [ ] Rodar `npm run db:migrate -- --name add-co2-to-trees`
- [ ] Rodar `npm run db:seed`
- [ ] Verificar no Prisma Studio que dados foram populados
- [ ] Criar pasta `components/` vazia com `.gitkeep`
- [ ] Criar pasta `lib/` vazia com `.gitkeep`
- [ ] Mover `*.md` (sdd, projeto, analise-features, design-thinking) para `docs/`

## Arquivos a Criar/Modificar

1. `.gitignore` (criar)
2. `.env.example` (criar)
3. `.env.local` (criar, NÃO commitar)
4. `tsconfig.json` (criar)
5. `next.config.js` (criar)
6. `tailwind.config.ts` (criar)
7. `postcss.config.js` (criar)
8. `app/globals.css` (criar)
9. `app/layout.tsx` (criar)
10. `app/page.tsx` (criar)
11. `.prettierrc` (criar)
12. `.eslintrc.json` (criar)
13. `vitest.config.ts` (criar)
14. `tests/setup.ts` (criar)
15. `tests/smoke.test.ts` (criar)
16. `package.json` (modificar — adicionar script `test`)
17. `prisma/schema.prisma` (modificar — adicionar campo CO₂)
18. `docs/` (mover documentos existentes)

## Comandos

```bash
# Setup
npm install
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom prettier eslint-config-prettier

# Database
npm run db:migrate -- --name add-co2-to-trees
npm run db:seed

# Verificação
npm run dev          # http://localhost:3000 deve abrir
npm test             # smoke test passa
npm run db:studio    # ver dados no Prisma Studio

# Commit
git add .
git commit -m "fase-00: scaffolding Next.js + Prisma + Vitest"
```

## Testes

- [ ] `tests/smoke.test.ts` — verifica que Vitest está rodando (assert básico)
- [ ] Verificar que Prisma Client gera tipos corretamente: importar `PrismaClient` em qualquer arquivo TS deve compilar

Comando: `npm test`

## Critérios de Aceitação

- [ ] `npm run dev` abre `http://localhost:3000` sem erro
- [ ] Tela de boas-vindas com fonte Tailwind aplicada visível
- [ ] `npm test` retorna 0 (todos os testes passam)
- [ ] `npm run db:studio` lista 5 biomas, 31 árvores, 1 subject, 5 content_blocks, 5 checkpoints
- [ ] Campo `co2_absorption_kg_year` existe na tabela `trees`
- [ ] `npx tsc --noEmit` não retorna erros de tipo
- [ ] `.env.local` está em `.gitignore` (não foi commitado)

## Tempo Estimado
1-2 dias

## Próxima Fase
→ [fase-01-auth.md](./fase-01-auth.md)
