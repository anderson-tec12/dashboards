---
name: dark mode echarts
overview: Configurar o tema da aplica\u00e7\u00e3o para dark mode permanente (sem toggle) no Tailwind v4 e instalar o Apache ECharts com um wrapper React reutiliz\u00e1vel e customiz\u00e1vel.
todos:
  - id: theme
    content: Configurar tema dark-only em globals.css (variaveis de cor, color-scheme dark, @theme inline) e ajustar layout.tsx (html dark/pt-BR, body bg/text)
    status: completed
  - id: install
    content: Instalar echarts e echarts-for-react via npm
    status: completed
  - id: wrapper
    content: Criar src/components/Chart.tsx (Client Component) com tema dark do ECharts registrado e defaults customizaveis
    status: completed
  - id: demo
    content: Atualizar src/app/page.tsx com grafico de demonstracao dentro de um card
    status: completed
  - id: verify
    content: Rodar npm run dev e npm run lint para validar
    status: completed
isProject: false
---

# Dark mode permanente + Apache ECharts

## Contexto
Projeto Next.js 16 (App Router) + React 19 + Tailwind v4. Hoje o [src/app/globals.css](src/app/globals.css) tem apenas `@import "tailwindcss";` e nao ha tema definido. O [src/app/layout.tsx](src/app/layout.tsx) usa `lang="en"` e o body nao aplica cores. A escolha foi **Apache ECharts** (canvas, alta performance, altamente customizavel), gratuito/open-source.

## 1. Tema dark-only (Tailwind v4)
Como o pedido e "apenas dark", nao havera toggle nem variante `dark:` nem `prefers-color-scheme`: as cores escuras viram o padrao base.

Em [src/app/globals.css](src/app/globals.css):
- Manter `@import "tailwindcss";`.
- Definir variaveis de cor escuras em `:root` (ex.: `--background: #0b0f17; --foreground: #e6edf3; --card: #131a26; --border: #1f2a3a; --accent: #3b82f6`).
- Forcar `color-scheme: dark;` no `:root` (deixa scrollbars/controles nativos escuros).
- Mapear as variaveis para o Tailwind v4 via bloco `@theme inline` (`--color-background`, `--color-foreground`, `--color-card`, `--color-border`, `--color-accent`) para habilitar utilitarios como `bg-background`, `text-foreground`, `border-border`.
- Aplicar `background` e `color` base no `body`.

Em [src/app/layout.tsx](src/app/layout.tsx):
- Adicionar `className="dark"` no `<html>` (semantico/compat futura) e trocar `lang` para `pt-BR`.
- Aplicar `bg-background text-foreground` no `<body>`.

## 2. Instalar ECharts
```bash
npm install echarts echarts-for-react
```
`echarts-for-react@^3.0.4` suporta React 19 (peer `react: >=16`) e usa `echarts@^6`. Sem necessidade de `--legacy-peer-deps`.

## 3. Wrapper de grafico reutilizavel e customizavel
Criar `src/components/Chart.tsx` como Client Component:
- `"use client"` no topo (ECharts depende de DOM/efeitos; ver `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`).
- Registrar um tema dark do ECharts (`echarts.registerTheme("dashboard-dark", {...})`) usando a mesma paleta das variaveis CSS (fundo transparente, eixos/labels em tons claros, paleta de series de acento).
- Componente recebe props: `option: EChartsOption`, `style`/`className`, `height` (default ex. 360px), permitindo customizacao total por chamada. Fazer deep-merge de defaults (grid, tooltip, textStyle) com o `option` recebido.
- Usar `ReactECharts` com `theme="dashboard-dark"` e `opts={{ renderer: "canvas" }}`.

## 4. Demonstracao
Atualizar [src/app/page.tsx](src/app/page.tsx) para renderizar um grafico de exemplo (ex.: linha + barras) dentro de um card (`bg-card border border-border rounded-lg p-4`) usando `<Chart option={...} />`, validando tema e lib.

## 5. Verificacao
- `npm run dev` e inspecionar a pagina (fundo escuro, grafico renderizado com paleta dark).
- `npm run lint` (Biome) para garantir formatacao/lint.

## Observacoes
- Para otimizar bundle posteriormente, da pra migrar para imports modulares do ECharts (`echarts/core` + registro seletivo). Nesta etapa usaremos o import padrao via `echarts-for-react` para simplicidade; sinalizo isso como melhoria futura.