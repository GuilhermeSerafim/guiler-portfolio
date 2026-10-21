# Entrada do portfólio — prévia local

Esta versão substitui a entrada genérica de fade dos grupos do hero por uma composição curta. O conteúdo permanece legível e os botões ficam acionáveis desde o primeiro frame. Não existe splash, contador, espera por imagem/fonte, bloqueio de scroll ou nova dependência.

A referência de hierarquia temporal é [Jhey](https://www.jhey.dev/): conteúdo disponível enquanto um detalhe autoral se desenha. A referência fotográfica é [Mask Entry de Olivier Larose](https://blog.olivierlarose.com/demos/mask-entry). A implementação e o traço orbital são originais; nenhum código ou ativo dessas páginas foi copiado.

## Composição

- Duas linhas do H1 assentam de 10 px para zero em 680 ms, com intervalo de 65 ms; opacidade sempre 1. Em telas até 700 px, deslocamento de 6 px e duração de 550 ms.
- Texto introdutório assenta 6 px em 650 ms, iniciando após 90 ms. CTAs e informação de reconhecimento não se movem.
- Retrato abre de um trapézio discreto para seu retângulo final, preservando enquadramento e proporções. Duração de 820 ms no desktop e 700 ms em telas menores. Pequena escala 1.035 → 1 com origem no topo, sem deslocar o recorte final aprovado.
- Traço orbital azul conduz à fotografia em 1050 ms. A seta conclui em 800 ms. O traço é decorativo, ignorado por leitores de tela e eventos de ponteiro.
- No mobile, o traço reduz para 64 px e fica junto à margem da foto, abaixo da etiqueta, para não atravessar o texto.
- Ajuste solicitado após revisão: deslocamento adicional à esquerda de 52 px no desktop, 57 px no tablet e 8 px no mobile. As posições finais são -164, -132 e -32 px, respectivamente. O traço não cruza a etiqueta “UM BUILDER, DE PONTA A PONTA.”.
- Sublinhado existente termina em 680 ms. Após revisão do usuário, meteoros e estrelas foram retirados do hero e movidos para a área azul do rodapé. A entrada do hero já não controla esse efeito.

## Meteoros no rodapé

A única instância de `MeteorField` fica dentro de `.site-footer`, posicionada sobre a área azul `.contact-section`. O contexto isolado mantém os rastros atrás do conteúdo e acima do fundo, sem bloquear cliques ou alterar os controles fixos de privacidade. Tons claros substituem o azul dos rastros para contraste; a máscara suaviza as bordas da área final.

A animação permanece pausada até a área azul entrar na tela, para não ser consumida enquanto o visitante está no início. São três passagens finitas em 4,3 segundos de atividade no desktop, duas no mobile, sem loop. Movimento reduzido oculta os rastros. A impressão omite o campo decorativo.

## Ciclo de vida

`useHeroEntry` só habilita movimento na raiz `/`, sem hash, fora de navegação `back_forward`, e com preferência de movimento normal. Nenhum efeito aguarda recursos de rede.

Mudança para movimento reduzido, navegação por hash, histórico e `pagehide` finalizam os efeitos. `pageshow` persistido mantém a composição final, para que retorno pelo cache de navegação não reproduza a entrada. A regra CSS de movimento reduzido também garante o estado final imediatamente, sem depender da entrega do evento React.

O atributo de inspeção é `#inicio[data-entry="animate"]` ou `#inicio[data-entry="static"]`. `animate` indica elegibilidade da entrada, não atividade contínua: animações CSS são finitas.

## Escopo preservado

Fotos, textos, identidade existente, projetos, notebook, navegação, URLs, consentimento e Analytics não foram alterados. O componente `Reveal` continua igual para outras seções; apenas os grupos do hero passam a usar wrappers comuns. O campo de meteoros mudou para o rodapé, preservando as dimensões do conteúdo.

## Validação

Build local com TypeScript e Vite. Revisão de diffs sem mudanças de dependências. QA Chromium local concluído pela sessão principal em 20/10/2026:

- H1 legível e CTA acionável com animações no instante zero; abertura não bloqueia o clique em Projetos.
- Larguras 320, 390, 768 e 1440 px sem overflow horizontal. Captura final mobile confirma traço afastado da etiqueta.
- Rechecagem do deslocamento em 320, 390, 768, 1024 e 1440 px: nenhum caminho SVG sobrepõe a etiqueta e não há overflow horizontal. Capturas em `output/playwright/entry-stroke-left-{390,768,1440}.png` na raiz do workspace.
- Clique e acesso direto a `#projetos` chegam ao alvo sem entrada; quatro indicadores de disponibilidade preservados.
- Movimento reduzido dinâmico encerra efeitos; desativá-lo não reinicia a entrada. Retorno pelo histórico também mostra estado final.
- Falha simulada do retrato não impede a navegação. Nenhum erro JavaScript ou request Google observado no ambiente local.
- Mudança dos meteoros: build passou; QA local em 320/390/1440 px confirmou ausência do efeito no hero, pausa antes do rodapé, ativação ao chegar, limites do campo restritos à área azul, movimento reduzido, retorno ao topo e ausência de overflow/erros JS. Capturas `output/playwright/footer-meteors-{390,1440}.png` e script `footer-meteors-qa.js` na raiz do workspace. As capturas pausam a animação em um instante visível para inspeção.

Evidências na raiz do workspace: `docs/entry-transitions-local-qa-2026-10-20.md` e `output/playwright/entry-portfolio-*.js/png`. Testes em navegador local, sem alegação de dispositivo físico ou navegador interno do Instagram. Prévia: http://127.0.0.1:5195/.

Esta etapa é local. Nenhum push, merge ou deploy autorizado por este documento.
