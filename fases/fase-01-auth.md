# Fase 01 — Autenticação

## Objetivo
Permitir que usuários se cadastrem (email/senha ou Google), façam login, mantenham sessão persistida e sejam redirecionados para uma área protegida (dashboard placeholder).

## Pré-requisitos
- Fase 00 concluída e verificada
- `NEXTAUTH_SECRET` gerado (`openssl rand -base64 32`)
- Credenciais Google OAuth criadas em https://console.cloud.google.com (opcional para MVP)

## Dependências a Instalar

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

`next-auth` já está no `package.json` da Fase 00.

## Schema Prisma

Sem alterações nesta fase. O model `User` já tem `passwordHash` e `email`.

## Tarefas

- [ ] Criar `app/api/auth/[...nextauth]/route.ts` com NextAuth config
- [ ] Configurar `CredentialsProvider` com email/senha
- [ ] Configurar `GoogleProvider` (opcional, pode ficar como TODO)
- [ ] Implementar callback `signIn` que cria usuário se não existir (Google)
- [ ] Implementar `jwt` e `session` callbacks para incluir `id`, `currentTier`, `totalPoints`
- [ ] Criar `lib/auth/hash.ts` com `hashPassword(pwd)` e `verifyPassword(pwd, hash)`
- [ ] Criar `app/api/auth/register/route.ts` para signup com email/senha
- [ ] Validar email (regex) e senha (mín 8 chars) no signup
- [ ] Criar página `app/(auth)/login/page.tsx` com formulário
- [ ] Criar página `app/(auth)/signup/page.tsx` com formulário
- [ ] Criar componente `<AuthForm>` em `components/auth/AuthForm.tsx` reutilizável
- [ ] Criar `middleware.ts` na raiz protegendo `/dashboard` e outras rotas privadas
- [ ] Criar `lib/store/useUserStore.ts` com Zustand
- [ ] Criar `components/UserProvider.tsx` que hidrata o store ao carregar
- [ ] Criar `app/(app)/dashboard/page.tsx` placeholder mostrando nome do usuário
- [ ] Criar `components/Header.tsx` com avatar + dropdown (logout)
- [ ] Aplicar `<Header>` no layout do grupo `(app)`
- [ ] Tratar erros de login (credenciais inválidas) com toast

## Arquivos a Criar/Modificar

1. `app/api/auth/[...nextauth]/route.ts` (criar)
2. `app/api/auth/register/route.ts` (criar)
3. `lib/auth/hash.ts` (criar)
4. `lib/auth/options.ts` (criar — NextAuth options exportadas)
5. `lib/store/useUserStore.ts` (criar)
6. `components/UserProvider.tsx` (criar)
7. `components/Header.tsx` (criar)
8. `components/auth/AuthForm.tsx` (criar)
9. `app/(auth)/login/page.tsx` (criar)
10. `app/(auth)/signup/page.tsx` (criar)
11. `app/(auth)/layout.tsx` (criar — layout sem header)
12. `app/(app)/layout.tsx` (criar — layout com header, requer auth)
13. `app/(app)/dashboard/page.tsx` (criar)
14. `middleware.ts` (criar na raiz)
15. `types/next-auth.d.ts` (criar — extensão de tipos de session)

## Comandos

```bash
npm install bcryptjs
npm install -D @types/bcryptjs

# Gerar secret
openssl rand -base64 32   # copiar para NEXTAUTH_SECRET no .env.local

# Verificar
npm run dev
# acessar http://localhost:3000/signup → criar conta
# acessar http://localhost:3000/login → logar
# verificar redirect para /dashboard

# Testes
npm test -- auth

# Commit
git add .
git commit -m "fase-01: autenticação com NextAuth + bcrypt"
```

## Testes

- [ ] `tests/lib/auth/hash.test.ts` — hash + verify retornam true; hash + verify com senha errada retornam false
- [ ] `tests/api/auth/register.test.ts` — POST com email+senha cria usuário; POST com email duplicado retorna 409; POST sem campos retorna 400
- [ ] `tests/middleware.test.ts` — rota protegida sem session retorna 302; com session retorna 200
- [ ] `tests/components/AuthForm.test.tsx` — campo email mostra erro se inválido; submit chama callback com valores

Comando: `npm test -- auth`

## Critérios de Aceitação

- [ ] É possível criar conta em `/signup` com email + senha + nome
- [ ] É possível logar em `/login` com credenciais válidas
- [ ] Tentar logar com senha errada mostra mensagem clara em pt-BR
- [ ] Após login, usuário é redirecionado para `/dashboard`
- [ ] `/dashboard` mostra "Olá, [nome]" usando dados da session
- [ ] Acessar `/dashboard` sem login redireciona para `/login`
- [ ] Botão "Sair" no header funciona e limpa a sessão
- [ ] Recarregar a página mantém o usuário logado
- [ ] Senha é armazenada com bcrypt (verificar no Prisma Studio que `password_hash` não é texto puro)
- [ ] Todos os testes de `auth` passam

## Tempo Estimado
3-4 dias

## Próxima Fase
→ [fase-02-conteudo.md](./fase-02-conteudo.md)
