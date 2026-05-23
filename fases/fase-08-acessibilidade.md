# Fase 08 — Acessibilidade

## Objetivo
Plataforma atende padrões WCAG AA. Modo áudio (TTS) lê os blocos de conteúdo em pt-BR. Fonte OpenDyslexic disponível como opção. Modo escuro funcional. Navegação por teclado completa. Lighthouse Accessibility ≥ 90 em todas as páginas principais. Botões com ≥ 44×44px, contraste ≥ 4.5:1, foco visível.

## Pré-requisitos
- Fase 07 concluída — todas as funcionalidades principais implementadas

## Dependências a Instalar

```bash
npm install -D @axe-core/playwright playwright
```

`framer-motion` já está instalado (Fase 06) — usaremos para respeitar `prefers-reduced-motion`.

## Schema Prisma

Adicionar campo de preferências ao `User`:

```prisma
model User {
  // ... campos existentes
  preferences Json @default("{}") // { font: 'default'|'dyslexic', theme: 'light'|'dark'|'system', reducedMotion: boolean, fontSize: 'sm'|'md'|'lg' }
}
```

Migration: `npm run db:migrate -- --name add-user-preferences`

## Tarefas

### Modo Áudio (TTS)
- [ ] Criar `components/ui/AudioPlayer.tsx` usando `SpeechSynthesisUtterance` com `lang = 'pt-BR'`
- [ ] Botão de play/pause; seleção de velocidade (0.75×, 1×, 1.25×, 1.5×)
- [ ] Highlight da frase atual durante leitura via `onboundary` event
- [ ] Integrar `<AudioPlayer>` em `<ContentBlock>` da Fase 02

### Tipografia e Tema
- [ ] Baixar fonte OpenDyslexic e adicionar em `public/fonts/`
- [ ] Configurar `@font-face` no `globals.css`
- [ ] Criar classe utilitária Tailwind `.font-dyslexic`
- [ ] Implementar modo escuro com Tailwind `dark:` prefix em todos os componentes
- [ ] Toggle de tema (claro/escuro/sistema) em `/settings`
- [ ] Toggle de fonte (default/OpenDyslexic) em `/settings`
- [ ] Toggle de tamanho de fonte (sm/md/lg) em `/settings`
- [ ] Toggle de reduced motion em `/settings`
- [ ] Salvar preferências em `users.preferences` via PATCH

### Página de Configurações
- [ ] Criar `app/(app)/settings/page.tsx` com todos os toggles
- [ ] Criar `app/api/users/me/preferences/route.ts` (PATCH)
- [ ] Aplicar preferências globalmente via `<UserProvider>` e atributos no `<html>`
- [ ] Persistir preferências no `localStorage` também (para resposta instantânea)

### Navegação por Teclado
- [ ] Auditar todos os componentes interativos: garantir que recebem foco via Tab
- [ ] Adicionar `aria-label` em todos os botões com apenas ícone
- [ ] Implementar skip link "Pular para conteúdo principal" no topo de cada página
- [ ] Garantir estado de foco visível (outline azul ou ring Tailwind)
- [ ] Modais devem aprisionar foco (`focus-trap-react` se necessário)
- [ ] Esc fecha modais e dropdowns

### Contraste e Tamanhos
- [ ] Auditar paleta de cores: todos os textos devem ter razão ≥ 4.5:1 sobre fundo
- [ ] Botões: mínimo 44×44px (usar `min-h-[44px] min-w-[44px]` no Tailwind)
- [ ] Textos: mínimo 16px (modo padrão); 14px apenas em metadados não-críticos
- [ ] Inputs: labels associados via `htmlFor`/`id`
- [ ] Indicadores de erro: ícone + cor + texto (não só cor)

### Acessibilidade Semântica
- [ ] Estrutura de headings: `<h1>` único por página, hierarquia correta
- [ ] Listas: usar `<ul>`/`<ol>` para listas; não `<div>` simulando
- [ ] Imagens: todas com `alt` (descritivo para ilustrações, vazio `alt=""` para decorativas)
- [ ] Ícones de fauna/árvore: `aria-hidden` + label textual próxima
- [ ] Tabelas (ranking): `<thead>`, `<tbody>`, `scope` nos `<th>`

### Auditoria Automatizada
- [ ] Configurar `@axe-core/playwright` para rodar em CI
- [ ] Criar `tests/a11y/pages.spec.ts` com auditoria de 5 páginas principais
- [ ] Configurar Lighthouse CI no `package.json`: script `lighthouse:a11y`

## Arquivos a Criar/Modificar

1. `prisma/schema.prisma` (modificar — campo `preferences`)
2. `components/ui/AudioPlayer.tsx` (criar)
3. `components/content/ContentBlock.tsx` (modificar — adicionar AudioPlayer)
4. `public/fonts/OpenDyslexic-Regular.woff2` (adicionar)
5. `public/fonts/OpenDyslexic-Bold.woff2` (adicionar)
6. `app/globals.css` (modificar — @font-face)
7. `tailwind.config.ts` (modificar — dark mode 'class')
8. `app/(app)/settings/page.tsx` (criar)
9. `app/api/users/me/preferences/route.ts` (criar)
10. `components/settings/PreferencesPanel.tsx` (criar)
11. `lib/preferences/apply.ts` (criar — aplica no DOM)
12. `components/UserProvider.tsx` (modificar — sincroniza preferências)
13. `components/ui/SkipLink.tsx` (criar)
14. `app/(app)/layout.tsx` (modificar — incluir SkipLink)
15. `tests/a11y/pages.spec.ts` (criar)
16. **Vários componentes existentes** (modificar — aria-labels, contraste, tamanhos): Header, NotificationBell, TreeShop, ForestMap, Checkpoint, PostCard, AuthForm

## Comandos

```bash
npm install -D @axe-core/playwright playwright
npx playwright install chromium

# Schema
npm run db:migrate -- --name add-user-preferences

# Verificar
npm run dev
# /settings → ativar OpenDyslexic → todos os textos mudam
# /settings → modo escuro → toggle visual em todo o site
# Em /subjects/ICTA13 → botão "Ouvir bloco" → leitura em pt-BR

# Lighthouse local
npx lighthouse http://localhost:3000/dashboard --view --only-categories=accessibility

# Auditoria a11y
npm run test:a11y

# Commit
git add .
git commit -m "fase-08: acessibilidade WCAG AA + TTS + OpenDyslexic + dark mode"
```

## Testes

- [ ] `tests/components/ui/AudioPlayer.test.tsx` — usa `lang=pt-BR`; play dispara `speechSynthesis.speak`
- [ ] `tests/lib/preferences/apply.test.ts` — aplica classe `dark` no `<html>` quando theme=dark
- [ ] `tests/api/users/preferences.test.ts` — PATCH atualiza JSON; valida valores permitidos
- [ ] `tests/a11y/pages.spec.ts` (Playwright + axe-core):
  - `/` → 0 violations
  - `/login` → 0 violations
  - `/dashboard` → 0 violations
  - `/subjects/ICTA13` → 0 violations
  - `/forest` → 0 violations
- [ ] Verificação manual de tab order: navegação completa sem mouse em fluxos principais

Comando: `npm run test:a11y`

## Critérios de Aceitação

- [ ] Toggle OpenDyslexic em `/settings` muda fonte em todo o site
- [ ] Toggle de modo escuro muda visual; persiste após refresh
- [ ] Toggle de tamanho de fonte (sm/md/lg) altera todos os textos
- [ ] Toggle reduced motion desabilita animações de framer-motion
- [ ] Botão "Ouvir bloco" em `<ContentBlock>` lê o texto em pt-BR
- [ ] Velocidade de leitura ajustável
- [ ] Frase atual fica destacada durante leitura
- [ ] Lighthouse Accessibility ≥ 90 em: `/`, `/login`, `/dashboard`, `/subjects/ICTA13`, `/forest`
- [ ] Todos os botões da plataforma têm pelo menos 44×44px
- [ ] Todos os textos têm contraste ≥ 4.5:1 sobre fundo
- [ ] Nenhum elemento crítico depende apenas de hover
- [ ] Tab order navega corretamente em fluxo de login → dashboard → leitura → plantio
- [ ] Esc fecha modais e dropdowns abertos
- [ ] Skip link visível ao focar com Tab no topo da página
- [ ] Todas as imagens têm `alt` apropriado
- [ ] `npm run test:a11y` retorna 0 violações
- [ ] Todos os testes da fase passam

## Tempo Estimado
3-5 dias

## Próxima Fase
→ [fase-09-dashboard.md](./fase-09-dashboard.md)
