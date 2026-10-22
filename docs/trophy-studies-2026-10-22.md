# Estudos locais do troféu — 22/10/2026

Pedido: comparar animações para o troféu de reconhecimento no hero usando bibliotecas diferentes. Experimentos somente locais, sem push ou deploy.

Branch: `preview/trophy-studies`, baseada em `69abe64`. Worktree: `output/portfolio-variants/entry-flow`.

## Comparação

| Opção | Biblioteca instalada | Movimento | URL local |
| --- | --- | --- | --- |
| A — Pulso | Motion 12.43.0 | Inclinação e retorno com mola; aro que se dissipa | http://127.0.0.1:5195/__preview/trophy/a |
| B — Traço | GSAP 3.15.0 | Desenho progressivo do troféu com guias técnicas e brilho breve | http://127.0.0.1:5195/__preview/trophy/b |
| C — Conquista | Anime.js 4.5.0 | Elevação curta, brilho e seis pequenas faíscas | http://127.0.0.1:5195/__preview/trophy/c |

Galeria: http://127.0.0.1:5195/__preview/trophy. Usar `Repetir`, mouse, foco de teclado ou toque no troféu. Animações finitas, entrada uma vez quando visível, sem repetição contínua. Preferência por movimento reduzido mantém os desenhos estáticos.

## Isolamento

- Rotas habilitadas somente por `import.meta.env.DEV`, com importação dinâmica.
- O preview usa portal no contêiner do ícone existente. `App.tsx`, cards, projetos, links, currículo e Analytics não foram modificados.
- GSAP e Anime.js adicionados como dependências de desenvolvimento para a comparação. Motion já existia.
- A página `/` conserva o troféu original. Após a escolha, integrar apenas a alternativa selecionada e avaliar seu custo de produção.

## Verificação

- Build e TypeScript aprovados após os ajustes finais.
- Os arquivos de produção mantiveram os mesmos nomes e tamanhos da base: `index-caWpwScZ.js` (396,74 kB; gzip 130,78 kB) e `index-B5XFJNSJ.css` (62,77 kB; gzip 13,73 kB). Nenhum módulo de preview ou biblioteca experimental foi incluído.
- Três variantes verificadas em 1440, 390 e 320 px, sem overflow horizontal, com um botão de 52 × 52 px no hero e sem elementos interativos aninhados.
- Cliques e teclado ativam as três variantes; cenários com toque em contexto móvel emulado também aprovados. Não houve teste em aparelho físico.
- Movimento reduzido testado desde o carregamento e alterado durante a animação; replay permanece estático.
- A mola foi encurtada após a primeira medição; nova verificação confirmou repouso em até 1,6 s, com `transform: none` e estado estável.
- Zero erros de página, requisições ao Google ou ao monitor de disponibilidade nos cenários locais observados.
- Galeria validada também em 320 px. Produção não alterada.

Evidências em `C:/Users/Guiler/Desktop/wks/guiler/output/playwright/`: `trophy-qa-result.json`, `trophy-interaction-qa-result.json`, capturas `trophy-*` e os dois scripts de interação. O primeiro relatório registra a medição inicial da mola; o segundo documenta a correção e rechecagem.

## Fontes primárias

- [Motion: animação em React](https://motion.dev/docs/react-animation)
- [GSAP: contexto e limpeza](https://gsap.com/docs/v3/GSAP/gsap.context()/)
- [Anime.js: uso com React](https://animejs.com/documentation/getting-started/using-with-react/)

## Escolha C e preparação da publicação

Guiler escolheu **C — Conquista** e autorizou publicar o conjunto local: troféu C, fotos A em `03 / ALÉM DO EDITOR` e feedback de solicitação do currículo.

- `TrophyCelebrate.tsx/.css` promovidos para `src/components` e integrados ao hero. O contêiner mede 52 × 52 px, sem borda duplicada e sem encolher no mobile.
- Preservados elevação, brilho e seis faíscas, entrada única quando visível e repetição por mouse, teclado ou toque. Animação finita, interrompida ao sair da tela/ocultar a aba e desativada com movimento reduzido.
- `animejs` 4.5.0 movido para dependências de produção; GSAP e as comparações continuam fora do bundle público. Galeria local adaptada para ocultar o troféu padrão ao comparar alternativas.
- Build e TypeScript aprovados: JS `index-yLGb614V.js` 452,41 kB (gzip 151,51 kB); CSS `index-CwE8OraE.css` 67,25 kB (gzip 14,65 kB). Incremento da integração C: 16,80 kB gzip de JavaScript sobre a integração local das fotos A. Nenhum asset de imagem alterado.
- 67 testes de Analytics aprovados em quatro arquivos. Revisão independente do lifecycle e da integração sem bloqueios.
- QA do build local em 1440, 390 e 320 px: um troféu, uma cena das fotos A, dois links de currículo, sem overflow horizontal ou controles aninhados. Hover, teclado, toque emulado e movimento reduzido aprovados; sem teste em aparelho físico.
- Quatro downloads reais (hero/contato, desktop/mobile), com feedback solicitado e dimensões estáveis. PDF idêntico ao original: SHA-256 `F2D85743D548B95BD372B41247AF6A39C2637BDD3CBA7DEC257CC412F7EA0591`.
- Zero erros de página e zero requests ao Google/monitor de disponibilidade nos cenários locais sem consentimento observados. Fotos A carregadas e interativas, desenho de Leonardo preservado. Comparações A/B/C exibem apenas um troféu por vez.

Evidências da preparação em `C:/Users/Guiler/Desktop/wks/guiler/output/playwright/motion-local-qa-result.json`, script `portfolio-motion-release-qa.js` e capturas `motion-*`. Os registros anteriores deste documento descrevem a fase somente local, antes da escolha e da autorização de publicação.
