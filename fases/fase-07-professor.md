# Fase 07 — Professor e Turmas

## Objetivo
Professores conseguem criar matérias, gerar blocos de conteúdo manualmente ou via importador com IA (cola texto bruto → IA fragmenta em blocos com checkpoints), criar turmas e receber código de convite, acompanhar progresso dos alunos da sua turma. Alunos entram em turmas via código e podem plantar em uma reserva coletiva da turma. Sistema de mentoria entre veteranos (tier ≥ 4) e calouros está ativo.

## Pré-requisitos
- Fase 06 concluída — notificações e fauna funcionando
- API Claude já configurada (Fase 05)

## Dependências a Instalar

```bash
npm install nanoid
```

Para gerar `join_code` de 8 chars alfanuméricos.

## Schema Prisma

Adicionar ao `prisma/schema.prisma`:

```prisma
enum UserRole {
  student
  teacher
  admin
}

model User {
  // ... campos existentes
  role UserRole @default(student)

  // novas relações
  classesTeaching   Class[]            @relation("teacher")
  classEnrollments  ClassEnrollment[]
  classPlantings    ClassForest[]
  mentorshipsAsMentor  Mentorship[]    @relation("mentor")
  mentorshipsAsMentee  Mentorship[]    @relation("mentee")
}

model Subject {
  // ... campos existentes
  createdById String? @map("created_by")
}

model Class {
  id         String   @id @default(uuid())
  teacherId  String   @map("teacher_id")
  subjectId  Int      @map("subject_id")
  name       String   @db.VarChar(120)
  joinCode   String   @unique @db.VarChar(8) @map("join_code")
  isActive   Boolean  @default(true) @map("is_active")
  createdAt  DateTime @default(now()) @map("created_at")

  teacher     User              @relation("teacher", fields: [teacherId], references: [id])
  subject     Subject           @relation(fields: [subjectId], references: [id])
  enrollments ClassEnrollment[]
  forest      ClassForest[]
  @@map("classes")
}

model ClassEnrollment {
  classId   String   @map("class_id")
  studentId String   @map("student_id")
  joinedAt  DateTime @default(now()) @map("joined_at")

  class   Class @relation(fields: [classId], references: [id], onDelete: Cascade)
  student User  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  @@id([classId, studentId])
  @@map("class_enrollments")
}

model ClassForest {
  id          String   @id @default(uuid())
  classId     String   @map("class_id")
  treeId      Int      @map("tree_id")
  plantedById String   @map("planted_by_id")
  posX        Float    @map("pos_x")
  posY        Float    @map("pos_y")
  plantedAt   DateTime @default(now()) @map("planted_at")

  class     Class @relation(fields: [classId], references: [id], onDelete: Cascade)
  plantedBy User  @relation(fields: [plantedById], references: [id])
  @@map("class_forest")
}

model Mentorship {
  id        String    @id @default(uuid())
  mentorId  String    @map("mentor_id")
  menteeId  String    @map("mentee_id")
  status    String    @default("active") @db.VarChar(20)
  startedAt DateTime  @default(now()) @map("started_at")
  endedAt   DateTime? @map("ended_at")

  mentor User @relation("mentor", fields: [mentorId], references: [id])
  mentee User @relation("mentee", fields: [menteeId], references: [id])
  @@map("mentorships")
}
```

Migration: `npm run db:migrate -- --name add-teacher-classes-mentorship`

## Tarefas

### Backend — Estrutura
- [ ] Adicionar models ao schema e rodar migration
- [ ] Criar `lib/auth/require-role.ts` com middleware/HOF `requireRole('teacher')`
- [ ] Adicionar endpoint dev para promover usuário a teacher: `POST /api/dev/promote/[id]`

### Backend — Professor
- [ ] Criar `app/api/teacher/subjects/route.ts` (POST) — cria matéria com `createdById`
- [ ] Criar `app/api/teacher/blocks/route.ts` (POST) — cria bloco + checkpoints inline em transação
- [ ] Criar `app/api/teacher/blocks/[id]/route.ts` (PUT, DELETE) — editar/remover bloco
- [ ] Criar `lib/ai/prompts/content-importer.ts` com system prompt do SDD seção 6.2
- [ ] Criar `lib/ai/content-importer.ts` com `importContent(rawText, subjectName)` retornando array de blocos
- [ ] Criar `app/api/teacher/import/route.ts` (POST) — recebe `{ subject_id, raw_text }`, retorna preview
- [ ] Criar `app/api/teacher/blocks/confirm/route.ts` (POST) — salva preview confirmado
- [ ] Criar `app/api/teacher/classes/route.ts` (POST) — cria turma com `joinCode` via nanoid 8 chars uppercase
- [ ] Criar `app/api/teacher/classes/[id]/analytics/route.ts` (GET) — stats: alunos, blocos completos por aluno, checkpoints com maior taxa de erro

### Backend — Turmas (Aluno)
- [ ] Criar `app/api/classes/join/route.ts` (POST) — body `{ join_code }`, cria `ClassEnrollment`
- [ ] Criar `app/api/classes/my/route.ts` (GET) — turmas do aluno autenticado
- [ ] Criar `app/api/forest/plant-class/route.ts` (POST) — planta em `class_forest`; valida que aluno é membro
- [ ] Criar `app/api/forest/class/[classId]/route.ts` (GET) — reserva coletiva, visível só para membros

### Backend — Mentoria
- [ ] Criar `app/api/mentors/route.ts` (GET) — lista mentores tier ≥ 4 com `< 3 mentorados ativos`
- [ ] Criar `app/api/mentorships/route.ts` (POST) — solicita; valida tier do mentor; valida não-self
- [ ] Criar `app/api/mentorships/[id]/end/route.ts` (PATCH) — encerra
- [ ] Job diário: créditar +30pts a mentores ativos que tiveram troca de mensagem no dia (mensagens fica para v2 — por ora, por mentorado ativo)

### Frontend — Professor
- [ ] Criar `app/(teacher)/teacher/page.tsx` — dashboard com turmas e matérias do professor
- [ ] Criar `app/(teacher)/teacher/subjects/new/page.tsx` — criar matéria
- [ ] Criar `app/(teacher)/teacher/subjects/[code]/page.tsx` — listar blocos da matéria, editor
- [ ] Criar `app/(teacher)/teacher/import/page.tsx` — importador IA
- [ ] Criar `app/(teacher)/teacher/classes/new/page.tsx` — criar turma
- [ ] Criar `app/(teacher)/teacher/classes/[id]/page.tsx` — analytics
- [ ] Criar `app/(teacher)/layout.tsx` — proteção via `requireRole('teacher')`
- [ ] Criar `components/teacher/BlockEditor.tsx` — formulário com preview Markdown + KaTeX
- [ ] Criar `components/teacher/CheckpointEditor.tsx` — adicionar opções A/B/C/D + correta + explicação
- [ ] Criar `components/teacher/ContentImporter.tsx` — textarea + botão "Gerar com IA" + preview editável

### Frontend — Aluno
- [ ] Criar `app/(app)/classes/page.tsx` — turmas em que o aluno está inscrito
- [ ] Criar `app/(app)/classes/join/page.tsx` — input do `join_code`
- [ ] Criar `app/(app)/classes/[id]/page.tsx` — visão da turma (membros, professor, atividade)
- [ ] Criar `app/forest/class/[classId]/page.tsx` — reserva coletiva
- [ ] No `<TreeShop>`: adicionar toggle "Plantar na minha reserva | Plantar na reserva da turma"
- [ ] No `<ForestMap>`: indicar autor de cada árvore na reserva coletiva (avatar pequeno)

### Frontend — Mentoria
- [ ] Criar `app/(app)/mentors/page.tsx` — lista de mentores disponíveis com perfil resumido
- [ ] Criar `app/(app)/mentorships/page.tsx` — minhas mentorias (como mentor ou mentee)
- [ ] Adicionar badge "Mentor" em `<PostCard>` e `<Header>` para usuários com mentorias ativas

## Arquivos a Criar/Modificar

Backend (estrutura, professor, turmas, mentoria — 15 endpoints):
1-15. Conforme detalhado nas tarefas acima

Schema/seed:
16. `prisma/schema.prisma` (modificar)

Frontend (10+ páginas + componentes):
17-30. Conforme tarefas

Modificar para integrar:
- `components/shop/TreeShop.tsx` (modificar — toggle de destino do plantio)
- `components/forest/ForestMap.tsx` (modificar — suporte a reserva coletiva)
- `lib/ai/client.ts` (reutilizar da Fase 05)

## Comandos

```bash
npm install nanoid

# Schema
npm run db:migrate -- --name add-teacher-classes-mentorship

# Promover usuário a teacher (apenas dev)
curl -X POST http://localhost:3000/api/dev/promote/<user_id>

# Verificar
npm run dev
# Logar como teacher → /teacher → criar matéria GEO101
# /teacher/import → colar texto sobre Cerrado → IA gera 5 blocos
# /teacher/classes/new → criar turma "GEO101 - Turma A" → receber join_code
# Logar como aluno → /classes/join → inserir código → entrar
# Reserva coletiva visível em /forest/class/<id>

# Testes
npm test -- teacher
npm test -- classes
npm test -- mentorship

# Commit
git add .
git commit -m "fase-07: professor + turmas + importador IA + mentoria"
```

## Testes

- [ ] `tests/lib/auth/require-role.test.ts` — role correto passa; errado retorna 403
- [ ] `tests/lib/ai/content-importer.test.ts` — mock do Claude; texto retorna array de blocos válidos com checkpoints
- [ ] `tests/api/teacher/subjects.test.ts` — apenas teacher cria; student → 403
- [ ] `tests/api/teacher/import.test.ts` — recebe texto, retorna preview; confirm salva blocos
- [ ] `tests/api/teacher/classes.test.ts` — cria turma com join_code único de 8 chars
- [ ] `tests/api/classes/join.test.ts` — código válido inscreve; código inválido → 404
- [ ] `tests/api/forest/plant-class.test.ts` — apenas membro pode plantar; não-membro → 403
- [ ] `tests/api/mentorships.test.ts` — mentor tier < 4 → 400; mais de 3 mentorados → 400; ok cria
- [ ] `tests/integration/teacher-flow.test.ts` — promover → criar matéria → importar texto → criar turma → aluno entra

Comando: `npm test -- teacher && npm test -- classes && npm test -- mentorship`

## Critérios de Aceitação

- [ ] Migration criou tabelas `classes`, `class_enrollments`, `class_forest`, `mentorships`; campo `role` em users
- [ ] Promover usuário a teacher via endpoint dev funciona
- [ ] Teacher consegue criar matéria em `/teacher/subjects/new`
- [ ] Teacher consegue criar bloco manualmente com checkpoint
- [ ] Importador IA: colar texto → blocos gerados em ≤15s → preview editável → confirm salva
- [ ] Teacher cria turma e recebe `join_code` de 8 chars
- [ ] Aluno entra na turma com o código
- [ ] Reserva coletiva da turma visível em `/forest/class/[id]` para membros
- [ ] Aluno pode escolher plantar na própria reserva ou na coletiva
- [ ] Cada árvore na reserva coletiva mostra avatar do autor
- [ ] Analytics em `/teacher/classes/[id]` mostra blocos completos por aluno e taxa de erro
- [ ] Aluno tier ≥ 4 consegue se candidatar a mentor
- [ ] Solicitação de mentoria cria registro `pending` (ou `active` direto — decidir na implementação)
- [ ] Badge "Mentor" aparece em posts e perfil
- [ ] Todos os testes da fase passam

## Tempo Estimado
7-10 dias

## Próxima Fase
→ [fase-08-acessibilidade.md](./fase-08-acessibilidade.md)
