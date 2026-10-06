# Guiler — portfólio Full Stack

Portfólio de Guilherme Serafim em React, TypeScript e Vite. Projeto independente da aplicação Remotion da pasta superior.

## Executar

```powershell
cd C:\Users\Guiler\Desktop\wks\guiler\portfolio
npm install
npm run dev
```

`npm run build` verifica TypeScript e gera o site estático em `dist/`. `npm run preview` serve esse build localmente.

## Editar

- `src/data.ts`: projetos, tecnologias, links e experiências.
- `src/App.tsx`: seções, navegação, filtros e contato.
- `src/styles.css`: identidade visual e layouts responsivos.
- `src/components/Interactions.tsx`: retrato Tilted Card e CTA Magnetic adaptados do React Bits; Reveal próprio.
- `src/components/ProjectVisual.tsx`: ilustrações conceituais dos projetos, identificadas como tal.
- `src/components/ProjectDialog.tsx`: detalhes de projetos em diálogo nativo com navegação por teclado.
- `public/images/`: fotos fornecidas, otimizadas para WebP.
- `public/GuilhermeSerafim_Fullstack.pdf`: currículo original para download.

`library-research.txt` documenta a pesquisa das cinco bibliotecas, componentes escolhidos, adaptações, inspirações e dependências. `THIRD-PARTY-NOTICES.txt` preserva a licença do React Bits. R3F foi pesquisado e não integra o runtime desta versão.

`content-review.txt` contém feedback do currículo e versões sugeridas para a headline e o Sobre do LinkedIn. O conteúdo do site não apresenta percentuais sem contexto nem cargo de designer.

## Hospedagem

Site estático configurado em `.openai/hosting.json`, com identidade Sites preservada. A audiência inicial é privada. O mesmo `dist/` pode ser hospedado em outro serviço estático. Ao mudar o domínio, atualizar canonical e Open Graph em `index.html`.

## Verificação

Build TypeScript + Vite e navegação real com Playwright. Foram verificados filtros, detalhes dos dois projetos, fechamento por Escape, restauração de foco, navegação móvel, cópia do e-mail, download do PDF, carregamento das fotos, movimento reduzido e ausência de overflow horizontal em 320, 390, 768, 1024 e 1440 px. Capturas em `../output/playwright/`.
