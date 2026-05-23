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
| IA | API Claude (Anthropic) | Validação de posts, importação de conteúdo e feedback pedagógico |
| Fórmulas | KaTeX | Renderização leve de LaTeX no browser |
| Auth | NextAuth.js | Login social (Google) + email/senha |
| ORM | Prisma | Migrations e tipagem automática |
| Jobs agendados | node-cron | Geração de missões diárias e notificações |
| Hospedagem | Vercel (frontend) + Railway (backend + PG) | Deploy simples para MVP |

---

## 2. Modelagem de Dados

### 2.1 `users`

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT,
  avatar_url    TEXT,
  role          VARCHAR(20) NOT NULL DEFAULT 'student'
                CHECK (role IN ('student','teacher','admin')),
  total_points  INTEGER NOT NULL DEFAULT 0,
  current_tier  INTEGER NOT NULL DEFAULT 1,
  streak_days   INTEGER NOT NULL DEFAULT 0,
  last_active   TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW()
);
```

### 2.2 `biomes`

```sql
CREATE TABLE biomes (
  id               SERIAL PRIMARY KEY,
  name             VARCHAR(60) NOT NULL,
  tier             INTEGER UNIQUE NOT NULL,
  points_required  INTEGER NOT NULL,
  description      TEXT,
  background_url   TEXT
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
  id                    SERIAL PRIMARY KEY,
  common_name           VARCHAR(100) NOT NULL,
  scientific_name       VARCHAR(120),
  biome_id              INTEGER REFERENCES biomes(id),
  tier_required         INTEGER NOT NULL,
  cost_points           INTEGER NOT NULL,
  rarity                VARCHAR(20) NOT NULL
                        CHECK (rarity IN ('comum','incomum','raro','epico','lendario')),
  description           TEXT,
  fun_fact              TEXT,
  illustration_url      TEXT,
  co2_absorption_kg_year FLOAT NOT NULL DEFAULT 22.0
);

-- co2_absorption_kg_year: estimativa científica de absorção média anual por espécie.
-- Usado no Contador de CO₂ Simbólico (feature #11).
-- Seed detalhado em: prisma/seed.ts
```

### 2.4 `user_forest`

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

### 2.5 `user_biomes`

```sql
CREATE TABLE user_biomes (
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  biome_id      INTEGER REFERENCES biomes(id),
  unlocked_at   TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, biome_id)
);
```

### 2.6 `subjects`

```sql
CREATE TABLE subjects (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR(20) UNIQUE NOT NULL,
  name        VARCHAR(120) NOT NULL,
  description TEXT,
  created_by  UUID REFERENCES users(id)   -- professor que criou
);
```

### 2.7 `content_blocks`

```sql
CREATE TABLE content_blocks (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id     INTEGER REFERENCES subjects(id),
  order_index    INTEGER NOT NULL,
  title          VARCHAR(200),
  body           TEXT NOT NULL,
  has_formula    BOOLEAN DEFAULT FALSE,
  formula_latex  TEXT,
  illustration   TEXT,
  points_reward  INTEGER NOT NULL DEFAULT 10,
  created_at     TIMESTAMP DEFAULT NOW()
);
```

### 2.8 `checkpoints`

```sql
CREATE TABLE checkpoints (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id       UUID REFERENCES content_blocks(id) ON DELETE CASCADE,
  question       TEXT NOT NULL,
  option_a       TEXT NOT NULL,
  option_b       TEXT NOT NULL,
  option_c       TEXT,
  option_d       TEXT,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('a','b','c','d')),
  explanation    TEXT,
  points_reward  INTEGER NOT NULL DEFAULT 20
);
```

### 2.9 `user_progress`

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

### 2.10 `posts`

```sql
CREATE TABLE posts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  subject_id     INTEGER REFERENCES subjects(id),
  body           TEXT NOT NULL,
  status         VARCHAR(20) DEFAULT 'pending'
                 CHECK (status IN ('pending','approved','rejected')),
  ai_feedback    TEXT,
  ai_bonus_score INTEGER DEFAULT 0,
  is_public      BOOLEAN DEFAULT FALSE,
  likes_count    INTEGER DEFAULT 0,
  created_at     TIMESTAMP DEFAULT NOW()
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

### 2.12 `point_events`

```sql
CREATE TABLE point_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  source     VARCHAR(40) NOT NULL,
  -- valores: 'block_read', 'checkpoint', 'post_submit', 'post_approved',
  --          'like_received', 'time_active', 'streak_bonus', 'mission_complete',
  --          'achievement', 'mentor_bonus', 'tree_purchase' (negativo)
  points     INTEGER NOT NULL,
  metadata   JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2.13 `daily_missions` — Feature #1

```sql
CREATE TABLE daily_missions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  type          VARCHAR(40) NOT NULL,
  -- tipos: 'read_blocks', 'answer_checkpoints', 'plant_tree',
  --        'social_like', 'post_resolution', 'visit_forest'
  target        INTEGER NOT NULL,
  progress      INTEGER NOT NULL DEFAULT 0,
  reward_points INTEGER NOT NULL,
  reward_type   VARCHAR(20) DEFAULT 'points',
  -- reward_type: 'points' | 'rare_seed' (bônus especial)
  completed     BOOLEAN DEFAULT FALSE,
  expires_at    TIMESTAMP NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);
```

**Geração:** cron job às 00:01 todo dia. Cria 3 missões aleatórias por usuário ativo nos últimos 7 dias. Missões expiram às 23:59 do mesmo dia.

### 2.14 `achievements` — Feature #2

```sql
CREATE TABLE achievements (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR(60) UNIQUE NOT NULL,
  name        VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  icon_url    TEXT,
  criteria    JSONB NOT NULL
  -- ex: { "type": "tree_count", "value": 10, "biome_id": 1 }
  -- ex: { "type": "post_approved", "value": 50 }
  -- ex: { "type": "tier_reached", "value": 3 }
  -- ex: { "type": "total_points", "value": 1000 }
  -- ex: { "type": "streak_days", "value": 7 }
);

-- Seed de conquistas:
-- ('first_seed',        'Primeira Semente',       { type: 'tree_count', value: 1 })
-- ('caatinga_guardian', 'Guardião da Caatinga',   { type: 'tree_count', value: 10, biome_id: 1 })
-- ('tier_3',            'Veterano',               { type: 'tier_reached', value: 3 })
-- ('curator',           'Curador',                { type: 'post_approved', value: 50 })
-- ('pollinator',        'Polinizador',            { type: 'likes_received', value: 100 })
-- ('century_reserve',   'Reserva Centenária',     { type: 'tree_count', value: 100 })
-- ('legendary_one',     'Lendário',               { type: 'rarity_owned', value: 'lendario' })
-- ('week_streak',       'Semana Perfeita',        { type: 'streak_days', value: 7 })
-- ('thousand_points',   'Mil Pontos',             { type: 'total_points', value: 1000 })

CREATE TABLE user_achievements (
  user_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES achievements(id),
  unlocked_at    TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);
```

### 2.15 `classes` e `class_enrollments` — Feature #4

```sql
CREATE TABLE classes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  UUID REFERENCES users(id),
  subject_id  INTEGER REFERENCES subjects(id),
  name        VARCHAR(120) NOT NULL,
  join_code   VARCHAR(8) UNIQUE NOT NULL,  -- código gerado aleatoriamente
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE class_enrollments (
  class_id   UUID REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at  TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (class_id, student_id)
);
```

### 2.16 `class_forest` — Feature #7

```sql
CREATE TABLE class_forest (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id       UUID REFERENCES classes(id) ON DELETE CASCADE,
  tree_id        INTEGER REFERENCES trees(id),
  planted_by_id  UUID REFERENCES users(id),
  pos_x          FLOAT NOT NULL,
  pos_y          FLOAT NOT NULL,
  planted_at     TIMESTAMP DEFAULT NOW()
);

-- Cada turma tem uma reserva coletiva.
-- Aluno destina pontos próprios para plantar na reserva da turma.
-- Pontos gastos na reserva da turma são deduzidos do usuário normalmente.
```

### 2.17 `mentorships` — Feature #8

```sql
CREATE TABLE mentorships (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id  UUID REFERENCES users(id),
  mentee_id  UUID REFERENCES users(id),
  status     VARCHAR(20) DEFAULT 'active'
             CHECK (status IN ('pending','active','ended')),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at   TIMESTAMP,

  CONSTRAINT no_self_mentor CHECK (mentor_id != mentee_id)
);

-- Requisito: mentor precisa ter current_tier >= 4.
-- Mentor recebe +30 pts/dia enquanto status = 'active' e houve interação no dia.
```

### 2.18 `fauna_species` e `user_fauna` — Feature #9

```sql
CREATE TABLE fauna_species (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,       -- ex: "Arara-Azul-de-Lear"
  scientific    VARCHAR(120),
  description   TEXT,
  sprite_url    TEXT NOT NULL,
  trigger_logic JSONB NOT NULL
  -- ex: { "type": "tree_combo", "tree_ids": [3, 7], "min_count": 3 }
  -- ex: { "type": "biome_trees", "biome_id": 1, "min_count": 5 }
);

-- Seed de fauna:
-- Borboleta Morpho:  trigger { biome_id: 3, min_count: 3 } (Mata Atlântica)
-- Arara-Azul-de-Lear: trigger { tree_ids: [mandacaru_id, xique_xique_id], min_count: 2 }
-- Cutia:              trigger { tree_ids: [castanheira_id], min_count: 1 }
-- Tucano:             trigger { type: "fruit_trees", min_count: 5 }
-- Lobo-Guará:         trigger { biome_id: 4, min_count: 4 } (Pantanal)
-- Onça-Pintada:       trigger { biome_id: 5, min_count: 10 } (Amazônia, épico)

CREATE TABLE user_fauna (
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  fauna_id    INTEGER REFERENCES fauna_species(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, fauna_id)
);
```

### 2.19 `real_plantings` — Feature #10

```sql
CREATE TABLE real_plantings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES users(id),
  ngo_partner      VARCHAR(120) NOT NULL,     -- ex: "SOS Mata Atlântica"
  species          VARCHAR(120) NOT NULL,
  location_name    VARCHAR(200),
  gps_lat          FLOAT,
  gps_lng          FLOAT,
  photo_url        TEXT,
  certificate_url  TEXT,
  planted_at       TIMESTAMP NOT NULL,
  virtual_trees_milestone INTEGER NOT NULL    -- quantas árvores virtuais geraram este plantio
);

-- Regra: a cada 100 árvores virtuais plantadas, 1 árvore real é registrada.
-- O sistema notifica o usuário e cria um certificado digital.
```

### 2.20 `notifications` — Feature #15

```sql
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(40) NOT NULL,
  -- tipos: 'mission_available', 'achievement_unlocked', 'biome_unlocked',
  --        'post_approved', 'post_rejected', 'like_received',
  --        'fauna_unlocked', 'real_planting', 'mentor_message',
  --        'streak_reminder', 'review_due'
  title      VARCHAR(120) NOT NULL,
  body       TEXT NOT NULL,
  link       TEXT,
  read_at    TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 3. Regras de Negócio

### 3.1 Pontuação

| Evento | Pontos | Observações |
|---|---|---|
| Bloco lido até o fim | +10 | Idempotente: uma vez por bloco por usuário |
| Checkpoint correto | +20 | Idempotente: uma vez por checkpoint |
| Tempo ativo (por minuto) | +2 | Máx. 30 min/dia (60 pts); requer interação a cada 3 min |
| Post submetido | +15 | Ao submeter, antes da validação |
| Post aprovado pela IA | +50 + bônus | Adicional ao de submissão |
| Like recebido em post | +10 | Sem limite diário |
| Módulo completo (todos blocos) | +100 | Bônus único por módulo |
| Missão diária concluída | variável | Definido em `daily_missions.reward_points` |
| Achievement desbloqueado | +25 | Fixo, ao desbloquear qualquer conquista |
| Mentor ativo no dia | +30 | Para o mentor; requer interação com mentorado no dia |
| Streak (dias consecutivos) | ×1.1/dia | Multiplica todos os pontos do dia; máx ×2.0 |
| Compra de árvore | negativo | Deduz `tree.cost_points` do `total_points` |

### 3.2 Desbloqueio de Biomas

- Ao atingir `total_points >= biome.points_required`, o bioma é desbloqueado automaticamente.
- O desbloqueio é cumulativo — nunca se perde um bioma desbloqueado.
- `current_tier` sempre reflete o maior tier desbloqueado.
- Ao desbloquear, cria notificação `biome_unlocked` e verifica achievements.

### 3.3 Compra de Árvores

- Requisitos: `total_points >= tree.cost_points` **E** `current_tier >= tree.tier_required`.
- Compra deduz pontos de `total_points` e registra evento negativo em `point_events`.
- Após cada compra: verificar desbloqueio de fauna (`user_fauna`) e achievements.
- A cada 100 árvores plantadas (pessoais), registrar evento para `real_plantings`.

### 3.4 Validação de Posts pela IA

1. Aluno submete → status `pending`, `is_public = false`, usuário ganha +15 pts.
2. Backend envia ao agente IA (ver seção 6).
3. IA retorna JSON com `status`, `justificativa`, `bonus_relevancia`.
4. Se `approved`: `is_public = true`, usuário ganha +50 + bônus; notificação `post_approved`.
5. Se `rejected`: post permanece privado; `ai_feedback` salvo; notificação `post_rejected` (privada).
6. Verificar achievement `curator` após aprovação.

### 3.5 Streak

- Se `last_active` for do dia anterior → `streak_days++`.
- Se `last_active` for de 2+ dias atrás → `streak_days = 1`.
- Multiplicador: `min(1.0 + streak_days * 0.1, 2.0)`.
- Verificar achievement `week_streak` ao atingir 7 dias.

### 3.6 Missões Diárias

- Geradas por cron job às 00:01. Expiram às 23:59 do mesmo dia.
- 3 missões por usuário ativo nos últimos 7 dias.
- Seleção aleatória ponderada: tipos mais fáceis aparecem mais.
- Progresso é incrementado automaticamente após cada evento relevante.
- Ao completar: `completed = true`, pontos creditados, notificação `mission_available` suprimida.

**Tipos de missão e alvos possíveis:**

| Tipo | Descrição | Target range | Reward |
|---|---|---|---|
| `read_blocks` | Leia N blocos hoje | 2-5 | 30-60 pts |
| `answer_checkpoints` | Acerte N checkpoints | 3-8 | 40-80 pts |
| `plant_tree` | Plante 1 árvore | 1 | 50 pts |
| `social_like` | Curta N posts | 2-4 | 20-40 pts |
| `post_resolution` | Publique 1 resolução | 1 | 60 pts |
| `visit_forest` | Visite a floresta de 1 colega | 1 | 20 pts |

### 3.7 Conquistas (Achievements)

- Verificadas após cada evento relevante (plantio, pontuação, aprovação, streak).
- Cada achievement só é desbloqueado uma vez por usuário.
- Ao desbloquear: registrar em `user_achievements`, +25 pts, notificação `achievement_unlocked`.
- Verificação é assíncrona (não bloqueia a resposta da API).

### 3.8 Modo Professor

- Usuário com `role = 'teacher'` pode criar matérias e blocos.
- Professores podem criar turmas com `join_code` gerado automaticamente (8 chars alfanuméricos).
- Alunos entram na turma via `POST /classes/join` com o código.
- Professor visualiza progresso dos alunos da sua turma (blocos completados, pontuação).
- Professor pode usar o Importador de Conteúdo por IA para gerar blocos de texto bruto.

### 3.9 Floresta Colaborativa

- Cada turma tem uma reserva coletiva separada (`class_forest`).
- Ao plantar na reserva da turma, o aluno gasta seus pontos normalmente.
- A reserva da turma é visível para todos os membros.
- Não há limite de contribuições por aluno na reserva coletiva.

### 3.10 Mentoria

- Apenas usuários com `current_tier >= 4` podem ser mentores.
- Um mentor pode ter no máximo 3 mentorados simultâneos.
- Mentor ganha +30 pts/dia por mentorado ativo (requer mensagem trocada no dia).
- Mentoria pode ser encerrada por qualquer lado; status muda para `ended`.

### 3.11 Fauna Visitante

- Verificada após cada plantio de árvore.
- `trigger_logic` define a condição (combinação de árvores ou quantidade por bioma).
- Ao desbloquear: fauna aparece animada na reserva, notificação `fauna_unlocked`.
- Fauna é permanente: continua visitando mesmo se árvores forem reposicionadas.

### 3.12 Contador de CO₂

- Calculado em tempo real: `SUM(trees.co2_absorption_kg_year)` para todas as árvores do usuário.
- Exibido no perfil e dashboard como estimativa simbólica educacional.
- Não é dado científico preciso — é aproximação ilustrativa declarada na UI.

### 3.13 Plantio Real

- Disparado automaticamente quando `COUNT(user_forest WHERE user_id = ?) % 100 = 0`.
- Parceiros registrados manualmente pela equipe da plataforma.
- Notificação `real_planting` com certificado digital e dados do plantio.

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
Retorna a reserva florestal pública de um usuário.

**Response:**
```json
{
  "user": { "id", "name", "avatar_url", "current_tier", "total_points", "streak_days" },
  "forest": [
    {
      "id": "uuid",
      "tree": { "common_name", "scientific_name", "rarity", "illustration_url", "fun_fact" },
      "biome": { "name", "tier" },
      "pos_x": 12.5,
      "pos_y": 34.0,
      "planted_at": "2026-05-23T00:00:00Z"
    }
  ],
  "fauna": [{ "name", "sprite_url", "description" }],
  "unlocked_biomes": ["Caatinga", "Cerrado"],
  "co2_kg": 1840.5,
  "achievements": [{ "code", "name", "icon_url", "unlocked_at" }]
}
```

#### `GET /users/:id/stats`
Pontuação, streak, tier, ranking, CO₂, contagem de árvores.

---

### Biomas e Árvores

#### `GET /biomes`
Lista todos os biomas com status de desbloqueio do usuário autenticado.

#### `GET /trees?biome_id=&rarity=&tier=`
Lista árvores com filtros. Inclui `can_buy: boolean` baseado no usuário.

#### `POST /forest/plant`
Compra e planta na reserva pessoal.

**Body:** `{ "tree_id": 4, "pos_x": 10.0, "pos_y": 22.5 }`

**Validações:** pontos suficientes; tier >= tier_required; posição sem colisão.

**Response:** árvore plantada + novo `total_points` + fauna desbloqueada (se houver).

#### `POST /forest/plant-class`
Planta na reserva coletiva da turma. Requer que usuário seja membro de uma turma.

**Body:** `{ "class_id": "uuid", "tree_id": 4, "pos_x": 10.0, "pos_y": 22.5 }`

#### `GET /forest/class/:classId`
Reserva coletiva da turma (pública para membros).

---

### Conteúdo

#### `GET /subjects`
Lista todas as matérias.

#### `GET /subjects/:code/blocks`
Blocos com progresso do usuário autenticado.

#### `POST /blocks/:id/complete`
Marca bloco como lido. Idempotente.

#### `POST /checkpoints/:id/answer`
**Body:** `{ "option": "b" }`
**Response:** `{ "correct": true, "explanation": "...", "points_earned": 20 }`

---

### Professor

#### `POST /teacher/subjects`
Cria uma nova matéria. Requer `role = teacher`.

**Body:** `{ "code": "GEO101", "name": "Geografia Humana", "description": "..." }`

#### `POST /teacher/blocks`
Cria um bloco com checkpoints inline.

**Body:**
```json
{
  "subject_id": 2,
  "order_index": 1,
  "title": "Formação dos Biomas",
  "body": "Markdown...",
  "has_formula": false,
  "checkpoints": [
    {
      "question": "Qual bioma cobre maior área do Brasil?",
      "option_a": "Caatinga",
      "option_b": "Cerrado",
      "option_c": "Amazônia",
      "option_d": "Pantanal",
      "correct_option": "c",
      "explanation": "A Amazônia cobre ~49% do território nacional."
    }
  ]
}
```

#### `POST /teacher/import`
Importa conteúdo bruto via IA. Gera blocos automaticamente.

**Body:** `{ "subject_id": 2, "raw_text": "texto longo aqui..." }`

**Response:** array de blocos gerados para revisão. Professor confirma via `POST /teacher/blocks/confirm`.

#### `POST /teacher/classes`
Cria uma turma. Gera `join_code` automaticamente.

**Body:** `{ "subject_id": 2, "name": "GEO101 - Turma A 2026.1" }`

**Response:** `{ "class_id": "uuid", "join_code": "FLORX3A1" }`

#### `GET /teacher/classes/:id/analytics`
Progresso dos alunos: blocos completados por aluno, checkpoints com maior taxa de erro, distribuição de pontos.

---

### Turmas (Alunos)

#### `POST /classes/join`
Aluno entra em uma turma.

**Body:** `{ "join_code": "FLORX3A1" }`

#### `GET /classes/my`
Lista turmas do aluno autenticado.

---

### Missões Diárias

#### `GET /missions/today`
Lista as 3 missões do dia com progresso atual.

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "read_blocks",
    "description": "Leia 3 blocos hoje",
    "target": 3,
    "progress": 1,
    "reward_points": 50,
    "completed": false,
    "expires_at": "2026-05-23T23:59:00Z"
  }
]
```

---

### Conquistas

#### `GET /achievements`
Lista todos os achievements com status de desbloqueio do usuário.

#### `GET /users/:id/achievements`
Achievements desbloqueados de um perfil público.

---

### Mentoria

#### `GET /mentors`
Lista mentores disponíveis (tier >= 4, com menos de 3 mentorados).

#### `POST /mentorships`
Solicita mentoria.

**Body:** `{ "mentor_id": "uuid" }`

#### `PATCH /mentorships/:id/end`
Encerra uma mentoria.

---

### Feed Social

#### `GET /posts?subject_id=&page=`
Posts públicos aprovados, paginados.

#### `POST /posts`
Submete resolução. Dispara validação assíncrona pela IA.

**Body:** `{ "subject_id": 1, "body": "Texto..." }`

**Response imediata:** `{ "post_id": "uuid", "status": "pending" }`

#### `GET /posts/:id`
Detalhe. Feedback privado só para o autor.

#### `POST /posts/:id/like`
Toggle de like. Idempotente.

---

### Notificações

#### `GET /notifications?page=`
Lista notificações do usuário autenticado (mais recentes primeiro).

#### `PATCH /notifications/:id/read`
Marca como lida.

#### `PATCH /notifications/read-all`
Marca todas como lidas.

---

### Pontuação e Ranking

#### `GET /points/history`
Histórico de eventos de pontuação.

#### `POST /points/track-time`
Registra minuto ativo.

**Body:** `{ "last_interaction_at": "ISO timestamp" }`

**Validação:** `last_interaction_at` <= 3 minutos atrás.

#### `GET /ranking?type=points|biodiversity&limit=20`
- `points`: ordena por `total_points DESC`.
- `biodiversity`: score = `SUM(rarity_weight)` das árvores.

Pesos: comum=1, incomum=2, raro=4, epico=8, lendario=15.

---

### Dashboard

#### `GET /dashboard/stats`
Agrega dados para o dashboard pessoal.

**Response:**
```json
{
  "points_history": [{ "date": "2026-05-23", "points": 120 }],
  "study_heatmap": [{ "date": "2026-05-23", "blocks_read": 4 }],
  "subject_mastery": [{ "subject": "ICTA13", "completion_pct": 67 }],
  "next_biome": { "name": "Cerrado", "points_needed": 180, "total_required": 500 },
  "best_study_hour": 21,
  "class_avg_points": 340,
  "user_points": 320,
  "co2_kg": 1840.5,
  "real_plantings_count": 2
}
```

---

## 5. Especificação de Componentes Frontend

### 5.1 Páginas

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `HomePage` | Landing page com apresentação |
| `/login` | `AuthPage` | Login / cadastro |
| `/dashboard` | `DashboardPage` | Hub do aluno com analytics e missões |
| `/subjects` | `SubjectsPage` | Lista de matérias disponíveis |
| `/subjects/:code` | `SubjectPage` | Blocos de conteúdo da matéria |
| `/forest` | `MyForestPage` | Reserva pessoal + loja de árvores |
| `/forest/:userId` | `PublicForestPage` | Reserva pública de outro usuário |
| `/forest/class/:classId` | `ClassForestPage` | Reserva coletiva da turma |
| `/community` | `CommunityPage` | Feed de posts aprovados |
| `/ranking` | `RankingPage` | Leaderboard de pontos e biodiversidade |
| `/achievements` | `AchievementsPage` | Galeria de conquistas |
| `/missions` | `MissionsPage` | Missões diárias + histórico |
| `/notifications` | `NotificationsPage` | Central de notificações |
| `/mentors` | `MentorsPage` | Lista de mentores disponíveis |
| `/teacher` | `TeacherDashboard` | Painel do professor (role: teacher) |
| `/teacher/import` | `ContentImportPage` | Importador de conteúdo por IA |

---

### 5.2 Componentes Principais

#### `<ContentBlock />`
- Exibe título, corpo Markdown, ilustração, fórmula KaTeX.
- Botão "Ouvir bloco" → dispara TTS via Web Speech API.
- Botão "Concluir leitura" → `POST /blocks/:id/complete`.
- Estado `completed` muda visual (check verde).

#### `<AudioPlayer text={string} />`
- Usa `SpeechSynthesisUtterance` com `lang = 'pt-BR'`.
- Controles: play/pause, velocidade (0.75×, 1×, 1.25×, 1.5×).
- Destaca frase sendo lida (highlight sincronizado via `onboundary`).

#### `<Checkpoint />`
- Exibe pergunta e opções A/B/C/D.
- Após resposta: resultado + explicação + `<PointsToast />`.
- Sem reanswer após acerto.

#### `<ForestMap />`
- Canvas 2D (Konva.js ou SVG) com árvores em posições X/Y.
- Clique em árvore: tooltip com nome científico + `fun_fact` + CO₂.
- Fauna animada: sprites cruzam a tela periodicamente.
- Modo visita: sem botão de compra; exibe badge "Visitando".

#### `<TreeShop />`
- Grid filtrável por bioma e raridade.
- Card: nome, ilustração, custo, raridade (badge colorido), CO₂/ano.
- Botão comprar desabilitado com tooltip se tier ou pontos insuficientes.
- Cadeado visual para tiers bloqueados com "Desbloqueie o [bioma] para comprar".

#### `<MissionCard />`
- Exibe missão com barra de progresso animada.
- Badge "Concluída" ao atingir `progress >= target`.
- Contador regressivo até expiração.

#### `<AchievementBadge />`
- Ícone + nome da conquista.
- Desbloqueada: colorida. Bloqueada: cinza com silhueta.
- Toast de celebração ao desbloquear (confetti animado).

#### `<NotificationBell />`
- Ícone no header com contador de não lidas.
- Dropdown com as 5 mais recentes.
- Link para `/notifications` para ver todas.

#### `<PostCard />`
- Autor, matéria, conteúdo, likes.
- Toggle de like com animação.
- Badge "Mentor" para autores em mentoria ativa.
- Badge "Veterano" para `current_tier >= 3`.

#### `<PointsToast />`
- Notificação flutuante: "+20 pts — checkpoint correto!".
- Anima para cima e desaparece em 2s.

#### `<StreakBadge />`
- Chama animada + número de dias.
- Exibido no header quando `streak_days >= 2`.

#### `<CO2Counter value={number} />`
- Exibe "Sua reserva representa X kg de CO₂" com ícone de folha.
- Tooltip: "Estimativa simbólica baseada na absorção média de cada espécie."

#### `<DashboardChart />`
- Gráfico de linha (Recharts) de pontos por dia.
- Heatmap de estudo estilo GitHub contributions.
- Barra de progresso do próximo bioma.

#### `<TeacherImporter />`
- Textarea para colar texto bruto.
- Botão "Gerar blocos com IA" → `POST /teacher/import`.
- Preview editável dos blocos gerados antes de confirmar.

---

### 5.3 Estados Globais (Zustand)

```ts
interface UserStore {
  user: User | null
  totalPoints: number
  currentTier: number
  streakDays: number
  unlockedBiomes: Biome[]
  unreadNotifications: number
  activeMissions: DailyMission[]
  addPoints: (amount: number, source: string) => void
  completeMission: (missionId: string) => void
  refreshUser: () => Promise<void>
}
```

---

## 6. Engenharia de Prompts — Agente IA

### 6.1 Agente Validador de Posts

**System Prompt:**
```
Você é um Tutor Científico e Botânico da plataforma Reserva Florestal.
Seu papel é avaliar resoluções e explicações publicadas por alunos.

Regras:
1. Analise a precisão lógica e matemática do conteúdo enviado.
2. Seja rigoroso na correção, mas gentil e pedagógico no feedback.
3. NUNCA exponha o erro publicamente — feedback de rejeição é privado.
4. Conecte o feedback a uma curiosidade botânica quando possível.
5. Retorne APENAS o JSON estruturado abaixo, sem texto adicional.
```

**User Prompt (dinâmico):**
```
Matéria: {subject_name}
Post do aluno:
---
{post_body}
---
Avalie e retorne o JSON.
```

**Saída:**
```json
{
  "status": "aprovado | reprovado",
  "justificativa": "explicação pedagógica, máx 300 chars",
  "bonus_relevancia": 0,
  "dica_botanica": "curiosidade opcional, máx 200 chars"
}
```

| Campo | Regra |
|---|---|
| `status` | obrigatório |
| `justificativa` | tom gentil, máx 300 chars |
| `bonus_relevancia` | 0–30; 0 se reprovado |
| `dica_botanica` | opcional; conecta conteúdo a uma espécie |

---

### 6.2 Agente Importador de Conteúdo

**System Prompt:**
```
Você é um designer instrucional especializado em fragmentar conteúdo acadêmico
em micro-blocos didáticos para a plataforma Reserva Florestal.

Regras:
1. Cada bloco deve ter no máximo 8 linhas de texto.
2. Identifique e extraia fórmulas LaTeX quando presentes.
3. Gere 1 checkpoint por bloco (obrigatório), com 2-4 alternativas.
4. Use linguagem acessível, sem jargão desnecessário.
5. Retorne APENAS o array JSON abaixo, sem texto adicional.
```

**User Prompt:**
```
Matéria: {subject_name}
Texto para fragmentar:
---
{raw_text}
---
```

**Saída:**
```json
[
  {
    "title": "Título do bloco",
    "body": "Texto do bloco em Markdown, máx 8 linhas.",
    "has_formula": false,
    "formula_latex": null,
    "checkpoints": [
      {
        "question": "Pergunta de verificação?",
        "option_a": "...",
        "option_b": "...",
        "option_c": "...",
        "option_d": null,
        "correct_option": "b",
        "explanation": "Explicação gentil do porquê."
      }
    ]
  }
]
```

---

## 7. User Stories com Critérios de Aceitação

### US-01 — Ler um bloco de conteúdo
**Como** aluno, **quero** ler micro-blocos fragmentados **para** aprender sem sobrecarga cognitiva.

- [ ] Bloco exibe no máximo 8 linhas + ilustração + fórmula KaTeX.
- [ ] "Concluir leitura" credita +10 pts uma única vez.
- [ ] Bloco muda visualmente para concluído.
- [ ] Segunda leitura não gera pontos.

---

### US-02 — Responder um checkpoint
**Como** aluno, **quero** responder perguntas no meio do conteúdo **para** verificar meu aprendizado.

- [ ] Exibe 2 a 4 alternativas.
- [ ] Acerto: animação + "+20 pts".
- [ ] Erro: explicação gentil, sem desconto.
- [ ] Sem reanswer após acerto.

---

### US-03 — Plantar uma árvore
**Como** aluno, **quero** comprar e plantar árvores **para** ver meu progresso visualmente.

- [ ] Loja exibe apenas árvores do tier desbloqueado.
- [ ] Tiers superiores aparecem com cadeado + tooltip.
- [ ] Compra deduz pontos e árvore aparece no mapa.
- [ ] Hover exibe nome científico + fun_fact + CO₂/ano.

---

### US-04 — Desbloquear um bioma
**Como** aluno, **quero** desbloquear biomas **para** acessar árvores mais raras.

- [ ] Desbloqueio automático ao atingir os pontos.
- [ ] Notificação celebra o evento.
- [ ] Background da reserva muda para o novo bioma.

---

### US-05 — Publicar uma resolução
**Como** aluno, **quero** publicar resoluções **para** ajudar colegas e ganhar pontos.

- [ ] +15 pts ao submeter.
- [ ] Post entra como `pending`.
- [ ] IA responde em até 30 segundos.
- [ ] Aprovado: público + +50 pts + bônus. Reprovado: feedback privado.

---

### US-06 — Visitar floresta de colega
**Como** aluno, **quero** visitar a reserva de colegas **para** me motivar comparando progressos.

- [ ] Perfil público acessível em `/forest/:userId`.
- [ ] Modo visita sem botões de compra.
- [ ] Exibe tier, pontos, streak e fauna do colega.

---

### US-07 — Manter streak
**Como** aluno, **quero** ser recompensado por estudar diariamente **para** manter o hábito.

- [ ] Streak incrementa em dias consecutivos.
- [ ] Badge de chama animada no header.
- [ ] Multiplicador do dia exibido no dashboard.
- [ ] Perde um dia: streak volta para 1.

---

### US-08 — Acessibilidade
**Como** usuário com baixa familiaridade tecnológica, **quero** navegar sem dificuldade.

- [ ] Botões mínimo de 44×44px.
- [ ] Fonte mínima de 16px.
- [ ] Contraste WCAG AA (≥ 4.5:1).
- [ ] Nenhum elemento crítico só em hover.
- [ ] Opção de fonte OpenDyslexic nas configurações.

---

### US-09 — Missões Diárias
**Como** aluno, **quero** ter objetivos claros todo dia **para** saber o que fazer ao entrar na plataforma.

- [ ] 3 missões disponíveis às 00h com barra de progresso.
- [ ] Progresso atualiza em tempo real conforme ações.
- [ ] Missão concluída: badge + pontos creditados.
- [ ] Missões expiram à meia-noite.

---

### US-10 — Conquistas
**Como** aluno, **quero** ser reconhecido por marcos importantes **para** sentir orgulho do meu progresso.

- [ ] Achievement desbloqueado: toast com confetti + +25 pts.
- [ ] Galeria em `/achievements` com desbloqueadas (coloridas) e bloqueadas (silhueta).
- [ ] Achievements aparecem no perfil público.

---

### US-11 — Ouvir conteúdo (TTS)
**Como** usuário com dificuldade de leitura, **quero** ouvir os blocos **para** aprender pelo áudio.

- [ ] Botão "Ouvir" em cada bloco.
- [ ] Leitura em pt-BR com controle de velocidade.
- [ ] Frase atual destacada durante a leitura.
- [ ] Pause/play funcional.

---

### US-12 — Dashboard Pessoal
**Como** aluno, **quero** ver minha evolução ao longo do tempo **para** entender meu ritmo de estudo.

- [ ] Gráfico de pontos por dia (últimos 30 dias).
- [ ] Heatmap de dias estudados.
- [ ] Barra de progresso do próximo bioma.
- [ ] Comparativo com a média da turma.
- [ ] Estimativa de CO₂ da reserva.

---

### US-13 — Modo Professor
**Como** professor, **quero** criar matérias e turmas **para** usar a plataforma com meus alunos.

- [ ] Criar matéria com código e nome.
- [ ] Criar blocos com checkpoints pelo formulário ou importer de IA.
- [ ] Criar turma e receber `join_code`.
- [ ] Ver progresso de cada aluno na turma.
- [ ] Ver quais checkpoints têm maior taxa de erro.

---

### US-14 — Importar Conteúdo com IA
**Como** professor, **quero** colar um texto longo e receber blocos prontos **para** economizar tempo.

- [ ] Textarea aceita texto bruto (até 10.000 chars).
- [ ] IA gera blocos em até 15 segundos.
- [ ] Preview editável antes de confirmar.
- [ ] Confirmação salva todos os blocos na matéria.

---

### US-15 — Floresta da Turma
**Como** aluno, **quero** contribuir para uma reserva coletiva **para** construir algo junto com meus colegas.

- [ ] Opção "Plantar na reserva da turma" ao comprar árvore.
- [ ] Reserva da turma visível para todos os membros.
- [ ] Cada árvore mostra quem plantou.

---

### US-16 — Mentoria
**Como** aluno veterano (Tier ≥ 4), **quero** orientar calouros **para** ajudar e ganhar pontos.

- [ ] Candidatar-se como mentor em `/mentors`.
- [ ] Mentorado pode solicitar orientação.
- [ ] +30 pts/dia por mentorado ativo com interação.
- [ ] Badge "Mentor" visível no perfil e nos posts.

---

### US-17 — Fauna Visitante
**Como** aluno, **quero** ver animais aparecerem na minha reserva **para** tornar minha floresta mais viva.

- [ ] Fauna desbloqueada ao plantar combinações específicas de árvores.
- [ ] Animação de sprite cruzando a reserva periodicamente.
- [ ] Clique no animal exibe nome e descrição ecológica.
- [ ] Galeria de fauna descoberta no perfil.

---

### US-18 — Notificações
**Como** aluno, **quero** ser notificado de eventos importantes **para** não perder nada.

- [ ] Bell no header com contador de não lidas.
- [ ] Notificações para: desbloqueio de bioma, achievement, post aprovado/reprovado, like, fauna, plantio real.
- [ ] Máximo 1 push por tipo por dia.
- [ ] Configuração para desativar tipos específicos.

---

### US-19 — Contador de CO₂
**Como** aluno, **quero** ver o impacto ambiental simbólico da minha reserva **para** entender a importância das árvores.

- [ ] Exibido no dashboard e perfil público.
- [ ] Calculado em tempo real: soma de `co2_absorption_kg_year` das árvores.
- [ ] Tooltip explicando que é estimativa simbólica.

---

### US-20 — Plantio Real
**Como** aluno comprometido, **quero** saber que meu estudo gerou uma árvore real **para** sentir impacto concreto.

- [ ] A cada 100 árvores virtuais, 1 árvore real é plantada via ONG parceira.
- [ ] Notificação com foto, localização e certificado digital.
- [ ] Contador de árvores reais plantadas exibido no perfil.

---

## 8. Roadmap de Implementação

### Fase 1 — Fundação (Semanas 1–3)
- [ ] Setup do repositório (monorepo: `/frontend`, `/backend`, `/prisma`)
- [ ] Schema Prisma completo + migrations
- [ ] Seed: biomas, árvores (30 espécies), achievements, fauna, 1 matéria ICTA13 com 5 blocos
- [ ] Auth: cadastro, login, JWT, roles
- [ ] API: `/subjects/:code/blocks`, `/blocks/:id/complete`, `/checkpoints/:id/answer`
- [ ] Frontend: `<ContentBlock />`, `<Checkpoint />`, `<PointsToast />`
- [ ] Sistema de pontuação base + streak

**Entregável:** aluno cadastra, lê bloco, responde checkpoint, ganha pontos e streak.

---

### Fase 2 — Floresta e Gamificação (Semanas 4–6)
- [ ] API: `/biomes`, `/trees`, `/forest/plant`
- [ ] Frontend: `<ForestMap />`, `<TreeShop />`
- [ ] Desbloqueio automático de biomas
- [ ] `<StreakBadge />`, `<CO2Counter />`
- [ ] Missões Diárias: cron job + API + `<MissionCard />`
- [ ] Conquistas: seed + verificação assíncrona + `<AchievementBadge />`
- [ ] Página pública `/forest/:userId`

**Entregável:** floresta funcional, missões diárias e achievements operando.

---

### Fase 3 — Comunidade e IA (Semanas 7–9)
- [ ] Integração Claude API: agente validador de posts
- [ ] API: `/posts`, `/posts/:id/like`
- [ ] Frontend: `<CommunityPage />`, `<PostCard />`
- [ ] Tracking de tempo ativo
- [ ] Ranking de pontos e biodiversidade
- [ ] Notificações: tabela + API + `<NotificationBell />`
- [ ] Fauna visitante: lógica de trigger + sprites no `<ForestMap />`

**Entregável:** feed com IA, ranking, notificações e fauna na floresta.

---

### Fase 4 — Professor e Turmas (Semanas 10–12)
- [ ] Role `teacher` no schema + proteção de rotas
- [ ] API: `/teacher/subjects`, `/teacher/blocks`, `/teacher/classes`, `/teacher/analytics`
- [ ] Integração Claude API: agente importador de conteúdo
- [ ] Frontend: `<TeacherDashboard />`, `<TeacherImporter />`
- [ ] Floresta coletiva: API `/forest/plant-class`, `/forest/class/:classId`
- [ ] Sistema de mentoria: API + `<MentorsPage />`

**Entregável:** professor cria matéria, turma e acompanha alunos; floresta coletiva funciona.

---

### Fase 5 — Acessibilidade, Dashboard e Impacto (Semanas 13–14)
- [ ] TTS: `<AudioPlayer />` em todos os blocos
- [ ] Fonte OpenDyslexic nas configurações
- [ ] Auditoria WCAG AA (botões, contraste, navegação por teclado)
- [ ] Dashboard pessoal: API `/dashboard/stats` + gráficos Recharts
- [ ] CO₂ simbólico no perfil e dashboard
- [ ] Plantio real: tabela + trigger na 100ª árvore + notificação com certificado
- [ ] Testes em mobile e otimização de performance

**Entregável:** plataforma acessível, com impacto ambiental tangível e analytics completo.
