# Spec-Driven Development — Reserva Florestal

> Documento de especificação técnica completo. Cada seção define o comportamento esperado antes da implementação.

---

## Índice

1. [Stack Definida](#1-stack-definida)
2. [Modelagem de Dados](#2-modelagem-de-dados)
3. [Regras de Negócio](#3-regras-de-negócio)
4. [Especificação de APIs](#4-especificação-de-apis)
5. [Especificação de Componentes Frontend](#5-especificação-de-componentes-frontend)
6. [Engenharia de Prompts — Agente IA](#6-engenharia-de-prompts--agente-ia)
7. [User Stories com Critérios de Aceitação](#7-user-stories-com-critérios-de-aceitação)
8. [Roadmap de Implementação](#8-roadmap-de-implementação)

---

## 1. Stack Definida

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Frontend | React (Next.js) | SSR para SEO e performance; ecossistema rico |
| Estilo | Tailwind CSS | Desenvolvimento rápido e design system consistente |
| Backend | Node.js + Express | Mesma linguagem no full-stack, fácil integração |
| Banco relacional | PostgreSQL | Dados estruturados de usuários, árvores, posts |
| Banco vetorial | PGVector (extensão PG) | Busca semântica sem serviço externo adicional |
| IA | API Claude (Anthropic) | Validação de posts e feedback pedagógico |
| Fórmulas | KaTeX | Renderização leve de LaTeX no browser |
| Auth | NextAuth.js | Login social (Google) + email/senha |
| ORM | Prisma | Migrations e tipagem automática |
| Hospedagem | Vercel (frontend) + Railway (backend + PG) | Deploy simples para MVP |

---

## 2. Modelagem de Dados

### 2.1 `users`

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  avatar_url    TEXT,
  total_points  INTEGER NOT NULL DEFAULT 0,
  current_tier  INTEGER NOT NULL DEFAULT 1,  -- bioma atual (1-5)
  streak_days   INTEGER NOT NULL DEFAULT 0,
  last_active   TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW()
);
```

### 2.2 `biomes`

```sql
CREATE TABLE biomes (
  id               SERIAL PRIMARY KEY,
  name             VARCHAR(60) NOT NULL,       -- ex: "Caatinga"
  tier             INTEGER UNIQUE NOT NULL,    -- 1 a 5
  points_required  INTEGER NOT NULL,           -- pontos para desbloquear
  description      TEXT,
  background_url   TEXT                        -- imagem do bioma
);

-- Seed:
-- (1, 'Caatinga',       1, 0)
-- (2, 'Cerrado',        2, 500)
-- (3, 'Mata Atlântica', 3, 1500)
-- (4, 'Pantanal',       4, 3000)
-- (5, 'Amazônia',       5, 6000)
```

### 2.3 `trees`

```sql
CREATE TABLE trees (
  id                SERIAL PRIMARY KEY,
  common_name       VARCHAR(100) NOT NULL,     -- ex: "Ipê Amarelo"
  scientific_name   VARCHAR(120),
  biome_id          INTEGER REFERENCES biomes(id),
  tier_required     INTEGER NOT NULL,          -- tier mínimo para comprar
  cost_points       INTEGER NOT NULL,
  rarity            VARCHAR(20) NOT NULL CHECK (rarity IN ('comum','incomum','raro','epico','lendario')),
  description       TEXT,                      -- curiosidade ecológica
  illustration_url  TEXT
);
```

### 2.4 `user_forest` (inventário da reserva)

```sql
CREATE TABLE user_forest (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  tree_id     INTEGER REFERENCES trees(id),
  biome_id    INTEGER REFERENCES biomes(id),
  pos_x       FLOAT NOT NULL,
  pos_y       FLOAT NOT NULL,
  planted_at  TIMESTAMP DEFAULT NOW()
);
```

### 2.5 `user_biomes` (biomas desbloqueados por usuário)

```sql
CREATE TABLE user_biomes (
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  biome_id      INTEGER REFERENCES biomes(id),
  unlocked_at   TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, biome_id)
);
```

### 2.6 `subjects` (matérias)

```sql
CREATE TABLE subjects (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR(20) UNIQUE NOT NULL,  -- ex: "ICTA13"
  name        VARCHAR(120) NOT NULL,
  description TEXT
);
```

### 2.7 `content_blocks` (micro-blocos de conteúdo)

```sql
CREATE TABLE content_blocks (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id     INTEGER REFERENCES subjects(id),
  order_index    INTEGER NOT NULL,
  title          VARCHAR(200),
  body           TEXT NOT NULL,              -- texto do bloco (Markdown)
  has_formula    BOOLEAN DEFAULT FALSE,
  formula_latex  TEXT,                       -- expressão LaTeX, se houver
  illustration   TEXT,                       -- URL da imagem ilustrativa
  points_reward  INTEGER NOT NULL DEFAULT 10,
  created_at     TIMESTAMP DEFAULT NOW()
);
```

### 2.8 `checkpoints` (perguntas dentro dos blocos)

```sql
CREATE TABLE checkpoints (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id         UUID REFERENCES content_blocks(id) ON DELETE CASCADE,
  question         TEXT NOT NULL,
  option_a         TEXT NOT NULL,
  option_b         TEXT NOT NULL,
  option_c         TEXT,
  option_d         TEXT,
  correct_option   CHAR(1) NOT NULL CHECK (correct_option IN ('a','b','c','d')),
  explanation      TEXT,                     -- explicado após resposta
  points_reward    INTEGER NOT NULL DEFAULT 20
);
```

### 2.9 `user_progress` (progresso por bloco)

```sql
CREATE TABLE user_progress (
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  block_id      UUID REFERENCES content_blocks(id),
  completed     BOOLEAN DEFAULT FALSE,
  completed_at  TIMESTAMP,
  points_earned INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, block_id)
);
```

### 2.10 `posts` (feed da comunidade)

```sql
CREATE TABLE posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  subject_id      INTEGER REFERENCES subjects(id),
  body            TEXT NOT NULL,
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','rejected')),
  ai_feedback     TEXT,                      -- retorno da IA (privado se rejeitado)
  ai_bonus_score  INTEGER DEFAULT 0,
  is_public       BOOLEAN DEFAULT FALSE,
  likes_count     INTEGER DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW()
);
```

### 2.11 `post_likes`

```sql
CREATE TABLE post_likes (
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id    UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);
```

### 2.12 `point_events` (log de pontuação)

```sql
CREATE TABLE point_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  source      VARCHAR(40) NOT NULL,   -- 'block_read', 'checkpoint', 'post_approved', 'like_received', 'time_active', 'streak'
  points      INTEGER NOT NULL,
  metadata    JSONB,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

---

## 3. Regras de Negócio

### 3.1 Pontuação

| Evento | Pontos | Observações |
|---|---|---|
| Bloco lido até o fim | +10 | Apenas uma vez por bloco por usuário |
| Checkpoint correto | +20 | Apenas uma vez por checkpoint |
| Tempo ativo (por minuto) | +2 | Máx. 30 min/dia contabilizados (60 pts) |
| Post publicado no feed | +15 | Ao submeter, antes da validação |
| Post aprovado pela IA | +50 | Adicional ao de submissão |
| Like recebido em post | +10 | Sem limite diário |
| Módulo completo (todos blocos) | +100 | Bônus único |
| Streak (dias consecutivos) | ×1.1 por dia | Aplica sobre todos os pontos do dia; máx ×2.0 |

**Regra anti-farm:** tempo ativo só conta se houver pelo menos 1 interação (clique, scroll, resposta) a cada 3 minutos.

### 3.2 Desbloqueio de Biomas

- Ao atingir `total_points >= biome.points_required`, o bioma é desbloqueado automaticamente.
- Biomas são cumulativos: desbloquear o Cerrado não perde a Caatinga.
- O `current_tier` do usuário sempre reflete o maior bioma desbloqueado.

### 3.3 Compra de Árvores

- O usuário precisa: `total_points >= tree.cost_points` **E** `current_tier >= tree.tier_required`.
- A compra deduz os pontos do `total_points` do usuário.
- Pontos deduzidos são registrados como evento negativo em `point_events`.
- Não há limite de árvores por reserva, mas há grade de posicionamento X/Y.

### 3.4 Validação de Posts pela IA

1. Aluno submete post → status = `pending`, `is_public = false`.
2. Backend envia o post ao agente IA (ver seção 6).
3. IA retorna JSON com `status`, `justificativa` e `bonus_relevancia`.
4. Se `status = approved`:
   - Post recebe `is_public = true`.
   - Usuário ganha +50 pts + `bonus_relevancia`.
5. Se `status = rejected`:
   - Post permanece `is_public = false`.
   - `ai_feedback` é salvo e enviado **apenas** ao autor (privado).
   - Usuário não perde os +15 pts de submissão.

### 3.5 Streak

- Se `last_active` for do dia anterior → `streak_days++`.
- Se `last_active` for de 2+ dias atrás → `streak_days = 1` (resetado).
- Multiplicador: `min(1.0 + streak_days * 0.1, 2.0)`.

---

## 4. Especificação de APIs

### Base URL: `/api/v1`

---

### Auth

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastro com email/senha |
| POST | `/auth/login` | Login, retorna JWT |
| GET | `/auth/me` | Dados do usuário autenticado |

---

### Usuários e Floresta

#### `GET /users/:id/forest`
Retorna a reserva florestal de um usuário (pública).

**Response:**
```json
{
  "user": { "id", "name", "avatar_url", "current_tier", "total_points" },
  "forest": [
    {
      "id": "uuid",
      "tree": { "common_name", "scientific_name", "rarity", "illustration_url" },
      "biome": { "name", "tier" },
      "pos_x": 12.5,
      "pos_y": 34.0,
      "planted_at": "2025-05-23T00:00:00Z"
    }
  ],
  "unlocked_biomes": ["Caatinga", "Cerrado"]
}
```

#### `GET /users/:id/stats`
Pontuação, streak, tier, ranking de biodiversidade.

---

### Biomas e Árvores

#### `GET /biomes`
Lista todos os biomas com status de desbloqueio do usuário autenticado.

#### `GET /trees?biome_id=&rarity=`
Lista árvores com filtros. Inclui campo `can_buy: boolean` baseado no usuário.

#### `POST /forest/plant`
Compra e planta uma árvore na reserva do usuário.

**Body:**
```json
{ "tree_id": 4, "pos_x": 10.0, "pos_y": 22.5 }
```

**Validações:**
- Usuário tem pontos suficientes.
- Tier do usuário >= tier da árvore.
- Posição X/Y não colide com outra árvore.

**Response:** árvore plantada + novo `total_points`.

---

### Conteúdo

#### `GET /subjects`
Lista todas as matérias disponíveis.

#### `GET /subjects/:code/blocks`
Lista os blocos de conteúdo de uma matéria, com progresso do usuário.

**Response por bloco:**
```json
{
  "id": "uuid",
  "order_index": 1,
  "title": "O que são Matrizes?",
  "body": "Markdown aqui...",
  "has_formula": true,
  "formula_latex": "A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}",
  "illustration": "url",
  "points_reward": 10,
  "completed": false,
  "checkpoints": [ ... ]
}
```

#### `POST /blocks/:id/complete`
Marca um bloco como lido. Gera evento de pontuação.

**Regra:** idempotente — segunda chamada não gera pontos novamente.

#### `POST /checkpoints/:id/answer`
Registra resposta de um checkpoint.

**Body:** `{ "option": "b" }`

**Response:**
```json
{
  "correct": true,
  "explanation": "...",
  "points_earned": 20
}
```

---

### Feed Social

#### `GET /posts?subject_id=&page=`
Lista posts públicos aprovados, paginados.

#### `POST /posts`
Submete uma resolução. Dispara validação assíncrona pela IA.

**Body:**
```json
{ "subject_id": 1, "body": "Texto da resolução..." }
```

**Response imediata:** `{ "post_id": "uuid", "status": "pending" }`

#### `GET /posts/:id`
Detalhe de um post. Feedback privado só retorna se `author_id == user autenticado`.

#### `POST /posts/:id/like`
Curte um post. Idempotente — segundo like remove o like (toggle).

---

### Pontuação

#### `GET /points/history`
Histórico de eventos de pontuação do usuário autenticado.

#### `POST /points/track-time`
Registra minuto ativo. Chamado pelo frontend a cada 60s com prova de interação.

**Body:** `{ "last_interaction_at": "ISO timestamp" }`

**Validação:** `last_interaction_at` não pode ser > 3 minutos atrás.

---

### Ranking

#### `GET /ranking?type=points|biodiversity&limit=20`
- `points`: ordena por `total_points DESC`.
- `biodiversity`: ordena por score calculado = `SUM(rarity_weight)` das árvores plantadas.

Pesos de raridade: comum=1, incomum=2, raro=4, epico=8, lendario=15.

---

## 5. Especificação de Componentes Frontend

### 5.1 Páginas

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `HomePage` | Landing page com apresentação |
| `/login` | `AuthPage` | Login / cadastro |
| `/dashboard` | `DashboardPage` | Hub do aluno: progresso, pontos, acesso rápido |
| `/subjects` | `SubjectsPage` | Lista de matérias disponíveis |
| `/subjects/:code` | `SubjectPage` | Blocos de conteúdo da matéria |
| `/forest` | `MyForestPage` | Reserva florestal pessoal + loja |
| `/forest/:userId` | `PublicForestPage` | Reserva pública de outro usuário |
| `/community` | `CommunityPage` | Feed de posts da comunidade |
| `/ranking` | `RankingPage` | Leaderboard de pontos e biodiversidade |

---

### 5.2 Componentes Principais

#### `<ContentBlock />`
- Exibe título, corpo em Markdown, ilustração e fórmula KaTeX.
- Botão "Concluir leitura" → chama `POST /blocks/:id/complete`.
- Estado: `completed` muda o visual do bloco (check verde).

#### `<Checkpoint />`
- Exibe pergunta e opções (A/B/C/D).
- Após resposta: mostra resultado + explicação + animação.
- Não permite reanswer se já respondeu corretamente.

#### `<ForestMap />`
- Canvas 2D (ou SVG) com as árvores posicionadas por X/Y.
- Clique em árvore → tooltip com nome científico + curiosidade ecológica.
- Modo "visita" (perfil público) desabilita compra.

#### `<TreeShop />`
- Grid de árvores filtráveis por bioma e raridade.
- Card de cada árvore: nome, ilustração, custo, raridade, botão comprar.
- Botão desabilitado com tooltip se tier insuficiente ou pontos insuficientes.

#### `<PostCard />`
- Exibe post aprovado: autor, matéria, conteúdo, likes.
- Botão de like com toggle visual.
- Badge de veterano se autor tiver `current_tier >= 3`.

#### `<PointsToast />`
- Notificação flutuante ao ganhar pontos: "+20 pts — checkpoint correto!".
- Desaparece após 2s com animação de subida.

#### `<StreakBadge />`
- Exibe chama animada + número de dias consecutivos.
- Exibido no header quando `streak_days >= 2`.

---

### 5.3 Estados Globais (Context / Zustand)

```ts
interface UserStore {
  user: User | null
  totalPoints: number
  currentTier: number
  streakDays: number
  unlockedBiomes: Biome[]
  addPoints: (amount: number, source: string) => void
  refreshUser: () => Promise<void>
}
```

---

## 6. Engenharia de Prompts — Agente IA

### System Prompt

```
Você é um Tutor Científico e Botânico da plataforma Reserva Florestal.
Seu papel é avaliar resoluções e explicações publicadas por alunos.

Regras:
1. Analise a precisão lógica e matemática do conteúdo enviado.
2. Seja rigoroso na correção, mas gentil e pedagógico no feedback.
3. Nunca exponha o erro publicamente — o feedback de rejeição é privado.
4. Conecte o feedback a uma curiosidade botânica quando possível.
5. Retorne APENAS o JSON estruturado abaixo, sem texto adicional.
```

### User Prompt (dinâmico)

```
Matéria: {subject_name}
Conteúdo do post do aluno:
---
{post_body}
---

Avalie e retorne:
```

### Saída Esperada

```json
{
  "status": "aprovado",
  "justificativa": "A resolução demonstra compreensão correta da transformação linear. O raciocínio sobre a matriz de rotação está preciso.",
  "bonus_relevancia": 10,
  "dica_botanica": "Assim como uma matriz de rotação preserva distâncias, o Ipê preserva sua estrutura mesmo na seca — suas raízes profundas mantêm a rigidez do solo."
}
```

| Campo | Tipo | Regra |
|---|---|---|
| `status` | `"aprovado" \| "reprovado"` | obrigatório |
| `justificativa` | string | máx. 300 chars, tom pedagógico |
| `bonus_relevancia` | integer 0–30 | 0 se reprovado; proporcional à qualidade |
| `dica_botanica` | string | opcional; máx. 200 chars |

---

## 7. User Stories com Critérios de Aceitação

### US-01 — Ler um bloco de conteúdo
**Como** aluno, **quero** ler um micro-bloco de conteúdo fragmentado **para** aprender sem me sentir sobrecarregado.

**Critérios de Aceitação:**
- [ ] O bloco exibe no máximo 8 linhas de texto + ilustração + fórmula renderizada.
- [ ] Ao clicar em "Concluir leitura", o aluno recebe +10 pts uma única vez.
- [ ] O bloco muda visualmente para "concluído" (ícone de check).
- [ ] Segunda leitura do mesmo bloco não gera pontos.

---

### US-02 — Responder um checkpoint
**Como** aluno, **quero** responder perguntas no meio do conteúdo **para** verificar meu aprendizado e ganhar pontos.

**Critérios de Aceitação:**
- [ ] A pergunta exibe 2 a 4 alternativas.
- [ ] Ao acertar: aparece animação de recompensa + "+20 pts".
- [ ] Ao errar: aparece explicação gentil, sem desconto de pontos.
- [ ] Não é possível responder novamente após acerto.

---

### US-03 — Plantar uma árvore na reserva
**Como** aluno, **quero** comprar e plantar uma árvore na minha reserva **para** ver meu progresso de forma visual.

**Critérios de Aceitação:**
- [ ] A loja exibe apenas árvores do tier desbloqueado pelo usuário.
- [ ] Árvores de tier superior aparecem com cadeado e tooltip explicativo.
- [ ] Ao comprar, os pontos são deduzidos e a árvore aparece no mapa.
- [ ] A árvore pode ser posicionada pelo usuário no mapa (drag or click).
- [ ] Hover na árvore exibe nome científico e curiosidade ecológica.

---

### US-04 — Desbloquear um novo bioma
**Como** aluno, **quero** desbloquear novos biomas ao acumular pontos **para** ter acesso a árvores mais raras.

**Critérios de Aceitação:**
- [ ] Ao atingir os pontos necessários, uma notificação celebra o desbloqueio.
- [ ] O novo bioma aparece disponível na loja e na reserva.
- [ ] O background da reserva muda para refletir o bioma mais recente.

---

### US-05 — Publicar uma resolução no feed
**Como** aluno, **quero** publicar uma resolução **para** ajudar colegas e ganhar pontos extras.

**Critérios de Aceitação:**
- [ ] O aluno recebe +15 pts imediatamente ao submeter.
- [ ] O post entra como `pending` e não aparece no feed público ainda.
- [ ] A IA analisa e responde em até 30 segundos.
- [ ] Se aprovado: post aparece publicamente, aluno ganha +50 pts + bônus.
- [ ] Se reprovado: aluno recebe feedback privado, post não aparece.

---

### US-06 — Visitar a floresta de um colega
**Como** aluno, **quero** visitar a reserva florestal de colegas **para** ver seu progresso e me motivar.

**Critérios de Aceitação:**
- [ ] Qualquer usuário pode acessar `/forest/:userId` de um perfil público.
- [ ] O mapa exibe as árvores do colega com nome e raridade.
- [ ] O modo visita não exibe botões de compra.
- [ ] Exibe tier atual, total de pontos e streak do colega.

---

### US-07 — Manter streak de estudo
**Como** aluno, **quero** ser recompensado por estudar todos os dias **para** manter o hábito.

**Critérios de Aceitação:**
- [ ] Ao acessar a plataforma em dias consecutivos, o streak incrementa.
- [ ] Um badge animado de chama exibe o número de dias.
- [ ] O multiplicador de pontos do dia é exibido no dashboard.
- [ ] Se o aluno perde um dia, o streak reinicia para 1.

---

### US-08 — Acessibilidade para usuários com baixa familiaridade tecnológica
**Como** usuário idoso ou com baixa experiência digital, **quero** navegar sem dificuldade.

**Critérios de Aceitação:**
- [ ] Botões têm mínimo de 44×44px (padrão WCAG).
- [ ] Fonte mínima de 16px em todo o conteúdo.
- [ ] Contraste de texto segue WCAG AA (razão ≥ 4.5:1).
- [ ] Nenhum elemento crítico depende apenas de hover (deve ter tap/click).
- [ ] Opção de ativar fonte OpenDyslexic nas configurações.

---

## 8. Roadmap de Implementação

### Fase 1 — Fundação (Semanas 1–3)

- [ ] Setup do repositório (monorepo ou separado frontend/backend)
- [ ] Schema do banco de dados (Prisma migrations)
- [ ] Seed inicial: biomas, árvores, 1 matéria (ICTA13) com 5 blocos
- [ ] Auth: cadastro, login, JWT
- [ ] API: `GET /subjects/:code/blocks`
- [ ] Frontend: página de conteúdo com `<ContentBlock />` e `<Checkpoint />`
- [ ] Sistema básico de pontuação (`point_events`, `POST /blocks/:id/complete`)

**Entregável:** aluno consegue se cadastrar, ler um bloco e ganhar pontos.

---

### Fase 2 — Floresta e Gamificação (Semanas 4–6)

- [ ] API: biomas, árvores, `POST /forest/plant`
- [ ] Frontend: `<ForestMap />` com canvas/SVG
- [ ] Frontend: `<TreeShop />` com filtros e validação de tier
- [ ] Lógica de desbloqueio automático de biomas
- [ ] Sistema de streak (`streak_days`, multiplicador)
- [ ] `<PointsToast />` e `<StreakBadge />`
- [ ] Página de perfil público da floresta

**Entregável:** aluno planta árvores, vê sua floresta crescer e pode visitar a floresta de colegas.

---

### Fase 3 — Comunidade e IA (Semanas 7–9)

- [ ] Integração com API Claude para validação de posts
- [ ] API: `POST /posts`, `GET /posts`, `POST /posts/:id/like`
- [ ] Frontend: `<CommunityPage />` com feed paginado
- [ ] Frontend: formulário de submissão de resolução
- [ ] Sistema de feedback privado (reprovado) vs. público (aprovado)
- [ ] Tracking de tempo ativo (`POST /points/track-time`)
- [ ] Ranking de pontos e biodiversidade

**Entregável:** feed funcional com validação por IA, ranking completo, sistema de pontuação total.

---

### Fase 4 — Polimento e Acessibilidade (Semanas 10–11)

- [ ] Auditoria de acessibilidade (WCAG AA)
- [ ] Fonte OpenDyslexic como opção nas configurações
- [ ] Testes em mobile (responsividade)
- [ ] Micro-animações: plantio de árvore, desbloqueio de bioma, acerto de checkpoint
- [ ] Otimização de performance (lazy load de imagens, paginação)
- [ ] Parser de Markdown/LaTeX para importar novos conteúdos

**Entregável:** plataforma estável, acessível e pronta para teste com usuários reais.
