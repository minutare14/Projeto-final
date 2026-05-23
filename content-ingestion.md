# Guia de Ingestão de Conteúdo — Reserva Florestal

> **Para o programador:** este documento explica de onde vem o conteúdo educacional, como ele está estruturado, como importá-lo para o banco de dados e qual padrão seguir para criar novo conteúdo.

---

## 1. Fonte de Conteúdo

O repositório `minutare-edu` contém o conteúdo educacional pronto para uso. Clone-o localmente:

```bash
git clone https://github.com/minutare14/minutare-edu.git
```

### O que tem lá dentro

```
minutare-edu/
├── content/
│   ├── markdown/          ← 9 arquivos .md (blocos de conteúdo prontos)
│   ├── rag/               ← versões longas para busca semântica (RAG)
│   ├── artifacts/raw/     ← 16 artefatos HTML interativos
│   └── reference/
│       └── manual-completo.md   ← manual completo da matéria
└── js/
    └── modules-data.js    ← estrutura de módulos com quizzes já mapeados
```

### Matéria disponível

**CTIA03 — Bases Matemáticas para Ciência, Tecnologia e Inovação**

| Módulo | Arquivos de conteúdo |
|---|---|
| Conjuntos | `nocao-de-conjunto.md`, `propriedades-dos-conjuntos.md`, `operacoes-entre-conjuntos.md` |
| Conjuntos Numéricos | `conjuntos-numericos.md` |
| Ordem e Intervalos | `relacao-de-ordem.md`, `intervalos-numericos.md` |
| Álgebra | `propriedades-da-algebra.md` |
| Produtos Notáveis | `produtos-notaveis.md` |
| Fatoração | `fatoracao.md` |

---

## 2. Como o Conteúdo se Mapeia ao Sistema

Cada arquivo markdown vira **1 `ContentBlock`** no banco de dados. Os exercícios do bloco viram **`Checkpoint`s** associados a ele.

### Mapeamento direto

| minutare-edu | Prisma (Reserva Florestal) |
|---|---|
| Matéria CTIA03 | `Subject` (code: `CTIA03`) |
| Módulo (ex: Conjuntos) | Agrupamento visual — campo `module` em `ContentBlock` |
| Arquivo `.md` inteiro | `ContentBlock.body` (Markdown + KaTeX) |
| Seção `🧪 Exercícios` | `Checkpoint[]` vinculados ao bloco |
| Arquivo HTML em `/artifacts/raw/` | `ContentBlock.artifactUrl` (iframe embutido) |
| Versão em `/rag/` | Base vetorial (PGVector) — usar na Fase 05 |

### Exemplo concreto

O arquivo `fatoracao.md` vira:

```ts
// ContentBlock
{
  subjectCode: "CTIA03",
  module: "Fatoração",
  orderIndex: 9,
  title: "Fatoração",
  body: "<!-- conteúdo completo do .md -->",
  hasFormula: true,
  pointsReward: 10,
  artifactUrl: "/content/artifacts/raw/fatorador_visual.html",
}

// Checkpoints (vindos da seção fallbackQuiz do modules-data.js)
[
  {
    question: "Qual é o resultado de fatorar 4x³ + 8x²?",
    optionA: "4x(x² + 2x)",
    optionB: "4x²(x + 2)",   // ← correta
    optionC: "2x²(2x + 4)",
    optionD: "x²(4x + 8)",
    correctOption: "B",
    explanation: "O fator comum é 4x². Dividindo cada termo: 4x³÷4x² = x e 8x²÷4x² = 2.",
    pointsReward: 20,
  }
]
```

---

## 3. Como Adicionar ao Seed (`prisma/seed.ts`)

### Passo 1 — Criar o Subject CTIA03

Abra `prisma/seed.ts` e adicione após a definição do ICTA13:

```ts
// ---------------------------------------------------------------------------
// MATÉRIA CTIA03 — Bases Matemáticas
// ---------------------------------------------------------------------------
await prisma.subject.upsert({
  where: { code: "CTIA03" },
  update: {},
  create: {
    code: "CTIA03",
    name: "Bases Matemáticas para Ciência, Tecnologia e Inovação",
    description: "Fundamentos de conjuntos, números, álgebra e fatoração para estudantes universitários de exatas.",
    totalBlocks: 9,
  },
});
```

### Passo 2 — Criar os ContentBlocks

Para cada arquivo em `content/markdown/`, crie um bloco. O padrão é:

```ts
await prisma.contentBlock.upsert({
  where: { id: "ctia03-block-1" },   // ID determinístico = nunca duplica no re-seed
  update: {},
  create: {
    id: "ctia03-block-1",
    subjectCode: "CTIA03",
    orderIndex: 1,
    module: "Conjuntos",             // nome do módulo-pai
    title: "Noção de Conjunto",
    body: fs.readFileSync(
      path.join(MINUTARE_EDU_PATH, "content/markdown/nocao-de-conjunto.md"),
      "utf-8"
    ),
    hasFormula: false,
    pointsReward: 10,
    artifactUrl: "/artifacts/diagrama_venn_interativo.html",  // opcional
    checkpoints: {
      create: [
        {
          question: "Qual afirmação usa corretamente a relação de pertinência?",
          optionA: "ℕ ∈ ℤ",
          optionB: "3 ∈ {1, 2, 3}",   // ← correta
          optionC: "{2} ∈ {2, 4, 6}",
          optionD: "A ⊂ 2",
          correctOption: "B",
          explanation: "Pertinência liga elemento a conjunto. O número 3 é elemento do conjunto {1, 2, 3}.",
          pointsReward: 20,
        },
        // adicionar mais 2-3 checkpoints por bloco
      ],
    },
  },
});
```

### Passo 3 — Onde buscar as perguntas prontas

As perguntas já estão prontas em `modules-data.js` no campo `fallbackQuiz` de cada módulo. Para extraí-las automaticamente:

```bash
# No diretório minutare-edu, rode este script para ver todas as perguntas:
node -e "
const data = require('./js/modules-data.js');  // ajustar se necessário
window = global;
eval(require('fs').readFileSync('./js/modules-data.js', 'utf8'));
MODULES_DATA.forEach(m => {
  console.log('=== ' + m.title + ' ===');
  m.fallbackQuiz?.forEach(q => console.log(JSON.stringify(q, null, 2)));
});
"
```

---

## 4. Como Servir os Artefatos Interativos

Os 16 arquivos HTML em `artifacts/raw/` são ferramentas interativas (3D, quizzes, animações). Para usá-los:

### Opção A — Copiar para `/public` do Next.js (mais simples)

```bash
cp -r minutare-edu/content/artifacts/raw/* Projeto-final/public/artifacts/
```

Então no `ContentBlock`, o campo `artifactUrl` aponta para `/artifacts/fatorador_visual.html`.

No componente `<ContentBlock>`, renderize com iframe quando o campo existir:

```tsx
{block.artifactUrl && (
  <iframe
    src={block.artifactUrl}
    className="w-full h-96 rounded-xl border border-green-200"
    title={`Artefato interativo: ${block.title}`}
  />
)}
```

### Opção B — CDN (produção)

Hospedar em um bucket S3/R2 e apontar a URL completa no campo `artifactUrl`.

### Mapa de artefatos por módulo

| Módulo | Artefatos sugeridos |
|---|---|
| Conjuntos | `diagrama_venn_interativo.html`, `conjuntos_3d_esferas.html`, `conjuntos_e_numeros.html` |
| Conjuntos Numéricos | `mapa_mental_numeros.html`, `quiz_conjuntos_numericos.html` |
| Ordem e Intervalos | `reta_real_3d.html`, `intervalos_reta_real.html`, `reta_real_construtor.html` |
| Álgebra | `algebra_3d_superficie.html`, `algebra_produtos_fatoracao.html` |
| Produtos Notáveis | `cubo_soma_3d.html`, `expansor_produtos_notaveis.html`, `area_model_fatoracao.html` |
| Fatoração | `fatorador_visual.html`, `bhaskara_animado.html`, `parabola_raizes_3d.html` |

---

## 5. Usando o Conteúdo RAG (Fase 05)

A pasta `content/rag/` contém versões estendidas de cada tópico, otimizadas para busca semântica. Use-as para alimentar o sistema de busca vetorial (PGVector) que a IA usa para validar posts da comunidade.

```bash
# No seed de RAG (Fase 05), leia cada arquivo dessa pasta e gere embeddings:
const ragDir = path.join(MINUTARE_EDU_PATH, "content/rag");
const files = fs.readdirSync(ragDir);

for (const file of files) {
  const content = fs.readFileSync(path.join(ragDir, file), "utf-8");
  const embedding = await generateEmbedding(content);  // chamar API de embeddings
  await prisma.knowledgeChunk.create({
    data: { content, embedding, source: file, subjectCode: "CTIA03" }
  });
}
```

---

## 6. Padrão para Criar Novo Conteúdo

Se quiser adicionar novas matérias seguindo o mesmo padrão, cada bloco deve ter:

```markdown
### 📘 [Título do tópico]

#### 🧠 Resumo rápido (2–4 linhas)
[Frase curta e direta explicando o conceito central]

#### 📖 Explicação
[Analogia do mundo real + explicação em linguagem simples]

#### 📌 Definições importantes
- **Termo:** definição prática
- **Notação:** exemplo concreto

#### 🔍 Exemplos resolvidos
**Exemplo 1:** [enunciado]
*Passo a passo:*
1. ...
2. ...
*Resposta:* ...

#### ⚠️ Erros comuns
- [Erro frequente + por que está errado]

#### 💡 Macetes de prova
- [Dica memorável]

#### 🧪 Exercícios
1. [Questão de múltipla escolha: a) b) c) d)]
2. ...

**Gabarito:**
1. Letra **X** — [explicação]

#### 🚀 Revisão rápida
- [ ] Conceito chave 1
- [ ] Conceito chave 2
```

Cada exercício de múltipla escolha na seção `🧪 Exercícios` vira um `Checkpoint` no banco.

---

## 7. Checklist de Implementação

Execute na ordem:

- [ ] Clonar `minutare-edu` localmente
- [ ] Copiar artefatos HTML para `public/artifacts/`
- [ ] Adicionar `Subject CTIA03` ao `prisma/seed.ts`
- [ ] Adicionar os 9 `ContentBlock`s com leitura dos `.md` via `fs.readFileSync`
- [ ] Adicionar `Checkpoint`s extraídos do `fallbackQuiz` em `modules-data.js`
- [ ] Rodar `npm run db:seed` e verificar no Prisma Studio
- [ ] Testar renderização: `/subjects/CTIA03` deve mostrar os 9 blocos
- [ ] Testar artefato: iframe de `fatorador_visual.html` carrega no bloco 9
- [ ] (Fase 05) Indexar arquivos da pasta `rag/` no PGVector

---

## Referências

| Recurso | Localização |
|---|---|
| Repositório de conteúdo | `https://github.com/minutare14/minutare-edu` |
| Estrutura de módulos | `minutare-edu/js/modules-data.js` |
| Markdowns prontos | `minutare-edu/content/markdown/*.md` |
| Artefatos interativos | `minutare-edu/content/artifacts/raw/*.html` |
| Conteúdo para RAG | `minutare-edu/content/rag/*.md` |
| Schema do banco | `prisma/schema.prisma` |
| Seed atual | `prisma/seed.ts` |
| Fase que usa RAG | `fases/fase-05-comunidade.md` |
