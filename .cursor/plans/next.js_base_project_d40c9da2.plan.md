---
name: Next.js Base Project
overview: Criar um projeto Next.js base e limpo no diretorio atual com TypeScript, Tailwind CSS, App Router e Biome (linter/formatter) no lugar do ESLint, usando npm.
todos:
  - id: scaffold
    content: Gerar projeto Next.js no diretorio atual com create-next-app (TS, Tailwind, App Router, src-dir, sem ESLint, npm)
    status: completed
  - id: biome
    content: Instalar e configurar Biome (biome.json) e adicionar scripts lint/format no package.json
    status: completed
  - id: cleanup
    content: "Limpar boilerplate: page.tsx, globals.css e assets de exemplo em public/"
    status: completed
  - id: verify
    content: Rodar npm run lint e npm run build para validar o setup
    status: completed
isProject: false
---

# Projeto Next.js Base

Criar um projeto Next.js limpo no diretorio atual (`/Users/bbox/Projects/DevTech/dashboards`), que ja possui `.git` inicializado mas esta vazio.

## Stack
- Next.js (ultima versao) com App Router
- TypeScript
- Tailwind CSS
- Biome (linter + formatter) no lugar do ESLint
- npm como gerenciador de pacotes

## Passos

1. **Gerar o projeto** com `create-next-app` no diretorio atual, sem ESLint (sera substituido por Biome):

```bash
npx create-next-app@latest . --ts --tailwind --app --src-dir --no-eslint --use-npm --import-alias "@/*"
```

- `.` cria no diretorio atual (que ja tem `.git`)
- `--src-dir` organiza o codigo em `src/`
- `--no-eslint` para usarmos Biome

2. **Adicionar e configurar o Biome**:

```bash
npm install --save-dev --save-exact @biomejs/biome
npx biome init
```

- Ajustar `biome.json` para habilitar formatter + linter e organizacao de imports
- Adicionar scripts ao `package.json`:
  - `"lint": "biome check ."`
  - `"format": "biome format --write ."`

3. **Limpar o boilerplate** para deixar a base realmente "limpa":
   - Simplificar `src/app/page.tsx` (remover conteudo de demonstracao do Next)
   - Limpar `src/app/globals.css` mantendo apenas as diretivas do Tailwind
   - Remover assets de exemplo nao usados em `public/` (ex.: `next.svg`, `vercel.svg`)

4. **Verificar**:
   - `npm run lint` (Biome) sem erros
   - `npm run build` para garantir que compila
   - `npm run dev` para validar que sobe localmente

## Resultado
Uma base Next.js minima e pronta para desenvolvimento, com Tailwind e Biome configurados, sem o boilerplate de demonstracao.