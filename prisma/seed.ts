import { PrismaClient, Rarity, MissionType, AchievementType } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// BIOMAS
// ---------------------------------------------------------------------------
const BIOMES = [
  {
    id: 1,
    name: "Caatinga",
    tier: 1,
    pointsRequired: 0,
    description:
      "O único bioma exclusivamente brasileiro. Resistente à seca, abriga uma biodiversidade surpreendente e única no mundo.",
  },
  {
    id: 2,
    name: "Cerrado",
    tier: 2,
    pointsRequired: 500,
    description:
      "Berço das águas do Brasil. Savana tropical mais biodiversa do planeta, com mais de 11 mil espécies de plantas.",
  },
  {
    id: 3,
    name: "Mata Atlântica",
    tier: 3,
    pointsRequired: 1500,
    description:
      "Um dos cinco hotspots de biodiversidade do mundo. Reduzida a 12% da cobertura original, cada árvore conta.",
  },
  {
    id: 4,
    name: "Pantanal",
    tier: 4,
    pointsRequired: 3000,
    description:
      "A maior planície alagável do mundo. Patrimônio Natural da Humanidade pela UNESCO, lar de jacarés, ariranhas e tuiuiús.",
  },
  {
    id: 5,
    name: "Amazônia",
    tier: 5,
    pointsRequired: 6000,
    description:
      "A maior floresta tropical do planeta. Abriga 10% de todas as espécies vivas da Terra e regula o clima global.",
  },
];

// ---------------------------------------------------------------------------
// ÁRVORES — cada entrada é um registro completo com dados reais
// ---------------------------------------------------------------------------
type TreeSeed = {
  commonName: string;
  scientificName: string;
  biomeId: number;
  tierRequired: number;
  costPoints: number;
  rarity: Rarity;
  description: string;
  funFact: string;
};

const TREES: TreeSeed[] = [
  // ─── CAATINGA (Tier 1) ──────────────────────────────────────────────────
  {
    commonName: "Mandacaru",
    scientificName: "Cereus jamacaru",
    biomeId: 1,
    tierRequired: 1,
    costPoints: 40,
    rarity: "comum",
    description:
      "Cacto símbolo da Caatinga. Pode chegar a 10 metros de altura e floresce à noite, sendo polinizado por morcegos.",
    funFact:
      "Seu miolo é usado como fonte de água por animais durante a seca — um reservatório natural no sertão.",
  },
  {
    commonName: "Xique-Xique",
    scientificName: "Pilosocereus gounellei",
    biomeId: 1,
    tierRequired: 1,
    costPoints: 50,
    rarity: "comum",
    description:
      "Cacto colunar típico do sertão nordestino. Seus espinhos protegem um interior cheio de água e vida.",
    funFact:
      "É chamado de 'hotel da Caatinga' por abrigar ninhos de aves dentro de sua estrutura.",
  },
  {
    commonName: "Catingueira",
    scientificName: "Poincianella pyramidalis",
    biomeId: 1,
    tierRequired: 1,
    costPoints: 60,
    rarity: "comum",
    description:
      "Árvore que nomeia o próprio bioma: 'caatinga' vem de 'mata branca', referência às árvores sem folhas na seca.",
    funFact:
      "Na época de chuvas, floresce em amarelo intenso e transforma o sertão num jardim em dias.",
  },
  {
    commonName: "Juazeiro",
    scientificName: "Ziziphus joazeiro",
    biomeId: 1,
    tierRequired: 1,
    costPoints: 80,
    rarity: "incomum",
    description:
      "Uma das poucas árvores que permanece verde durante toda a seca. Símbolo de resistência e fé no sertão.",
    funFact:
      "Padre Cícero plantou juazeiros em Juazeiro do Norte — a cidade leva o nome da árvore.",
  },
  {
    commonName: "Umbuzeiro",
    scientificName: "Spondias tuberosa",
    biomeId: 1,
    tierRequired: 1,
    costPoints: 100,
    rarity: "incomum",
    description:
      "Árvore sagrada do sertão. Seus frutos (umbu) alimentam comunidades inteiras no período da seca.",
    funFact:
      "Armazena até 3 mil litros de água em raízes tuberosas subterrâneas — um sistema de sobrevivência único.",
  },
  {
    commonName: "Aroeira-do-Sertão",
    scientificName: "Myracrodruon urundeuva",
    biomeId: 1,
    tierRequired: 1,
    costPoints: 130,
    rarity: "raro",
    description:
      "Madeira extremamente resistente, usada há séculos. Sua casca tem propriedades medicinais reconhecidas pela ANVISA.",
    funFact:
      "Vive mais de 500 anos e sua madeira é tão densa que afunda em água — chamada de 'madeira-pedra'.",
  },

  // ─── CERRADO (Tier 2) ───────────────────────────────────────────────────
  {
    commonName: "Pequi",
    scientificName: "Caryocar brasiliense",
    biomeId: 2,
    tierRequired: 2,
    costPoints: 150,
    rarity: "comum",
    description:
      "Símbolo do Cerrado e da culinária goiana e mineira. Seus frutos são usados em pratos típicos e na produção de óleo.",
    funFact:
      "Uma única árvore de pequi pode produzir mais de 500 frutos por temporada e viver mais de 100 anos.",
  },
  {
    commonName: "Buriti",
    scientificName: "Mauritia flexuosa",
    biomeId: 2,
    tierRequired: 2,
    costPoints: 180,
    rarity: "comum",
    description:
      "A 'árvore da vida' do Cerrado. Cresce às margens de rios e veredas, sendo usada integralmente pelas comunidades.",
    funFact:
      "Do buriti se aproveitam folhas (artesanato), frutos (óleo e polpa), palmito e até o tronco. Nada é desperdiçado.",
  },
  {
    commonName: "Baru",
    scientificName: "Dipteryx alata",
    biomeId: 2,
    tierRequired: 2,
    costPoints: 200,
    rarity: "incomum",
    description:
      "Semente nutritiva do Cerrado com mais proteína que o amendoim e mais cálcio que o leite.",
    funFact:
      "A casca do baru é tão dura que só o queixada (um porco selvagem) consegue quebrar com os dentes.",
  },
  {
    commonName: "Lobeira",
    scientificName: "Solanum lycocarpum",
    biomeId: 2,
    tierRequired: 2,
    costPoints: 160,
    rarity: "comum",
    description:
      "Arbusto do Cerrado cujos frutos grandes e amarelos são a principal fonte de alimento do lobo-guará.",
    funFact:
      "A relação entre lobeira e lobo-guará é tão intensa que o lobo dispersa as sementes pelo sertão nas fezes.",
  },
  {
    commonName: "Cagaita",
    scientificName: "Eugenia dysenterica",
    biomeId: 2,
    tierRequired: 2,
    costPoints: 220,
    rarity: "incomum",
    description:
      "Árvore frutífera nativa do Cerrado com frutos brancos levemente ácidos, ricos em vitamina C.",
    funFact:
      "Floresce antes das chuvas, em agosto e setembro, cobrindo a árvore de flores brancas quando ainda está seca.",
  },
  {
    commonName: "Ipê-do-Cerrado",
    scientificName: "Handroanthus ochraceus",
    biomeId: 2,
    tierRequired: 2,
    costPoints: 280,
    rarity: "raro",
    description:
      "Uma das espécies de ipê mais comuns no Cerrado. Floresce em amarelo dourado na época seca, sem folhas.",
    funFact:
      "Ipês florescem sincronizados dentro de uma mesma espécie — todas as árvores de uma região florescem juntas.",
  },

  // ─── MATA ATLÂNTICA (Tier 3) ────────────────────────────────────────────
  {
    commonName: "Ipê Amarelo",
    scientificName: "Handroanthus albus",
    biomeId: 3,
    tierRequired: 3,
    costPoints: 350,
    rarity: "raro",
    description:
      "Árvore nacional do Brasil. Sua floração amarela intensa é um dos espetáculos mais belos da natureza brasileira.",
    funFact:
      "O Ipê Amarelo é árvore símbolo do Brasil desde 1961. Floresce por apenas 2 semanas ao ano, com impacto total.",
  },
  {
    commonName: "Ipê Rosa",
    scientificName: "Handroanthus impetiginosus",
    biomeId: 3,
    tierRequired: 3,
    costPoints: 380,
    rarity: "raro",
    description:
      "De coloração rosa intensa, é usado na medicina tradicional e é uma das árvores mais plantadas em arborização urbana.",
    funFact:
      "Sua casca produz o 'lapacho', composto estudado por pesquisadores como potencial agente antimicrobiano.",
  },
  {
    commonName: "Araucária",
    scientificName: "Araucaria angustifolia",
    biomeId: 3,
    tierRequired: 3,
    costPoints: 420,
    rarity: "raro",
    description:
      "Símbolo do sul do Brasil. Árvore pré-histórica que sobreviveu aos dinossauros — hoje criticamente ameaçada de extinção.",
    funFact:
      "O pinhão (semente da Araucária) foi base alimentar dos povos indígenas Kaingang por milhares de anos.",
  },
  {
    commonName: "Palmito Juçara",
    scientificName: "Euterpe edulis",
    biomeId: 3,
    tierRequired: 3,
    costPoints: 460,
    rarity: "epico",
    description:
      "Palmeira ameaçada de extinção pela extração ilegal do palmito. Seus frutos são idênticos ao açaí e igualmente nutritivos.",
    funFact:
      "Aves como tucanos, jacutingas e sabiás dependem exclusivamente dos frutos da Juçara para sobreviver no inverno.",
  },
  {
    commonName: "Jequitibá-Rosa",
    scientificName: "Cariniana legalis",
    biomeId: 3,
    tierRequired: 3,
    costPoints: 500,
    rarity: "epico",
    description:
      "Uma das maiores árvores da Mata Atlântica. Exemplares milenares podem ultrapassar 40 metros de altura.",
    funFact:
      "O jequitibá-rosa de Vassouras (RJ) tem mais de 3.000 anos — é considerado o ser vivo mais velho do Brasil.",
  },
  {
    commonName: "Jacarandá-da-Bahia",
    scientificName: "Dalbergia nigra",
    biomeId: 3,
    tierRequired: 3,
    costPoints: 550,
    rarity: "epico",
    description:
      "Madeira nobre da Mata Atlântica, usada em instrumentos musicais finos (violões, guitarras). Criticamente ameaçado.",
    funFact:
      "O jacarandá é tão valorizado que sua exportação é proibida por lei. Luthiers do mundo todo o consideram a madeira mais musical.",
  },
  {
    commonName: "Pau-Brasil",
    scientificName: "Paubrasilia echinata",
    biomeId: 3,
    tierRequired: 5,
    costPoints: 1200,
    rarity: "lendario",
    description:
      "A árvore que deu nome ao país. Quase extinta pela exploração colonial, hoje é símbolo de resistência e renascimento.",
    funFact:
      "O melhor arco de violino do mundo é feito de Pau-Brasil. A madeira produz um som único, chamado de 'madeira que canta'.",
  },

  // ─── PANTANAL (Tier 4) ──────────────────────────────────────────────────
  {
    commonName: "Carandá",
    scientificName: "Copernicia alba",
    biomeId: 4,
    tierRequired: 4,
    costPoints: 600,
    rarity: "incomum",
    description:
      "Palmeira majestosa do Pantanal. Forma imensos buritizais que servem de abrigo e alimento para centenas de espécies.",
    funFact:
      "Tuiuiús (a ave símbolo do Pantanal) fazem seus ninhos no topo dos carandás — às vezes ninhos de mais de 200kg.",
  },
  {
    commonName: "Cambará",
    scientificName: "Vochysia divergens",
    biomeId: 4,
    tierRequired: 4,
    costPoints: 650,
    rarity: "incomum",
    description:
      "Árvore invasora nativa que expande o Pantanal à medida que o fogo desequilibra o ecossistema. Paradoxo da natureza.",
    funFact:
      "Pesquisadores usam o avanço do cambará como bioindicador da saúde do Pantanal — mais cambará = mais queimadas.",
  },
  {
    commonName: "Ipê-do-Pantanal",
    scientificName: "Handroanthus heptaphyllus",
    biomeId: 4,
    tierRequired: 4,
    costPoints: 720,
    rarity: "raro",
    description:
      "O ipê de maior porte do Brasil. Suas flores rosas cobrem o Pantanal alagado, criando cenas de tirar o fôlego.",
    funFact:
      "Floresce durante as cheias do Pantanal. As flores caem na água e formam tapetes rosas nos rios e lagoas.",
  },
  {
    commonName: "Bocaiuva",
    scientificName: "Acrocomia aculeata",
    biomeId: 4,
    tierRequired: 4,
    costPoints: 750,
    rarity: "raro",
    description:
      "Palmeira de frutos oleosos usados na culinária e como biocombustível. Resistente ao fogo e à seca.",
    funFact:
      "A bocaiuva produz 6 vezes mais óleo por hectare que a soja — pesquisadores a estudam como alternativa ao diesel.",
  },
  {
    commonName: "Landi",
    scientificName: "Calophyllum brasiliense",
    biomeId: 4,
    tierRequired: 4,
    costPoints: 850,
    rarity: "epico",
    description:
      "Árvore ribeirinha que cresce nas margens alagadas do Pantanal. Sua madeira resistente à água é usada em construções navais.",
    funFact:
      "O óleo extraído das sementes do landi tem propriedades anti-inflamatórias e é estudado pela farmacologia moderna.",
  },

  // ─── AMAZÔNIA (Tier 5) ──────────────────────────────────────────────────
  {
    commonName: "Castanheira-do-Pará",
    scientificName: "Bertholletia excelsa",
    biomeId: 5,
    tierRequired: 5,
    costPoints: 900,
    rarity: "epico",
    description:
      "Uma das árvores mais importantes da Amazônia. Suas castanhas sustentam comunidades ribeirinhas e indígenas há milênios.",
    funFact:
      "A castanheira só se reproduz com a presença de uma abelha específica (Eulaema sp.) e de cutias para enterrar as sementes.",
  },
  {
    commonName: "Açaizeiro",
    scientificName: "Euterpe oleracea",
    biomeId: 5,
    tierRequired: 5,
    costPoints: 950,
    rarity: "epico",
    description:
      "Palmeira cujos frutos são base alimentar de povos amazônicos. O açaí é hoje um dos superalimentos mais consumidos no mundo.",
    funFact:
      "Um açaizeiro produz até 40kg de frutos por ano e vive em colônias — cortando uma palha, nascem três novas.",
  },
  {
    commonName: "Seringueira",
    scientificName: "Hevea brasiliensis",
    biomeId: 5,
    tierRequired: 5,
    costPoints: 1000,
    rarity: "epico",
    description:
      "Árvore que mudou o mundo. O látex extraído de seu tronco foi responsável pelo ciclo da borracha e pela Era Industrial.",
    funFact:
      "O primeiro pneumático de bicicleta (1888) e de automóvel (1895) foram feitos de borracha da Seringueira amazônica.",
  },
  {
    commonName: "Andiroba",
    scientificName: "Carapa guianensis",
    biomeId: 5,
    tierRequired: 5,
    costPoints: 1050,
    rarity: "epico",
    description:
      "Árvore medicinal da Amazônia. Seu óleo é repelente natural de insetos e tem propriedades anti-inflamatórias.",
    funFact:
      "Comunidades ribeirinhas usam o óleo de andiroba há séculos antes de qualquer repelente industrial existir.",
  },
  {
    commonName: "Samaúma",
    scientificName: "Ceiba pentandra",
    biomeId: 5,
    tierRequired: 5,
    costPoints: 1400,
    rarity: "lendario",
    description:
      "A 'rainha da Amazônia'. Pode atingir 70 metros de altura e 3 metros de diâmetro. Considerada sagrada por povos indígenas.",
    funFact:
      "Uma única samaúma abriga mais de 2.000 espécies diferentes de insetos, fungos, plantas epífitas e animais.",
  },
  {
    commonName: "Pau-Rosa",
    scientificName: "Aniba rosaeodora",
    biomeId: 5,
    tierRequired: 5,
    costPoints: 1600,
    rarity: "lendario",
    description:
      "Árvore quase extinta cujo óleo essencial é um dos mais valiosos do mundo — usado na fabricação do perfume Chanel Nº5.",
    funFact:
      "Na década de 1950, o Brasil exportava 400 toneladas de óleo de pau-rosa por ano. Hoje a espécie é criticamente ameaçada.",
  },
];

// ---------------------------------------------------------------------------
// MATÉRIA INICIAL — ICTA13
// ---------------------------------------------------------------------------
const ICTA13_BLOCKS = [
  {
    orderIndex: 1,
    title: "O que é Álgebra Linear?",
    body: `Álgebra Linear é o ramo da matemática que estuda **vetores**, **matrizes** e as transformações entre eles.

Mas por que isso importa no mundo real?

Toda vez que o Netflix recomenda um filme, o GPS calcula sua rota ou uma IA reconhece seu rosto — Álgebra Linear está funcionando por baixo dos panos.

**Pense assim:** se você quiser descrever a posição de um ponto no espaço, você usa coordenadas (x, y, z). Esses são vetores. Álgebra Linear é a linguagem das coordenadas e das transformações entre elas.`,
    hasFormula: false,
    pointsReward: 10,
    checkpoints: [
      {
        question: "Qual das situações abaixo NÃO usa Álgebra Linear?",
        optionA: "Reconhecimento facial pelo celular",
        optionB: "Calcular quantas pizzas servem para 10 pessoas",
        optionC: "Compressão de imagens JPEG",
        optionD: "Rota de navegação GPS",
        correctOption: "b",
        explanation:
          "Dividir pizza é aritmética simples. Reconhecimento facial, compressão JPEG e GPS utilizam operações matriciais — coração da Álgebra Linear.",
      },
    ],
  },
  {
    orderIndex: 2,
    title: "Vetores: mais do que uma flecha",
    body: `Um **vetor** representa duas coisas ao mesmo tempo: **direção** e **magnitude** (tamanho).

Imagine que você está andando 5km para o norte. Isso é um vetor: tem tamanho (5km) e direção (norte).

Matematicamente, escrevemos assim:`,
    hasFormula: true,
    formulaLatex: "\\vec{v} = \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}",
    pointsReward: 10,
    checkpoints: [
      {
        question: "O que diferencia um vetor de um número comum (escalar)?",
        optionA: "Vetores são sempre maiores que escalares",
        optionB: "Vetores têm direção e magnitude; escalares só têm magnitude",
        optionC: "Vetores só existem em 2 dimensões",
        optionD: "Escalares são usados apenas em física",
        correctOption: "b",
        explanation:
          "A temperatura de 30°C é um escalar — só tem valor. Já 'vento de 30km/h vindo do norte' é um vetor — tem valor (30km/h) e direção (norte).",
      },
    ],
  },
  {
    orderIndex: 3,
    title: "Matrizes: tabelas que transformam o mundo",
    body: `Uma **matriz** é uma grade de números organizada em linhas e colunas. Simples assim.

Mas o poder das matrizes está no que elas fazem: **transformar vetores**.

Quando você aplica um filtro numa foto, o sistema pega cada pixel (um vetor de cores RGB) e multiplica por uma matriz de transformação. O resultado? Brilho aumentado, contraste ajustado, sépia aplicada.`,
    hasFormula: true,
    formulaLatex:
      "A = \\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} \\quad \\text{matriz 2×2}",
    pointsReward: 10,
    checkpoints: [
      {
        question: "Uma matriz 3×4 tem quantos elementos no total?",
        optionA: "7",
        optionB: "34",
        optionC: "12",
        optionD: "43",
        correctOption: "c",
        explanation:
          "3 linhas × 4 colunas = 12 elementos. Lembre: primeiro número = linhas, segundo = colunas.",
      },
    ],
  },
  {
    orderIndex: 4,
    title: "Multiplicação de Matrizes na prática",
    body: `Multiplicar matrizes parece complicado, mas segue uma regra simples: **linha por coluna**.

Para multiplicar A × B, o número de **colunas de A** deve ser igual ao número de **linhas de B**.

Na prática, isso é o que acontece quando um modelo de IA processa uma imagem: ela passa por dezenas de multiplicações matriciais em frações de segundo.`,
    hasFormula: true,
    formulaLatex:
      "C_{ij} = \\sum_{k=1}^{n} A_{ik} \\cdot B_{kj}",
    pointsReward: 10,
    checkpoints: [
      {
        question:
          "Posso multiplicar uma matriz 2×3 por uma matriz 3×5. Qual o tamanho do resultado?",
        optionA: "2×5",
        optionB: "3×3",
        optionC: "6×5",
        optionD: "Não é possível multiplicar",
        correctOption: "a",
        explanation:
          "O resultado de (m×n) × (n×p) é sempre (m×p). Aqui: (2×3) × (3×5) = 2×5. As dimensões internas (3) se 'cancelam'.",
      },
    ],
  },
  {
    orderIndex: 5,
    title: "Determinante e o que ele representa",
    body: `O **determinante** é um número único calculado a partir de uma matriz quadrada. Ele diz coisas importantes:

- Se det(A) = 0 → a matriz é **singular** (não invertível).
- Se det(A) ≠ 0 → a matriz é **invertível** e o sistema tem solução única.

Geometricamente, o determinante representa o **fator de escala** de uma transformação: o quanto uma matriz "estica" ou "espreme" o espaço.`,
    hasFormula: true,
    formulaLatex:
      "\\det(A) = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc",
    pointsReward: 10,
    checkpoints: [
      {
        question:
          "Se det(A) = 0, o que podemos concluir sobre o sistema linear Ax = b?",
        optionA: "O sistema sempre tem solução infinita",
        optionB: "O sistema não tem solução única — pode ser inconsistente ou ter infinitas soluções",
        optionC: "O sistema tem exatamente uma solução",
        optionD: "O determinante zero não afeta o sistema",
        correctOption: "b",
        explanation:
          "Determinante zero significa que a matriz 'achata' o espaço — perde uma dimensão. Isso impede solução única. O sistema pode não ter solução ou ter infinitas.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// FUNÇÃO PRINCIPAL
// ---------------------------------------------------------------------------
async function main() {
  console.log("🌱 Iniciando seed da Reserva Florestal...\n");

  // Biomas
  console.log("🗺️  Criando biomas...");
  for (const biome of BIOMES) {
    await prisma.biome.upsert({
      where: { id: biome.id },
      update: biome,
      create: biome,
    });
  }
  console.log(`   ✓ ${BIOMES.length} biomas criados.\n`);

  // Árvores
  console.log("🌳 Criando catálogo de árvores...");
  for (const tree of TREES) {
    await prisma.tree.upsert({
      where: {
        id: TREES.indexOf(tree) + 1,
      },
      update: tree,
      create: tree,
    });
  }

  const byRarity = TREES.reduce(
    (acc, t) => {
      acc[t.rarity] = (acc[t.rarity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  console.log(`   ✓ ${TREES.length} árvores criadas:`);
  Object.entries(byRarity).forEach(([rarity, count]) => {
    const emoji: Record<string, string> = {
      comum: "🟢",
      incomum: "🔵",
      raro: "🟣",
      epico: "🟠",
      lendario: "🌟",
    };
    console.log(`      ${emoji[rarity] || "•"} ${count}x ${rarity}`);
  });
  console.log();

  // Matéria ICTA13
  console.log("📚 Criando matéria ICTA13...");
  const subject = await prisma.subject.upsert({
    where: { code: "ICTA13" },
    update: {},
    create: {
      code: "ICTA13",
      name: "Álgebra Linear e Aplicações",
      description:
        "Introdução à Álgebra Linear com foco em aplicações práticas: vetores, matrizes, sistemas lineares e transformações.",
    },
  });

  for (const blockData of ICTA13_BLOCKS) {
    const { checkpoints, ...block } = blockData;

    const contentBlock = await prisma.contentBlock.upsert({
      where: {
        id: `icta13-block-${block.orderIndex}`,
      },
      update: { ...block, subjectId: subject.id },
      create: {
        id: `icta13-block-${block.orderIndex}`,
        ...block,
        subjectId: subject.id,
      },
    });

    for (const cp of checkpoints) {
      await prisma.checkpoint.upsert({
        where: {
          id: `icta13-block-${block.orderIndex}-cp-1`,
        },
        update: { ...cp, blockId: contentBlock.id },
        create: {
          id: `icta13-block-${block.orderIndex}-cp-1`,
          ...cp,
          blockId: contentBlock.id,
        },
      });
    }
  }
  console.log(
    `   ✓ ${ICTA13_BLOCKS.length} blocos criados com checkpoints.\n`
  );

  console.log("✅ Seed concluído! A reserva está pronta para florescer.");

  // Missões Diárias
  console.log("\n📋 Criando missões diárias...");
  const MISSIONS = [
    { id: 'mission-login', title: 'Login Diário', description: 'Faça login para continuar seu streak', type: 'login' as const, target: 1, pointsReward: 20, dayOfWeek: null },
    { id: 'mission-content-1', title: 'Estude 1 Bloco', description: 'Complete pelo menos 1 bloco de conteúdo', type: 'content' as const, target: 1, pointsReward: 30, dayOfWeek: null },
    { id: 'mission-content-3', title: 'Estude 3 Blocos', description: 'Complete 3 blocos de conteúdo', type: 'content' as const, target: 3, pointsReward: 75, dayOfWeek: null },
    { id: 'mission-forest-1', title: 'Plante uma Árvore', description: 'Plante pelo menos 1 árvore', type: 'forest' as const, target: 1, pointsReward: 25, dayOfWeek: null },
    { id: 'mission-forest-3', title: 'Hora do Plantio', description: 'Plante 3 árvores', type: 'forest' as const, target: 3, pointsReward: 60, dayOfWeek: null },
    { id: 'mission-streak-3', title: 'Streak de 3 Dias', description: 'Mantenha 3 dias consecutivos', type: 'streak' as const, target: 3, pointsReward: 50, dayOfWeek: null },
    { id: 'mission-social-1', title: 'Compartilhe', description: 'Faça uma postagem na comunidade', type: 'social' as const, target: 1, pointsReward: 40, dayOfWeek: null },
  ];

  for (const mission of MISSIONS) {
    await prisma.dailyMission.upsert({
      where: { id: mission.id },
      update: mission,
      create: mission,
    });
  }
  console.log(`   ✓ ${MISSIONS.length} missões diárias criadas.\n`);

  // Conquistas
  console.log("🏆 Criando conquistas...");
  const ACHIEVEMENTS = [
    { code: 'first_login', title: 'Bem-vindo!', description: 'Complete seu primeiro login', icon: '👋', pointsBonus: 50, tier: 1, type: 'streak' as const },
    { code: 'streak_3', title: 'No caminho certo', description: '3 dias seguidos de estudo', icon: '🔥', pointsBonus: 100, tier: 1, type: 'streak' as const },
    { code: 'streak_7', title: 'Uma semana!', description: '7 dias seguidos de estudo', icon: '💪', pointsBonus: 250, tier: 2, type: 'streak' as const },
    { code: 'streak_30', title: 'Mês champion', description: '30 dias seguidos de estudo', icon: '🏆', pointsBonus: 1000, tier: 3, type: 'streak' as const },
    { code: 'points_100', title: 'Iniciante', description: 'Acumule 100 pontos', icon: '🌱', pointsBonus: 50, tier: 1, type: 'points' as const },
    { code: 'points_1000', title: 'Explorador', description: 'Acumule 1.000 pontos', icon: '🌿', pointsBonus: 200, tier: 2, type: 'points' as const },
    { code: 'points_10000', title: 'Mestre', description: 'Acumule 10.000 pontos', icon: '🌳', pointsBonus: 500, tier: 3, type: 'points' as const },
    { code: 'forest_5', title: 'Reflorestador iniciante', description: 'Plante 5 árvores', icon: '🌲', pointsBonus: 100, tier: 1, type: 'forest' as const },
    { code: 'forest_25', title: 'Reflorestador avançado', description: 'Plante 25 árvores', icon: '🌳', pointsBonus: 300, tier: 2, type: 'forest' as const },
    { code: 'forest_100', title: 'Guardião da floresta', description: 'Plante 100 árvores', icon: '🌴', pointsBonus: 1000, tier: 3, type: 'forest' as const },
    { code: 'content_5', title: 'Primeiros passos', description: 'Complete 5 blocos de conteúdo', icon: '📚', pointsBonus: 100, tier: 1, type: 'content' as const },
    { code: 'content_25', title: 'Estudioso', description: 'Complete 25 blocos de conteúdo', icon: '📖', pointsBonus: 300, tier: 2, type: 'content' as const },
    { code: 'content_100', title: 'Erudito', description: 'Complete 100 blocos de conteúdo', icon: '🎓', pointsBonus: 1000, tier: 3, type: 'content' as const },
    { code: 'social_first', title: 'Sociável', description: 'Faça sua primeira postagem', icon: '💬', pointsBonus: 50, tier: 1, type: 'social' as const },
    { code: 'social_10', title: 'Colaborador', description: 'Faça 10 postagens', icon: '🤝', pointsBonus: 200, tier: 2, type: 'social' as const },
  ];

  for (const ach of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { code: ach.code },
      update: ach,
      create: ach,
    });
  }
  console.log(`   ✓ ${ACHIEVEMENTS.length} conquistas criadas.\n`);

  console.log("🎉 Fase 04 pronta! Missões e conquistas configuradas.");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
