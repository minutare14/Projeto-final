# Análise do Projeto e Features Propostas

> Análise estratégica do estado atual e proposta de features para fortalecer o produto.

---

## Diagnóstico do Estado Atual

### O que está sólido
- **Mecânica central** — micro-blocos → pontos → árvores → biomas. Loop de engajamento claro.
- **Validação por IA** — diferencial real, dificilmente replicável por concorrentes.
- **Identidade visual brasileira** — biodiversidade como tema é único no mercado edtech.
- **Modelagem de dados** — schema cobre 90% dos fluxos previstos.

### O que está faltando ou frágil
1. **Não há gatilho de retorno diário** — só o streak. Precisa de algo que o aluno *quer* fazer hoje.
2. **Não há papel de professor** — o conteúdo é criado só por seed manual.
3. **Não há ponte com o mundo real** — a floresta é 100% virtual, sem impacto tangível.
4. **Ausência de feedback longitudinal** — o aluno não vê sua evolução ao longo do tempo.
5. **IA está subutilizada** — só valida posts; poderia tutorar, gerar conteúdo, personalizar.
6. **Sem mecânicas colaborativas** — a interação social é passiva (visitar floresta, curtir post).
7. **Acessibilidade ainda básica** — falta TTS, modo escuro, navegação por teclado.

---

## Features Propostas — Visão Geral

| # | Feature | Categoria | Prioridade | Complexidade |
|---|---|---|---|---|
| 1 | Missões Diárias | Engajamento | 🔴 Alta | Baixa |
| 2 | Conquistas (Achievements) | Engajamento | 🔴 Alta | Baixa |
| 3 | Eventos Sazonais | Engajamento | 🟡 Média | Média |
| 4 | Modo Professor | Educacional | 🔴 Alta | Alta |
| 5 | Tutor IA Conversacional | Educacional | 🔴 Alta | Média |
| 6 | Revisão Espaçada | Educacional | 🟡 Média | Média |
| 7 | Floresta Colaborativa (Turmas) | Social | 🟡 Média | Alta |
| 8 | Sistema de Mentor-Aluno | Social | 🟢 Baixa | Média |
| 9 | Fauna Visitante | Gamificação | 🟡 Média | Baixa |
| 10 | Plantio Real (ONG parceira) | Impacto | 🔴 Alta | Alta |
| 11 | Contador de CO₂ Simbólico | Impacto | 🟢 Baixa | Baixa |
| 12 | Modo Áudio (TTS) | Acessibilidade | 🔴 Alta | Baixa |
| 13 | Dashboard Pessoal | Analytics | 🟡 Média | Média |
| 14 | Importador de Conteúdo por IA | Educacional | 🟡 Média | Alta |
| 15 | Notificações Inteligentes | Engajamento | 🟡 Média | Baixa |

---

## 1. Missões Diárias

### Problema que resolve
O aluno entra na plataforma sem saber o que fazer primeiro. Falta um objetivo claro do dia.

### Como funciona
3 a 4 missões geradas todo dia às 00h:
- "Leia 3 blocos de qualquer matéria" → +50 pts bônus
- "Acerte 5 checkpoints" → +30 pts bônus
- "Plante 1 árvore nova" → desbloqueia 1 semente rara grátis
- "Curta 2 posts de colegas" → +20 pts

### Implementação
**Nova tabela:**
```prisma
model DailyMission {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  type        String   // "read_blocks", "checkpoints", "plant_tree", "social"
  target      Int      // ex: 3 blocos
  progress    Int      @default(0)
  rewardPoints Int     @map("reward_points")
  completed   Boolean  @default(false)
  expiresAt   DateTime @map("expires_at")
  createdAt   DateTime @default(now())
}
```

**Cron job (Node.js + node-cron):**
- 00:01 todo dia → gera 3 missões aleatórias para cada usuário ativo nos últimos 7 dias.

**API:**
- `GET /missions/today` → lista missões do dia
- Cada evento de pontuação verifica e atualiza progresso automaticamente.

---

## 2. Conquistas (Achievements)

### Problema que resolve
Não há reconhecimento de marcos importantes. Plantar a 100ª árvore deveria ter peso simbólico.

### Como funciona
Badges desbloqueáveis baseados em marcos:
- **"Primeira Semente"** — plantou a primeira árvore
- **"Guardião da Caatinga"** — plantou 10 árvores na Caatinga
- **"Veterano"** — atingiu Tier 3
- **"Curador"** — teve 50 posts aprovados pela IA
- **"Polinizador"** — recebeu 100 likes em posts
- **"Reserva Centenária"** — 100 árvores plantadas
- **"Lendário"** — possui uma árvore lendária

### Implementação
**Nova tabela:**
```prisma
model Achievement {
  id          Int    @id @default(autoincrement())
  code        String @unique         // "first_seed", "caatinga_guardian"
  name        String
  description String
  iconUrl     String
  criteria    Json   // { type: "tree_count", value: 100, biome: 1 }
}

model UserAchievement {
  userId        String
  achievementId Int
  unlockedAt    DateTime @default(now())
  @@id([userId, achievementId])
}
```

**Job de verificação:** executa após cada evento de pontuação importante (plantio, post aprovado, etc.) e checa critérios pendentes.

---

## 3. Eventos Sazonais

### Problema que resolve
A plataforma é estática. Não há motivo para o aluno voltar em outubro vs. novembro.

### Como funciona
Eventos de 7-14 dias temáticos:
- **"Semana do Cerrado"** (setembro) → árvores do Cerrado com desconto de 30%
- **"Mês da Mata Atlântica"** (maio) → ipês raros aparecem na loja
- **"Festival do Pau-Brasil"** (abril) → o lendário Pau-Brasil fica disponível por 50% off

### Implementação
**Nova tabela:**
```prisma
model SeasonalEvent {
  id           Int      @id @default(autoincrement())
  name         String
  startsAt     DateTime
  endsAt       DateTime
  discountPct  Int      // 0-100
  biomeFilter  Int?     // bioma alvo, se houver
  rarityFilter String?
  bannerUrl    String?
}
```

**Lógica:** ao consultar a loja de árvores, o backend aplica modificadores dos eventos ativos no preço.

---

## 4. Modo Professor

### Problema que resolve
Hoje só desenvolvedores conseguem adicionar conteúdo. O sistema precisa escalar para múltiplas matérias e instituições.

### Como funciona
Professor cria conta com role `teacher`, e ganha:
- Painel para criar/editar matérias
- Editor de blocos com preview de Markdown + LaTeX
- Visualização de progresso dos alunos da sua turma
- Estatísticas de quais blocos têm maior taxa de erro nos checkpoints (sinal de dificuldade)

### Implementação
**Alterações em `users`:**
```prisma
model User {
  // ... campos existentes
  role  UserRole @default(student)
}

enum UserRole {
  student
  teacher
  admin
}
```

**Nova tabela:**
```prisma
model Class {
  id        String   @id @default(uuid())
  teacherId String
  subjectId Int
  name      String   // "ICTA13 - Turma A 2026.1"
  joinCode  String   @unique  // código de 6 chars
  students  ClassEnrollment[]
}

model ClassEnrollment {
  classId   String
  studentId String
  joinedAt  DateTime @default(now())
  @@id([classId, studentId])
}
```

**Rotas novas:**
- `POST /teacher/subjects` — criar matéria
- `POST /teacher/blocks` — criar bloco com checkpoints inline
- `GET /teacher/classes/:id/analytics` — taxa de conclusão, blocos com mais erro
- `POST /classes/join` — aluno entra com código

---

## 5. Tutor IA Conversacional

### Problema que resolve
Quando o aluno tem dúvida no meio do bloco, ele para de estudar. Precisa de algo pra desbloquear na hora.

### Como funciona
Botão "Pedir ajuda ao Tutor" em cada bloco. Abre chat lateral onde a IA:
- Tem contexto do bloco atual
- Pode usar exemplos personalizados
- Sugere analogias com biodiversidade brasileira (consistência temática)
- Não dá a resposta direta dos checkpoints — guia o raciocínio

### Implementação
**Novo serviço:** `backend/src/services/tutor.ts`

```typescript
async function askTutor(blockId: string, userQuestion: string, history: Message[]) {
  const block = await prisma.contentBlock.findUnique({ where: { id: blockId }});

  const systemPrompt = `
Você é o Tutor da Reserva Florestal. Está ajudando um aluno a entender:
"${block.title}"

Conteúdo do bloco:
${block.body}

Regras:
- Use linguagem simples e exemplos do dia a dia.
- NUNCA entregue a resposta de checkpoints diretamente.
- Sempre que possível, conecte com biodiversidade brasileira.
- Máximo 4 parágrafos por resposta.
`;

  return await claude.messages.create({
    model: "claude-sonnet-4-6",
    system: systemPrompt,
    messages: [...history, { role: "user", content: userQuestion }],
  });
}
```

**Nova tabela:**
```prisma
model TutorConversation {
  id        String   @id @default(uuid())
  userId    String
  blockId   String
  messages  Json     // array de { role, content, timestamp }
  createdAt DateTime @default(now())
}
```

---

## 6. Revisão Espaçada (Spaced Repetition)

### Problema que resolve
Aluno aprende, esquece e nunca mais revisita. Conteúdo evapora.

### Como funciona
Algoritmo SM-2 (do Anki) calcula quando o aluno deve revisar um bloco. Notifica:
- "Você aprendeu *Matrizes* há 3 dias. Hora de revisar!"

A revisão é um mini-quiz com 1-3 checkpoints do bloco. Acertar reforça a memória e dá pontos.

### Implementação
**Nova tabela:**
```prisma
model ReviewSchedule {
  id            String   @id @default(uuid())
  userId        String
  blockId       String
  easeFactor    Float    @default(2.5)
  intervalDays  Int      @default(1)
  nextReviewAt  DateTime
  repetitions   Int      @default(0)
}
```

**Lógica SM-2:** após um checkpoint, atualizar `easeFactor` baseado no acerto. Errar → intervalo curto. Acertar com facilidade → intervalo longo.

---

## 7. Floresta Colaborativa (Turmas)

### Problema que resolve
Toda floresta é individual. Falta um senso de "construir junto".

### Como funciona
Cada turma tem uma **Reserva Coletiva** além das individuais. Cada aluno contribui com X% dos seus pontos para a reserva da turma. Quando todos colaboram, biomas raros são desbloqueados coletivamente.

Visualização: mapa gigante onde todas as árvores aparecem, marcadas com o avatar de quem plantou.

### Implementação
**Nova tabela:**
```prisma
model ClassForest {
  classId       String
  treeId        Int
  plantedById   String
  posX          Float
  posY          Float
  plantedAt     DateTime
  @@id([classId, treeId, plantedById])
}
```

**Mecânica:** ao plantar, aluno escolhe "minha reserva" ou "reserva da turma". A turma pode votar (sistema de propostas) sobre quais árvores plantar a seguir.

---

## 8. Sistema de Mentor-Aluno

### Problema que resolve
Veteranos não têm incentivo para ajudar calouros. Posts validados pela IA são úteis, mas falta o calor humano.

### Como funciona
Alunos Tier 4+ podem se candidatar a mentor. São pareados com calouros que aceitarem orientação.

Mentor ganha:
- +30 pts por dia ativo no chat com mentorado
- Badge "Mentor"
- Acesso a árvores exclusivas (Mentor Edition)

### Implementação
**Nova tabela:**
```prisma
model Mentorship {
  id          String   @id @default(uuid())
  mentorId    String
  menteeId    String
  status      String   // "active", "ended"
  startedAt   DateTime @default(now())
  endedAt     DateTime?
}
```

---

## 9. Fauna Visitante

### Problema que resolve
A floresta é estática. Plantar árvore é satisfatório, mas o cenário não evolui.

### Como funciona
Conforme o aluno planta árvores específicas, animais nativos aparecem visitando a reserva:
- Plantou 3 ipês → **borboletas** aparecem
- Plantou Mandacaru + Xique-Xique → **arara-azul-de-Lear** aparece
- Plantou Castanheira → **cutia** aparece (dispersora natural)
- Plantou 5 árvores frutíferas → **tucano**

Animação leve: animais cruzam a tela, pousam, somem.

### Implementação
**Nova tabela:**
```prisma
model FaunaSpecies {
  id          Int    @id @default(autoincrement())
  name        String
  scientific  String
  description String
  spriteUrl   String
  triggerLogic Json  // { type: "tree_combo", trees: [1,4], minCount: 3 }
}

model UserFauna {
  userId    String
  faunaId   Int
  unlockedAt DateTime @default(now())
  @@id([userId, faunaId])
}
```

**Frontend:** sistema de partículas/sprites que renderiza animais aleatoriamente sobre o `<ForestMap />`.

---

## 10. Plantio Real (Parceria com ONG)

### Problema que resolve
O impacto é só virtual. Falta a ponte com o mundo real para fechar o ciclo de propósito.

### Como funciona
A cada **100 árvores virtuais** plantadas por um usuário, a plataforma planta **1 árvore real** via parceria com ONG (SOS Mata Atlântica, Instituto Terra, etc.).

Cada árvore real plantada vira um certificado digital exibido no perfil do aluno, com:
- Foto da árvore real
- GPS do plantio
- Espécie e bioma
- Data

### Implementação
**Nova tabela:**
```prisma
model RealPlanting {
  id          String   @id @default(uuid())
  userId      String
  ngoPartner  String   // "SOS Mata Atlântica"
  species     String
  location    String
  gpsLat      Float
  gpsLng      Float
  photoUrl    String
  plantedAt   DateTime
  certificateUrl String
}
```

**Estratégia de execução:**
- Fase 1: parcerias simbólicas (1 árvore real para cada 1.000 virtuais), bancadas pela plataforma.
- Fase 2: sistema de doação opcional (usuário converte pontos em doação).
- Fase 3: integração com APIs de ONGs como [SOS Mata Atlântica](https://www.sosma.org.br/).

---

## 11. Contador de CO₂ Simbólico

### Problema que resolve
Falta tornar visível o impacto ambiental do estudo (mesmo que simbólico).

### Como funciona
No perfil de cada aluno:
> "Sua reserva representa **2.4 toneladas de CO₂** que seriam capturadas se fosse real."

Cálculo: cada espécie tem um valor de absorção média de CO₂/ano (dado científico). Soma das árvores → estimativa total.

### Implementação
Adicionar campo na tabela `trees`:
```prisma
model Tree {
  // ... campos existentes
  co2AbsorptionKgYear Float  @default(22)  // média global
}
```

**Cálculo:** `SUM(tree.co2AbsorptionKgYear)` para todas as árvores do usuário. Exibido no dashboard.

---

## 12. Modo Áudio (TTS)

### Problema que resolve
Idosos, disléxicos e usuários com fadiga visual precisam de leitura por áudio.

### Como funciona
Botão "Ouvir bloco" em cada `<ContentBlock />`. Usa Web Speech API (gratuita) ou API externa (ElevenLabs para qualidade superior).

Controles: play/pause, velocidade (0.75x, 1x, 1.25x, 1.5x).

### Implementação
```typescript
function useTTS(text: string) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'pt-BR';
  utter.rate = 1.0;
  speechSynthesis.speak(utter);
}
```

**Componente:** `<AudioPlayer text={block.body} />` com ícones de play/pause.

**Limitação:** Web Speech API é gratuita mas voz robótica. Para premium → integrar ElevenLabs com vozes brasileiras realistas.

---

## 13. Dashboard Pessoal

### Problema que resolve
Aluno não vê sua própria evolução. Falta uma "tela de status" rica.

### Como funciona
Página `/dashboard` com:
- **Gráfico de pontos por dia** (últimos 30 dias)
- **Heatmap de estudo** (estilo GitHub contributions)
- **Matérias dominadas** (% de blocos completos)
- **Próximo bioma a desbloquear** (barra de progresso)
- **Comparação com a turma** (você está acima da média)
- **Melhor horário de estudo** (insight baseado em dados)

### Implementação
**API:**
- `GET /dashboard/stats` → agrega `point_events`, `user_progress`, `user_forest`.

**Frontend:** Chart.js ou Recharts para gráficos. Cache de 5min para evitar recalcular.

---

## 14. Importador de Conteúdo por IA

### Problema que resolve
Criar 100 blocos manualmente é inviável. Professor precisa de uma ferramenta para colar PDF/texto e gerar o conteúdo fragmentado.

### Como funciona
Professor cola um texto grande (ex: capítulo de livro). A IA:
1. Identifica conceitos principais
2. Fragmenta em blocos de 5-8 linhas
3. Identifica fórmulas e extrai LaTeX
4. Gera 1-2 checkpoints por bloco
5. Sugere ilustrações (descrição em texto, para o professor pegar imagem livre)

### Implementação
**Prompt do gerador:**
```
Você é um designer instrucional especializado em fragmentar conteúdo denso
em micro-blocos didáticos.

Receberá um texto longo. Retorne JSON com array de blocos no formato:
[
  {
    "title": "...",
    "body": "...",   // máx 8 linhas
    "has_formula": true,
    "formula_latex": "...",
    "checkpoints": [{
      "question": "...",
      "options": ["a", "b", "c", "d"],
      "correct": "b",
      "explanation": "..."
    }]
  }
]
```

**API:**
- `POST /teacher/import-content` → recebe `{ raw_text, subject_id }`, retorna preview dos blocos. Professor edita e confirma.

---

## 15. Notificações Inteligentes

### Problema que resolve
Aluno esquece de voltar. Falta um chamado contextual e respeitoso.

### Como funciona
Notificações via:
- Email (resumo semanal)
- Push web (in-browser)
- Push mobile (futuro)

Tipos:
- "Sua árvore *Ipê Amarelo* está florescendo virtualmente! Venha ver."
- "Hora de revisar *Matrizes* — você acertou tudo da última vez, vamos manter?"
- "Maria curtiu seu post sobre transformações lineares."
- "Faltam apenas 80 pontos para desbloquear o **Pantanal**."

### Implementação
**Nova tabela:**
```prisma
model Notification {
  id        String   @id @default(uuid())
  userId    String
  type      String
  title     String
  body      String
  link      String?
  readAt    DateTime?
  createdAt DateTime @default(now())
}
```

**Regras:** máximo 1 push por dia. Email semanal opcional. Aluno pode desativar tudo nas configurações.

---

## Roadmap Sugerido de Adição

### Sprint Bônus 1 — Engajamento Diário (Fase 2.5)
- ✅ Missões Diárias (#1)
- ✅ Conquistas (#2)
- ✅ Notificações Inteligentes (#15)

**Por quê:** baixa complexidade, alto impacto na retenção. Triplica os motivos para voltar.

---

### Sprint Bônus 2 — IA Expandida (Fase 3.5)
- ✅ Tutor IA Conversacional (#5)
- ✅ Importador de Conteúdo por IA (#14)
- ✅ Modo Áudio (#12)

**Por quê:** torna a IA central, escala o conteúdo, melhora acessibilidade.

---

### Sprint Bônus 3 — Educacional Pro (Pós-MVP)
- ✅ Modo Professor (#4)
- ✅ Revisão Espaçada (#6)
- ✅ Dashboard Pessoal (#13)

**Por quê:** transforma o produto em plataforma vendável para universidades.

---

### Sprint Bônus 4 — Impacto e Comunidade (V2.0)
- ✅ Plantio Real (#10)
- ✅ Floresta Colaborativa (#7)
- ✅ Fauna Visitante (#9)
- ✅ Eventos Sazonais (#3)
- ✅ Contador de CO₂ (#11)
- ✅ Mentor-Aluno (#8)

**Por quê:** features de aprofundamento e diferenciação. Reforçam propósito ambiental e social.

---

## Recomendação Final

Para o **MVP** (entrega final do projeto acadêmico):
- Implementar Fases 1-3 do SDD original.
- **Adicionar apenas #1 (Missões Diárias) e #2 (Conquistas)** — são quick wins que demonstram maturidade do produto sem custo alto de desenvolvimento.
- **Documentar todas as outras features no roadmap** — mostra visão de produto de longo prazo, valorizando o trabalho acadêmico.

Para **versão pós-acadêmica** (caso queira evoluir o projeto):
- Priorizar #5 (Tutor IA) — alto valor percebido.
- Priorizar #10 (Plantio Real) — transforma o projeto em algo com impacto social real e potencial de captação de recursos.
