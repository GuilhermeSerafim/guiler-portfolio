# Guiler — portfólio Full Stack

Portfólio de Guilherme Serafim em React, TypeScript e Vite, com projetos de IA aplicada, arquitetura de software e desenvolvimento Full Stack.

**Site:** https://guiler.vercel.app/

**Código:** https://github.com/GuilhermeSerafim/guiler-portfolio

## Executar

Requer Node.js 22 e npm.

```sh
git clone https://github.com/GuilhermeSerafim/guiler-portfolio.git
cd guiler-portfolio
npm ci
npm run dev
```

`npm run build` verifica TypeScript e gera o site estático em `dist/`. `npm run preview` serve esse build localmente.

O hero usa uma malha magnética de pontos que reage ao cursor e fica estática em dispositivos de toque ou com movimento reduzido. O parâmetro `?visual=original` permite comparar o layout sem o efeito. Detalhes em [docs/magnetic-field.md](docs/magnetic-field.md).

## Editar

- `src/data.ts`: projetos, tecnologias, links e experiências. `tags` destaca tecnologias principais no cartão; `technologies` permite exibir a lista completa no modal.
- `src/App.tsx`: seções, navegação, filtros e contato.
- `src/styles.css`: identidade visual e layouts responsivos.
- `src/components/Interactions.tsx`: retrato Tilted Card e CTA Magnetic adaptados do React Bits; Reveal próprio.
- `src/components/ProjectVisual.tsx`: ilustrações vetoriais de GeoRisk, Play Senac e Mesa de Negócios, identificadas como visuais conceituais.
- `src/components/SevenToolsVisual.tsx`: capa conceitual do SEVEN Tools, com as ferramentas de propostas, diagnóstico comercial e qualificação de leads conectadas ao hub.
- `src/components/ProjectDialog.tsx`: detalhes em diálogo nativo, com cabeçalho fixo durante a rolagem, navegação por teclado e leitura em tela cheia no celular.
- `public/images/`: fotos fornecidas e captura da landing page publicada, otimizadas para WebP.
- `public/GuilhermeSerafim_Fullstack.pdf`: currículo original para download.

`library-research.txt` documenta a pesquisa das cinco bibliotecas, componentes escolhidos, adaptações, inspirações e dependências. `THIRD-PARTY-NOTICES.txt` preserva a licença do React Bits. R3F foi pesquisado e não integra o runtime desta versão.

`content-review.txt` contém feedback do currículo e versões sugeridas para a headline e o Sobre do LinkedIn. O conteúdo do site não apresenta percentuais sem contexto nem cargo de designer.

## Hospedagem

Produção: https://guiler.vercel.app/. Projeto `guiler`, na conta `guilhermeserafims-projects`.

O projeto está configurado para Vercel em `vercel.json`: framework Vite, build `npm run build` e saída `dist/`. A raiz deste repositório é a Root Directory do projeto.

Depois de autenticar a conta e vincular esta pasta ao projeto correto, `npx vercel --prod --scope guilhermeserafims-projects` publica em produção. `.vercel/` e `.env*` ficam fora do Git e do upload; `.vercelignore` também exclui configurações do Sites e documentos de revisão. Canonical e Open Graph em `index.html` usam o domínio de produção.

A configuração anterior do Sites permanece em `.openai/hosting.json`, com audiência inicial privada.

## Verificação

Build TypeScript + Vite e navegação real com Playwright. Foram verificados filtros, detalhes dos projetos, fechamento por Escape, restauração de foco, navegação móvel, cópia do e-mail, download do PDF, carregamento das fotos, movimento reduzido e ausência de overflow horizontal em 320, 390, 768, 1024 e 1440 px. O case Mesa de Negócios também teve sua capa conceitual, link público e navegação por teclado conferidos. Capturas em `../output/playwright/`.

A revisão mobile com a skill UI/UX Pro Max prioriza texto principal de 16px, alvos de toque de pelo menos 44px, filtros em duas colunas e legendas das capas visíveis. O modal reinicia a rolagem a cada abertura e mantém o fechamento acessível. A validação usa emulação de toque no Chromium, incluindo orientação horizontal, movimento reduzido e ampliação do texto; não substitui testes em aparelhos físicos.
