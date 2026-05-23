# Projeto: Ecossistema de Aprendizagem Gamificado

## 1. Visão Geral do Projeto

### O Problema
Procrastinação, isolamento e sobrecarga cognitiva em alunos (incluindo TDAH e Dislexia) ao lidar com materiais densos.

### A Solução
Fragmentação de leitura em "One-Bullets", pontuação gamificada que desbloqueia biomas brasileiros, e um feed colaborativo validado por Inteligência Artificial.

### Público-Alvo
- Estudantes da UFBA (foco na disciplina ICTA13)
- Alunos neurodivergentes
- Entusiastas de metodologias ativas

---

## 2. Arquitetura e Stack Tecnológica

| Camada | Opções |
|---|---|
| Frontend | Flutter ou React |
| Backend | Node.js ou Python |
| Banco de Dados | PostgreSQL + Pinecone (ou PGVector) |
| IA | OpenAI API ou Claude |
| Fórmulas | KaTeX |

---

## 3. Funcionalidades Principais (Features)

### Processador de Conteúdo
- Transforma arquivos brutos (Markdown/LaTeX) em blocos curtos e expansíveis.
- Cada bloco lido ativamente gera pontos.

### Ecossistema de Gamificação
- Loja virtual onde os pontos compram vegetações nativas.
- Desbloqueio de biomas em níveis: **Caatinga → Cerrado → Amazônia**.

### Feed Social com IA
- Mural onde resoluções de alunos são analisadas pela IA.
- Acertos: ganham pontos e vão para a base pública.
- Erros: recebem feedback privado e didático.

### Ranking de Biodiversidade
- Leaderboard baseado na "Riqueza" da floresta de cada aluno.
- Permite visitas aos perfis dos colegas.

---

## 4. Fases de Desenvolvimento (Roadmap)

### Fase 1 — Estrutura e Conteúdo
- Criação do banco de dados
- Parser de Markdown/LaTeX
- Algoritmo de fragmentação de textos em One-Bullets
- Sistema básico de contagem de pontos

### Fase 2 — Gamificação e Visual
- Loja de árvores nativas
- Mapeamento dos biomas
- Interface da floresta interativa
- Implementação do ranking

### Fase 3 — Comunidade e IA
- Lançamento do feed de postagens
- Integração do agente de IA validador
- Ativação da base de consultas dinâmicas para os alunos

---

## 5. Modelagem de Dados

### Usuários
- Nome, email, pontuação total, bioma atual.

### Fragmentos de Aula
- Código da matéria (ex: ICTA13), texto fragmentado, fórmulas extraídas, pontos de recompensa.

### Inventário da Floresta
- Árvores compradas por usuário, bioma pertencente, posição X/Y no mapa.

### Posts da Comunidade
- Resoluções dos alunos, status de avaliação da IA (Aprovado/Reprovado), feedback do bot, pontos ganhos.

---

## 6. Design de Experiência (UX) e Acessibilidade

| Aspecto | Decisão |
|---|---|
| Tipografia | OpenDyslexic ou Inter, espaçamento de linha amplo |
| Paleta | Tons pastéis suaves (verde-oliva, areia) |
| Progresso | Barras curtas e visuais de andamento da leitura |
| Feedback | Micro-animações ao completar leituras ou plantar árvores |

---

## 7. Engenharia de Prompts (Agente Validador)

### Papel da IA
Atuar como um **Tutor Científico e Botânico**.

### Comportamento
Validar a precisão matemática e lógica dos posts enviados pelos alunos.

### Saída Estruturada (JSON)
```json
{
  "status": "aprovado | reprovado",
  "justificativa": "explicação pedagógica",
  "bonus_relevancia": 0
}
```
