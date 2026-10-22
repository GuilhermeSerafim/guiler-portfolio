# Fotos em movimento — estudos locais

Pedido: repetir a comparação de animações do troféu para as duas fotos de `03 / ALÉM DO EDITOR`. Nenhuma alternativa escolhida para produção nesta etapa.

Branch local `preview/photo-studies`, baseada no estudo do troféu (`466d366`). Não houve push ou deploy.

| Opção | Biblioteca | Movimento | Local |
| --- | --- | --- | --- |
| A — Profundidade | Motion 12.43.0 | Inclinação e profundidade conforme o mouse; movimento breve por toque/replay | http://127.0.0.1:5195/__preview/photos/a |
| B — Revelação | GSAP 3.15.0 | Duas máscaras translúcidas se abrem com leve zoom; segunda foto defasada | http://127.0.0.1:5195/__preview/photos/b |
| C — Memórias | Anime.js 4.5.0 | Fotos se acomodam como impressões sobre uma mesa, com pequenos deslocamentos e rotações | http://127.0.0.1:5195/__preview/photos/c |

Comparação lado a lado: http://127.0.0.1:5195/__preview/photos.

## Implementação

- Fotos originais `building.webp` e `community.webp`, sem edição dos arquivos. Desenho de Leonardo da Vinci e texto da seção preservados.
- Página individual abre na seção, com barra local de comparação e botão Repetir. Também responde a mouse, teclado e toque.
- Mesmo markup nas três opções; animações isoladas por biblioteca. `usePhotoPlayback` compartilha entrada única em viewport, aguarda decodificação das fotos, respeita movimento reduzido e finaliza efeitos fora da tela/aba oculta.
- Rotas e módulos existem apenas em DEV. Portal substitui visualmente as duas figuras na prévia; `App.tsx` e os arquivos de produção não foram modificados.
- Nenhuma nova dependência: bibliotecas reutilizadas dos estudos do troféu.

## QA executado

- Build/TypeScript e checagem de whitespace aprovados.
- Três variantes em 1440, 390 e 320 px: sem overflow horizontal, ambas as fotos carregadas, sem elementos interativos aninhados. A posição inicial deixa o título da seção abaixo da barra local.
- Replay, hover e teclado ativam as três opções; todas retornam ao repouso. Movimento reduzido ativado durante a animação interrompe os efeitos e impede replays.
- Toque em contexto móvel emulado e preferência de movimento reduzido desde o carregamento aprovados nas três opções. Sem teste em aparelho físico.
- Zero erros de página e zero requests ao Google ou monitor de disponibilidade nos cenários locais observados.
- Rota `/` conserva as duas figuras originais. Galeria do troféu continua com três opções.
- Build de produção manteve `index-caWpwScZ.js` (396,74 kB; gzip 130,78 kB) e `index-B5XFJNSJ.css` (62,77 kB; gzip 13,73 kB), sem módulos destes estudos.

Evidências: `C:/Users/Guiler/Desktop/wks/guiler/output/playwright/photos-qa-result.json`, `photos-touch-qa-result.json`, scripts correspondentes e capturas `photos-*`.

## Referências técnicas

- [Motion: animação com mola](https://motion.dev/docs/react-use-spring)
- [GSAP: timelines](https://gsap.com/docs/v3/GSAP/Timeline/)
- [Anime.js: timelines](https://animejs.com/documentation/timeline/)
