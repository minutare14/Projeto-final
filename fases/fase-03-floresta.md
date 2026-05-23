# Fase 03 — Floresta e Loja

## Objetivo
Usuário consegue navegar pelo mapa visual da sua reserva florestal, abrir a loja de árvores filtrável por bioma e raridade, comprar uma árvore (validando pontos + tier), plantá-la em uma posição X/Y do mapa, ver biomas se desbloqueando automaticamente conforme acumula pontos, e visualizar o CO₂ simbólico total da sua reserva. É possível também visitar a reserva pública de outro usuário.

## Pré-requisitos
- Fase 02 concluída — sistema de pontuação funcionando, usuário consegue acumular pontos

## Dependências a Instalar

```bash
npm install konva react-konva use-image
```

Konva.js para o mapa 2D performático com drag-and-drop de árvores.

## Schema Prisma
Sem alterações. Models `Biome`, `Tree`, `UserForest`, `UserBiome` já existem.

## Tarefas

### Backend
- [ ] Criar `app/api/biomes/route.ts` (GET) — lista biomas com status `unlocked` para o user autenticado
- [ ] Criar `app/api/trees/route.ts` (GET) — filtros por `biome_id`, `rarity`, `tier`; inclui campo `can_buy`
- [ ] Criar `app/api/forest/plant/route.ts` (POST) — body `{ tree_id, pos_x, pos_y }`
  - Validar pontos suficientes
  - Validar tier do usuário >= tier da árvore
  - Validar que (pos_x, pos_y) não colide com árvore existente (raio mínimo de 1.0)
  - Deduzir pontos via `creditPoints(userId, 'tree_purchase', -cost)`
  - Criar registro em `user_forest`
  - Disparar verificação de desbloqueio de bioma
- [ ] Criar `app/api/users/[id]/forest/route.ts` (GET) — reserva pública: árvores, biomas desbloqueados, CO₂
- [ ] Criar `lib/biome/unlock.ts` com `checkBiomeUnlocks(userId)` chamado após cada PointEvent positivo
- [ ] Criar `lib/forest/collision.ts` com `hasCollision(userId, x, y)` consultando user_forest
- [ ] Criar `lib/forest/co2.ts` com `calculateCO2(userId)` agregando `tree.co2_absorption_kg_year`

### Frontend
- [ ] Criar `app/(app)/forest/page.tsx` — reserva do usuário autenticado, modo edição
- [ ] Criar `app/forest/[userId]/page.tsx` — modo visitante (público, sem auth)
- [ ] Criar `components/forest/ForestMap.tsx` usando Konva — Stage, Layer com sprites de árvores
- [ ] Criar `components/forest/TreeSprite.tsx` — representação visual da árvore com hover tooltip
- [ ] Criar `components/forest/BiomeBackground.tsx` — gradiente/imagem de fundo conforme bioma atual
- [ ] Criar `components/shop/TreeShop.tsx` — drawer/sidebar com grid de árvores
- [ ] Criar `components/shop/TreeCard.tsx` — card individual com nome, ilustração, custo, raridade
- [ ] Criar `components/shop/RarityBadge.tsx` — badge colorida por raridade
- [ ] Criar `components/ui/CO2Counter.tsx` — exibe `X kg de CO₂` com tooltip educacional
- [ ] Criar `components/ui/BiomeUnlockModal.tsx` — celebração ao desbloquear novo bioma
- [ ] Implementar drag-and-drop: arrastar árvore da loja → soltar no mapa → confirmação → POST plant
- [ ] Implementar troca de bioma visualizado no mapa (tabs ou seletor)
- [ ] Tooltip ao clicar em árvore plantada: nome científico, fun_fact, CO₂/ano
- [ ] Botão "Visitar floresta de um colega" no header (input de username/id)

## Arquivos a Criar/Modificar

1. `app/api/biomes/route.ts` (criar)
2. `app/api/trees/route.ts` (criar)
3. `app/api/forest/plant/route.ts` (criar)
4. `app/api/users/[id]/forest/route.ts` (criar)
5. `lib/biome/unlock.ts` (criar)
6. `lib/forest/collision.ts` (criar)
7. `lib/forest/co2.ts` (criar)
8. `app/(app)/forest/page.tsx` (criar)
9. `app/forest/[userId]/page.tsx` (criar)
10. `components/forest/ForestMap.tsx` (criar)
11. `components/forest/TreeSprite.tsx` (criar)
12. `components/forest/BiomeBackground.tsx` (criar)
13. `components/shop/TreeShop.tsx` (criar)
14. `components/shop/TreeCard.tsx` (criar)
15. `components/shop/RarityBadge.tsx` (criar)
16. `components/ui/CO2Counter.tsx` (criar)
17. `components/ui/BiomeUnlockModal.tsx` (criar)
18. `public/sprites/trees/*.svg` (placeholders SVG para 31 árvores)
19. `public/sprites/biomes/*.png` (5 backgrounds de bioma)
20. `lib/scoring/service.ts` (modificar — chamar `checkBiomeUnlocks` após crédito)

## Comandos

```bash
npm install konva react-konva use-image

# Verificar
npm run dev
# Logar → /forest → abrir loja → comprar Mandacaru (40pts) → plantar
# Conferir CO₂ counter atualizou
# Acumular 500pts → Cerrado desbloqueado com modal

# Testes
npm test -- forest
npm test -- biome

# Commit
git add .
git commit -m "fase-03: floresta + loja + CO₂ + desbloqueio de biomas"
```

## Testes

- [ ] `tests/lib/biome/unlock.test.ts` — usuário com 500pts → Cerrado desbloqueado; idempotente (não duplica)
- [ ] `tests/lib/forest/collision.test.ts` — posição com árvore existente → true; longe → false
- [ ] `tests/lib/forest/co2.test.ts` — usuário com 3 árvores soma corretamente os `co2_absorption_kg_year`
- [ ] `tests/api/forest/plant.test.ts`:
  - pontos insuficientes → 400
  - tier insuficiente → 403
  - colisão → 409
  - sucesso → 201 + pontos deduzidos + árvore criada
- [ ] `tests/api/users/forest.test.ts` — endpoint público retorna árvores + biomas desbloqueados + CO₂ sem auth
- [ ] `tests/components/forest/TreeSprite.test.tsx` — hover mostra tooltip com fun_fact

Comando: `npm test -- forest && npm test -- biome`

## Critérios de Aceitação

- [ ] `/forest` exibe mapa com background do bioma atual e árvores plantadas (se houver)
- [ ] Loja abre via botão lateral e lista as 6 árvores da Caatinga disponíveis
- [ ] Árvores de tier > current_tier aparecem com cadeado e tooltip "Desbloqueie [bioma] primeiro"
- [ ] Comprar Mandacaru (40pts) deduz 40 do `total_points` e exibe a árvore no mapa
- [ ] Drag-and-drop posiciona a árvore na coordenada solta
- [ ] Tentar plantar em cima de outra árvore mostra erro claro
- [ ] Hover em árvore plantada mostra nome científico + fun_fact + CO₂/ano
- [ ] CO₂Counter atualiza em tempo real ao plantar/remover
- [ ] Atingir 500pts dispara modal de desbloqueio do Cerrado com animação
- [ ] `/forest/[outroUserId]` mostra reserva sem botão de compra (modo visita)
- [ ] Todos os testes da fase passam

## Tempo Estimado
5-7 dias

## Próxima Fase
→ [fase-04-missoes.md](./fase-04-missoes.md)
