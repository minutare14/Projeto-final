# Projeto: Ecossistema de Aprendizagem Gamificado

## 1. Visão Geral do Projeto

### O Problema
Procrastinação, isolamento e sobrecarga cognitiva em alunos (incluindo TDAH e Dislexia) ao lidar com materiais densos. O aluno não tem motivo para estudar além da nota — e isso não é suficiente para engajar.

### A Solução
Uma plataforma que transforma qualquer matéria em uma experiência visual, gamificada e social. O conteúdo é fragmentado em micro-blocos ilustrados com perguntas e exemplos práticos no meio, e o progresso do aluno constrói literalmente uma floresta brasileira — com árvores nativas reais, raras e belas.

A inspiração é o Duolingo, mas o diferencial é o propósito duplo: **aprender o conteúdo acadêmico** e, ao mesmo tempo, **desenvolver consciência sobre a biodiversidade brasileira**.

### Público-Alvo
- Estudantes universitários (foco inicial na disciplina ICTA13 da UFBA)
- Alunos neurodivergentes (TDAH, Dislexia)
- **Idosos em graduação** — com baixa familiaridade tecnológica
- Estudantes do ensino médio (história, geografia, filosofia, etc.)
- Qualquer pessoa que precise estudar matérias densas sem motivação intrínseca

---

## 2. Filosofia Pedagógica

### Por que funciona
Ninguém quer ler 500 linhas de álgebra linear. Mas a pessoa **vai querer** uma Araucária rara que custa 500 pontos. Esse é o gatilho: o estudo deixa de ser um fim e vira o **meio para construir algo bonito e único**.

### O conteúdo não muda — a forma muda
- Uma aula de álgebra linear com 500 linhas vira **20 micro-páginas** ilustradas.
- Cada página tem: explicação curta + exemplo do dia a dia + pergunta interativa.
- Ao final de cada bloco, o aluno ganha pontos e planta na sua floresta.

### Aplicável a qualquer matéria
- Álgebra Linear (ICTA13 / UFBA) → exemplo inicial
- História, Geografia, Filosofia, Biologia, etc.
- O sistema é agnóstico ao conteúdo — qualquer texto pode ser processado.

### Impacto sociocultural e ambiental
- O aluno aprende **o que é um Ipê**, por que ele é raro, onde cresce, qual seu papel no ecossistema.
- O estudo acadêmico vira também **educação ambiental, cultural e florestal**.
- Incentivo socioeconômico: valorizar o que é brasileiro, nativo, raro.

---

## 3. A Floresta como Núcleo do Jogo

### Como funciona
- Cada aluno tem uma floresta pessoal e visível para os colegas.
- Pontos ganhos com estudo são usados na **loja de árvores nativas**.
- Árvores têm raridade e custo variados:

| Árvore | Bioma | Custo (pontos) | Raridade |
|---|---|---|---|
| Aroeira | Caatinga | 50 | Comum |
| Mandacaru (cacto) | Caatinga | 80 | Comum |
| Pequi | Cerrado | 150 | Incomum |
| Ipê Amarelo | Cerrado/Mata Atlântica | 300 | Raro |
| Castanheira-do-Pará | Amazônia | 500 | Épico |
| Pau-Brasil | Mata Atlântica | 800 | Lendário |

- A floresta evolui por biomas: **Caatinga → Cerrado → Mata Atlântica → Amazônia**.
- O aluno pode **visitar a floresta dos amigos** e ver como eles estão estudando — sem precisar perguntar.

### Ranking de Biodiversidade
- O leaderboard mede a **riqueza da floresta** (diversidade de espécies + raridade), não só a pontuação bruta.
- Isso incentiva estudar mais conteúdos diferentes, não só repetir o mesmo.

---

## 4. Design de Conteúdo (Como o Material Chega ao Aluno)

### Formato dos Micro-Blocos
- Sem vídeo — o foco é leitura ativa e acessível.
- Cada bloco tem no máximo 5-8 linhas de texto.
- Acompanhado de: ilustração, exemplo prático e uma pergunta de verificação.
- Exemplo (álgebra linear): "Matrizes existem no seu dia a dia — quando o GPS calcula rotas, ele usa transformações matriciais."

### Perguntas no Meio do Conteúdo
- Não são provas — são checkpoints leves para manter o foco.
- Acerto → pontos imediatos + micro-animação de recompensa.
- Erro → explicação gentil, sem punição de pontos.

---

## 5. Acessibilidade e Design Inclusivo

### Para neurodivergentes (TDAH, Dislexia)
- Blocos curtos eliminam a sobrecarga cognitiva.
- Progresso visual constante combate a procrastinação.
- Fontes legíveis: OpenDyslexic ou Inter, espaçamento amplo.

### Para idosos e pessoas com baixa familiaridade tecnológica
- Interface simples, com poucos elementos por tela.
- Botões grandes e bem rotulados.
- Sem jargão técnico na navegação.
- Paleta suave (verde-oliva, areia, bege) — sem sobrecarga visual.
- Micro-animações satisfatórias, mas sem excesso de estímulo.

### Indicadores de Progresso
- Barra de leitura curta e visual mostrando o andamento do bloco atual.
- Reduz ansiedade de "quanto falta?" — o aluno sempre sabe onde está.

---

## 6. Arquitetura e Stack Tecnológica

| Camada | Opções |
|---|---|
| Frontend | Flutter (mobile) ou React (web) |
| Backend | Node.js ou Python |
| Banco de Dados | PostgreSQL + Pinecone (ou PGVector) |
| IA Validadora | Claude (Anthropic) ou OpenAI API |
| Renderização de Fórmulas | KaTeX |

---

## 7. Funcionalidades Principais (Features)

### Processador de Conteúdo
- Importa arquivos Markdown ou LaTeX (material do professor).
- Fragmenta automaticamente em blocos de 5-8 linhas com título e exemplo.
- Extrai fórmulas e as renderiza via KaTeX de forma acessível.
- Cada bloco lido e respondido corretamente gera pontos.

### Ecossistema de Gamificação
- Loja virtual com árvores nativas organizadas por bioma e raridade.
- Pontos compram árvores que são plantadas na floresta pessoal do aluno.
- Desbloqueio progressivo de biomas: Caatinga → Cerrado → Amazônia.

### Feed Social com IA
- Alunos postam resoluções de exercícios.
- A IA valida a precisão e retorna feedback estruturado.
- Acertos: ganham pontos e vão para a base pública de consulta.
- Erros: recebem explicação privada e didática, sem exposição.

### Visita à Floresta dos Colegas
- Cada aluno tem um perfil com sua floresta visível.
- Ver a floresta do colega mostra indiretamente o quanto ele estudou.
- Cria pressão social positiva e senso de comunidade.

---

## 8. Fases de Desenvolvimento (Roadmap)

### Fase 1 — Estrutura e Conteúdo
- Banco de dados (usuários, fragmentos, inventário, posts)
- Parser de Markdown/LaTeX
- Algoritmo de fragmentação em micro-blocos
- Sistema básico de pontuação

### Fase 2 — Gamificação e Visual
- Loja de árvores nativas com raridade e custo
- Interface da floresta interativa (visualização 2D)
- Mapeamento dos biomas e desbloqueio progressivo
- Ranking de biodiversidade

### Fase 3 — Comunidade e IA
- Feed de postagens e resoluções
- Integração do agente de IA validador
- Base de conhecimento dinâmica para consulta pelos alunos
- Sistema de visita ao perfil/floresta dos colegas

---

## 9. Modelagem de Dados

### Usuários
- Nome, email, pontuação total, bioma atual desbloqueado.

### Fragmentos de Aula
- Código da matéria (ex: ICTA13), texto do bloco, fórmulas extraídas, pontos de recompensa, ordem no conteúdo.

### Catálogo de Árvores
- Nome popular, nome científico, bioma, custo em pontos, raridade, descrição ecológica curta.

### Inventário da Floresta
- Usuário, árvore, bioma, posição X/Y no mapa, data de plantio.

### Posts da Comunidade
- Autor, conteúdo da resolução, status da IA (Aprovado/Reprovado), feedback do bot, pontos ganhos.

---

## 10. Engenharia de Prompts (Agente Validador)

### Papel da IA
Atuar como um **Tutor Científico e Botânico** — rigoroso na validação do conteúdo acadêmico, mas gentil e pedagógico no feedback.

### Comportamento
- Valida a precisão matemática e lógica dos posts.
- Nunca expõe o erro publicamente — feedback de erro é sempre privado.
- Usa linguagem acessível, sem jargão excessivo.

### Saída Estruturada (JSON)
```json
{
  "status": "aprovado | reprovado",
  "justificativa": "explicação pedagógica clara e gentil",
  "bonus_relevancia": 0,
  "dica_botanica": "curiosidade sobre a árvore desbloqueável relacionada ao tema"
}
```

> **Diferencial:** a IA pode conectar o conteúdo acadêmico a uma curiosidade botânica — ex.: "Sua resolução sobre vetores está correta! Sabia que o Ipê usa geometria natural para distribuir suas flores de forma que maximize a polinização?"
