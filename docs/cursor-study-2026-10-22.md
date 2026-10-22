# Cursores — pesquisa e comparação local

## Escopo

O usuário autorizou publicar o catálogo C e, depois, estudar o cursor com inspiração em https://tamalsen.dev/. Catálogo publicado no commit `e4e7e9f`. Os cursores abaixo são protótipos locais para escolha, sem push/deploy. Base React 18, Motion 12, Vite 6; nenhuma dependência nova.

## Pesquisa

A pesquisa foi dividida entre observação do portfólio de Tamal Sen e inspeção das bibliotecas. Outro agente revisou alvos reais e riscos de interação do portfólio.

| Referência primária | O que foi observado / decisão |
| --- | --- |
| [Tamal Sen](https://tamalsen.dev/) — [CSS observado](https://tamalsen.dev/wp-content/cache/autoptimize/css/autoptimize_a2b5b0bceca20a9b48507ecc5327809f.css) e [handleCustomCursor](https://tamalsen.dev/wp-content/cache/autoptimize/js/autoptimize_single_017f47d886bd4622d54ed9588d2e0d58.js) | Cursor nativo preservado, ponto ciano 6 px, aro 30 px com borda 1 px/50% e atraso CSS de 80 ms. Links aumentam o ponto; projetos têm aro branco 46 px e sinal de mais. Sem mix-blend. Capturas e medições em `output/playwright/tamal-cursor-research.md` no workspace raiz. A usa essa linguagem adaptada à marca Guiler. |
| [Magic UI Smooth Cursor](https://magicui.design/docs/components/smooth-cursor) / [registry](https://magicui.design/r/smooth-cursor.json) | Seguidor com spring/rotação. Referência de acompanhamento; dispensamos rotação e preservamos o cursor nativo para fallback. [MIT](https://github.com/magicuidesign/magicui/blob/main/LICENSE.md). |
| [React Bits Target Cursor](https://reactbits.dev/animations/target-cursor) / [código](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Animations/TargetCursor/TargetCursor.tsx) | Quatro cantos ao redor de alvos. Inspira C, com expansão modesta, sem rotação contínua nem retângulo gigante. Registry declara react-dom 19; não foi instalado no projeto React 18. [MIT + Commons Clause](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md). |
| [Aceternity Following Pointer](https://ui.aceternity.com/components/following-pointer) / [registry](https://ui.aceternity.com/registry/following-pointer.json) | Cursor com etiqueta contextual. Inspira B apenas em acionadores reais de projeto, sem texto decorativo por toda a página. [Licença própria](https://ui.aceternity.com/licence). |
| [React Bits Magnet](https://reactbits.dev/animations/magnet) | Já há Magnetic nos CTAs do portfólio. Não acrescentar outro deslocamento nesses controles. |

Não copiamos código dessas bibliotecas nem instalamos seus pacotes. Implementação própria com React e CSS. Cursores fluidos/partículas foram descartados por custo e excesso visual. Na referência Tamal, a emulação de toque em viewport larga e movimento reduzido manteve o efeito; as propostas locais usam capacidade real do ponteiro e respeitam ambas as condições.

## Propostas

| Opção | URL | Comportamento |
| --- | --- | --- |
| A — Órbita editorial | http://127.0.0.1:5195/__preview/cursor/a | Ponto e aro fino com pequeno atraso; sinal de mais nas capas. Mais próxima de Tamal, nas cores do portfólio. |
| B — Contextual | http://127.0.0.1:5195/__preview/cursor/b | Apenas uma etiqueta Ver projeto junto ao mouse sobre capa, título e seta que abrem o case. |
| C — Mira técnica | http://127.0.0.1:5195/__preview/cursor/c | Quatro cantos discretos; expansão em controles, sem mover os controles nem rotacionar continuamente. |
| Atual | http://127.0.0.1:5195/ | Versão publicada, sem cursor experimental. |

Recomendação inicial: A para a personalidade desejada e proximidade com a referência; B caso a prioridade seja máxima discrição. A escolha depende da comparação real do usuário.

## Critérios de implementação e verificação

- Cursor nativo permanece disponível; decoração `aria-hidden` e `pointer-events:none`, sem novos focos.
- Ativação só com hover e ponteiro fino; desligar em toque e movimento reduzido, inclusive mudanças durante a sessão.
- Ocultar ao sair da janela, perder foco, usar Tab ou abrir qualquer diálogo nativo; nenhuma alteração nos handlers de clique/analytics existentes.
- Texto contextual somente nos alvos reais: `.project-cover`, `.project-title-row h3 button`, `.project-details`; nunca na descrição, tags, repositório ou filtro.
- Contraste em fundo claro, preto, azul e capas. Sem mudança global de blend/cursor.
- Movimento por refs/transformações, sem render React por pixel; cleanup de listeners/RAF em desmontagem e StrictMode.
- Importação do comparador condicionada a `import.meta.env.DEV` e às três rotas locais. Build de produção deve excluir esses arquivos.

## Resultado da validação local

- A/B/C em desktop: uma única decoração por documento, cursor nativo preservado, `pointer-events:none`, `aria-hidden`, nenhum novo foco. A/C no hero e controles; B somente em capa, título e seta do projeto, ausente em texto e repositório.
- Projetos abrem por clique e Enter; fechamento por Escape e botão funciona. Decoração suspensa nos diálogos de projeto e privacidade. Tab preserva outline e oculta o efeito.
- Movimento reduzido testado antes da carga e alternado durante a sessão: desativa o efeito imediatamente. Emulação touch em 390 e 1440 px: três propostas desativadas, cases abrem/fecham normalmente; sem overflow.
- Ajustes de contraste revisados e conferidos em navegação, botão de contato, capa escura SEVEN, painel claro da capa e seletor local ativo. B tem flip/clamp; retângulo medido junto à borda direita permaneceu dentro da viewport. Filtros não deixam a etiqueta presa em projeto removido.
- Rotas locais fora do comparador mantêm o site sem cursor experimental. Zero erros JavaScript e zero requests Google na sessão de estudo.
- Build TypeScript/Vite passou. Artefatos locais continuam `index-Bt-lHaH0.js` e `index-Ce8oQpr2.css`, iguais aos anteriores ao estudo; nenhum seletor/componente experimental no bundle de produção. TypeScript e diff verificados após o ajuste de contraste.
- Capturas desktop de hero/projetos/contato e mobile em `output/playwright/cursor-*.png` no workspace raiz; comparação visual inspecionada. Roteiros: `cursor-studies-qa.js` e `cursor-contrast-qa.js`.
- A primeira automação movia o mouse antes de terminar a rolagem/layout da página, acionando o bloqueio de scroll previsto. O roteiro foi ajustado para esperar estabilidade e mover novamente o mouse; a sequência completa passou. Nenhuma mudança no comportamento do produto para contornar esse teste.

Limites: testes Chromium automatizados e revisão visual, sem dispositivo físico ou leitor de tela. Não se afirma uma medição de FPS. Os efeitos continuam locais, aguardando escolha; nada deste estudo foi enviado a origin/main ou ao Vercel.
