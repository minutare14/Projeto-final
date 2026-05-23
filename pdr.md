# PDR — Reserva Florestal

> **Project Definition Report** | Plataforma de Aprendizagem Gamificada com Biodiversidade Brasileira

---

## 1. Empatia

### Quem é o usuário?
Estudantes universitários e do ensino médio enfrentando matérias densas e desmotivadoras (Álgebra Linear, Cálculo, História, Filosofia). O público se divide em três perfis principais:

- **O aluno comum** — estuda só por nota, procrastina, perde foco em textos longos.
- **O aluno neurodivergente** — TDAH e Dislexia tornam materiais densos quase intransponíveis.
- **O aluno com baixa familiaridade tecnológica** — idosos em graduação tardia que precisam de interfaces simples.

### Quais são suas dores?
- Conteúdos universitários de 500+ linhas de texto puro, sem ilustrações ou exemplos práticos.
- Falta de motivação intrínseca além da nota final.
- Procrastinação alimentada por monotonia e ausência de feedback imediato.
- Isolamento: estudar sozinho, sem ver o progresso de colegas.
- Sobrecarga cognitiva ao tentar absorver muita informação de uma vez.

### O que ele pensa, sente ou precisa?
> *"Eu sei que preciso estudar isso, mas não consigo me concentrar. Não tem motivo nenhum nesse conteúdo além de passar na prova."*

O usuário **precisa de propósito** — algo além da nota. **Precisa de progresso visível** — ver que avançou. **Precisa de pertencimento** — fazer parte de algo maior. E **precisa de respeito ao seu ritmo** — conteúdo digerível, sem julgamento.

---

## 2. Definição do Problema

### Problema central
Estudantes não conseguem manter foco e motivação em matérias densas porque o modelo tradicional de ensino é monótono, isolado e sem recompensa imediata além da nota.

### Pergunta orientadora
> **Como poderíamos transformar o estudo de matérias densas em uma experiência divertida, social e significativa — que recompense o aluno de forma imediata, conecte ele com seus colegas, e ainda gere impacto real no mundo?**

Essa pergunta foi formulada para:
- **Direcionar a ideação** sem prescrever a solução.
- **Manter o foco no usuário** (divertida, social, significativa).
- **Abrir espaço para múltiplas respostas** (recompensa, conexão, impacto).

---

## 3. Ideação

### Ideias levantadas (brainstorm livre)
- Quiz com pontos e medalhas como o Duolingo.
- Sistema de avatar/personagem que evolui conforme estudo.
- Plantação virtual de árvores brasileiras.
- App de revisão por flashcards (estilo Anki).
- Rede social acadêmica para troca de resoluções.
- Tutor IA conversacional que tira dúvidas.
- Vídeos curtos estilo TikTok com matérias.
- Sistema de mentoria entre veteranos e calouros.
- Recompensas em moeda virtual trocáveis por benefícios reais.
- Mapa interativo de biomas brasileiros que se enriquece com estudo.

### Ideia escolhida
**Plataforma onde o aluno transforma seu estudo em uma reserva florestal brasileira viva:**
- Cada bloco de conteúdo lido → pontos.
- Pontos → árvores nativas plantadas em uma reserva pessoal.
- Reserva evolui por biomas (Caatinga → Cerrado → Mata Atlântica → Pantanal → Amazônia).
- Comunidade compartilha resoluções validadas por IA.
- A cada 100 árvores virtuais → 1 árvore real plantada por ONG parceira.

**Por que essa ideia ganhou:** combina recompensa visual imediata (árvore crescendo), propósito ambiental (biodiversidade brasileira), social (visitar floresta dos colegas) e impacto real (plantio físico) — endereça **todas as dores em uma única solução coerente**.

---

## 4. Prototipação

### Descrição da solução

**Reserva Florestal** é uma plataforma web onde:

1. **Conteúdo fragmentado:** matérias de 500 linhas viram 20 micro-blocos ilustrados, cada um com explicação curta, exemplo prático e uma pergunta de verificação (checkpoint).
2. **Pontuação por interação:** cada bloco lido, checkpoint correto, minuto ativo, post publicado e like recebido gera pontos.
3. **Loja de árvores nativas:** pontos compram espécies reais brasileiras (Mandacaru 40pts, Ipê Amarelo 350pts, Pau-Brasil lendário 1.200pts). Cada árvore traz informação ecológica.
4. **Biomas desbloqueáveis por tier:** Caatinga (inicial) → Cerrado (500pts) → Mata Atlântica (1.500) → Pantanal (3.000) → Amazônia (6.000).
5. **Feed comunitário com IA:** alunos publicam resoluções; a IA Claude valida automaticamente. Aprovado vira público + bônus; rejeitado fica privado com feedback pedagógico.
6. **Fauna visitante:** combinações de árvores desbloqueiam animais nativos (arara-azul, lobo-guará, onça-pintada) que aparecem animados na reserva.
7. **Missões diárias + conquistas:** gatilhos de retorno e reconhecimento de marcos.
8. **Plantio real:** a cada 100 árvores virtuais, uma árvore real é plantada via ONG parceira, com certificado digital.
9. **Acessibilidade total:** modo áudio (TTS pt-BR), fonte OpenDyslexic, modo escuro, botões grandes, WCAG AA.

### Esboço da solução

```
┌──────────────────────────────────────────────────────────────┐
│  RESERVA FLORESTAL  |  Olá, Maria  |  🔥 7 dias  |  🔔 3     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   📚 ICTA13 — Álgebra Linear                                 │
│   ┌──────────────────────────────────────────────┐          │
│   │ Bloco 3/5: Matrizes que transformam o mundo  │          │
│   │ ─────────────────────────────────────────────│          │
│   │ Uma matriz é uma grade de números…           │          │
│   │ [exemplo prático no GPS]                     │          │
│   │ 🎧 Ouvir bloco   ✓ Concluir leitura          │          │
│   │                                              │          │
│   │ ❓ Uma matriz 3×4 tem quantos elementos?    │          │
│   │   [A] 7   [B] 34   [C] 12 ✓   [D] 43        │          │
│   │   +20 pts! 🎉                                │          │
│   └──────────────────────────────────────────────┘          │
│                                                              │
│   🌳 MINHA RESERVA           🛒 Loja de árvores              │
│   ┌──────────────────────────────────────────────┐          │
│   │  🌵Mandacaru  🌳Aroeira  🌴Buriti            │          │
│   │       🦋                                     │          │
│   │              🌺Ipê                           │          │
│   │   🌵      🦌                  🦜             │          │
│   │      🌳         🌳                           │          │
│   │                                              │          │
│   │  Caatinga ✓  Cerrado ✓  Mata Atlântica 🔒    │          │
│   │  CO₂ simbólico: 240 kg/ano                   │          │
│   └──────────────────────────────────────────────┘          │
│                                                              │
│   🎯 Missões de Hoje                                         │
│   • Leia 3 blocos    [██░░░] 1/3        +50pts              │
│   • Plante 1 árvore  [░░░░░] 0/1        +50pts              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Fluxo principal do usuário:**

```
SIGNUP → DASHBOARD → ler bloco → +10pts → checkpoint → +20pts
   ↓                                                       ↓
visitar floresta                                    loja de árvores
   ↓                                                       ↓
inspirar-se ←  comunidade  ←  publicar resolução  ←  plantar árvore
                                       ↓
                                  IA valida
                                       ↓
                              +50pts + bônus
                                       ↓
                              100ª árvore → árvore real plantada 🌱
```

---

## 5. Teste

### Como testar a solução?
**Validação faseada em três níveis:**

1. **Teste de usabilidade (Fase 0-3):** com 5 alunos voluntários reais — observação enquanto usam, com perguntas guiadas. Identificar onde travam, o que não entendem.
2. **Teste piloto fechado (Fase 4-7):** 1 turma da UFBA (ICTA13) por 4 semanas. Métricas reais de uso.
3. **Lançamento aberto (Fase 8-10):** abertura pública com formulário de feedback in-app contínuo.

### Que feedback coletar?

**Métricas quantitativas:**
- Taxa de retenção (Daily Active Users / Monthly Active Users)
- Tempo médio de sessão
- Blocos completos por sessão
- Streak médio dos usuários
- Taxa de aprovação dos posts pela IA
- Conversão de pontos em plantio de árvores

**Métricas qualitativas:**
- Quão divertido é estudar aqui? (escala 1-10)
- Você sente que está aprendendo de verdade?
- O que mais te motiva a voltar?
- O que te frustrou?
- Você indicaria para um amigo?

**Sinais de sucesso esperados:**
- ≥ 60% dos alunos voltam por 7 dias consecutivos
- ≥ 50% dos posts publicados são aprovados pela IA
- ≥ 80% dizem que "se divertem estudando"
- ≥ 1 plantio real concretizado (100 árvores virtuais) por usuário no primeiro mês

---

## 6. Síntese Final

### Valor da Solução

A **Reserva Florestal** resolve simultaneamente três problemas que normalmente são tratados de forma isolada:

1. **Educacional** — torna conteúdos densos digestíveis através de fragmentação, ilustração e gamificação.
2. **Motivacional** — substitui a recompensa abstrata (nota) por uma recompensa visual concreta (floresta crescendo, biomas desbloqueando, animais aparecendo).
3. **Ambiental e Cultural** — usa o estudo acadêmico como veículo para educar sobre biodiversidade brasileira e gerar impacto real via plantio.

A solução é importante porque ataca a raiz do desengajamento estudantil sem comprometer rigor acadêmico: o aluno aprende **mais**, não menos. Aprende Álgebra Linear E aprende sobre Ipê, Castanheira, Pau-Brasil. Aprende sozinho E em comunidade. Aprende para a nota E para algo maior que ele.

### Solução resumida em uma frase

> **Reserva Florestal transforma cada minuto de estudo em uma árvore brasileira plantada — virtualmente em sua reserva pessoal, e fisicamente no mundo real.**

---

## Anexos

| Documento | Conteúdo |
|---|---|
| `projeto.md` | Visão completa de produto e filosofia |
| `sdd.md` | Especificação técnica detalhada (Spec-Driven Development) |
| `analise-features.md` | 15 features propostas com plano de implementação |
| `fases/README.md` | Roadmap executável em 11 fases (40-60 dias) |
| `prisma/schema.prisma` | Modelagem de dados completa |
| `prisma/seed.ts` | 31 espécies de árvores brasileiras com dados científicos |
