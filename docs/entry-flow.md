# Entrada do portfólio — prévia local

Esta versão substitui a entrada genérica de fade dos grupos do hero por uma composição curta. O conteúdo permanece legível e os botões ficam acionáveis desde o primeiro frame. Não existe splash, contador, espera por imagem/fonte, bloqueio de scroll ou nova dependência.

A referência de hierarquia temporal é [Jhey](https://www.jhey.dev/): conteúdo disponível enquanto um detalhe autoral se desenha. A referência fotográfica é [Mask Entry de Olivier Larose](https://blog.olivierlarose.com/demos/mask-entry). A implementação e o traço orbital são originais; nenhum código ou ativo dessas páginas foi copiado.

## Composição

- Duas linhas do H1 assentam de 10 px para zero em 680 ms, com intervalo de 65 ms; opacidade sempre 1. Em telas até 700 px, deslocamento de 6 px e duração de 550 ms.
- Texto introdutório assenta 6 px em 650 ms, iniciando após 90 ms. CTAs e informação de reconhecimento não se movem.
- Retrato abre de um trapézio discreto para seu retângulo final, preservando enquadramento e proporções. Duração de 820 ms no desktop e 700 ms em telas menores. Pequena escala 1.035 → 1 com origem no topo, sem deslocar o recorte final aprovado.
- Traço orbital azul conduz à fotografia em 1050 ms. A seta conclui em 800 ms. O traço é decorativo, ignorado por leitores de tela e eventos de ponteiro.
- No mobile, o traço reduz para 64 px e fica junto à margem da foto, abaixo da etiqueta, para não atravessar o texto.
- Sublinhado existente termina em 680 ms. Meteoros existentes recebem deslocamento de 350 ms na cadência: a primeira passagem acompanha o final da montagem e a última termina em 4650 ms. A abertura completa permanece abaixo de cinco segundos; a cadência global do componente não muda.

## Ciclo de vida

`useHeroEntry` só habilita movimento na raiz `/`, sem hash, fora de navegação `back_forward`, e com preferência de movimento normal. Nenhum efeito aguarda recursos de rede.

Mudança para movimento reduzido, navegação por hash, histórico e `pagehide` finalizam os efeitos. `pageshow` persistido mantém a composição final, para que retorno pelo cache de navegação não reproduza a entrada. A regra CSS de movimento reduzido também garante o estado final imediatamente, sem depender da entrega do evento React.

O atributo de inspeção é `#inicio[data-entry="animate"]` ou `#inicio[data-entry="static"]`. `animate` indica elegibilidade da entrada, não atividade contínua: animações CSS são finitas.

## Escopo preservado

Layout, fotos, textos, identidade existente, projetos, notebook, navegação, URLs, consentimento e Analytics não foram alterados. O componente `Reveal` continua igual para outras seções; apenas os grupos do hero passam a usar wrappers comuns.

## Validação

Build local com TypeScript e Vite. Revisão de diffs sem mudanças de dependências. QA Chromium local concluído pela sessão principal em 20/10/2026:

- H1 legível e CTA acionável com animações no instante zero; abertura não bloqueia o clique em Projetos.
- Larguras 320, 390, 768 e 1440 px sem overflow horizontal. Captura final mobile confirma traço afastado da etiqueta.
- Clique e acesso direto a `#projetos` chegam ao alvo sem entrada; quatro indicadores de disponibilidade preservados.
- Movimento reduzido dinâmico encerra efeitos; desativá-lo não reinicia a entrada. Retorno pelo histórico também mostra estado final.
- Falha simulada do retrato não impede a navegação. Nenhum erro JavaScript ou request Google observado no ambiente local.

Evidências na raiz do workspace: `docs/entry-transitions-local-qa-2026-10-20.md` e `output/playwright/entry-portfolio-*.js/png`. Testes em navegador local, sem alegação de dispositivo físico ou navegador interno do Instagram. Prévia: http://127.0.0.1:5195/.

Esta etapa é local. Nenhum push, merge ou deploy autorizado por este documento.
