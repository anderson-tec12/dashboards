---
name: Gerar arquivo nvmrc
overview: Criar um arquivo .nvmrc na raiz do projeto fixando a versão do Node em uma LTS compatível com o requisito do Next.js 16 (node >=20.9.0).
todos: []
isProject: false
---

## Contexto

- `package.json` usa `next` 16.2.9 e `react` 19.2.4.
- O Next 16 exige `node >=20.9.0` (`node_modules/next/package.json`, campo `engines`).
- O Node instalado localmente é v18.17.0, incompatível com o projeto.
- Ainda nao existe `.nvmrc` na raiz.

## Acao

Criar `[.nvmrc](.nvmrc)` na raiz do repositorio com a versao LTS 22 (Jod), que satisfaz com folga o requisito `>=20.9.0`:

```
22
```

## Observacao

Apos criar o arquivo, rodar `nvm install` / `nvm use` instala/ativa o Node 22 (sera preciso, ja que o ambiente atual esta no Node 18). Caso prefira outra versao (ex.: `24` LTS mais recente, ou uma versao fixa como `22.20.0` para reprodutibilidade), ajusto o conteudo.