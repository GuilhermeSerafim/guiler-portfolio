# Fluidez dos traços do hero — comparação local

Data: 22/10/2026. Base: `b165369`. Escopo: portfólio `guiler`, sem publicação.

## Diagnóstico

O hero ativo usa SVG/CSS (`HeroEntry`), não o antigo canvas `MagneticField`.
A seta usava a mesma curva de desaceleração do título e retrato:
`cubic-bezier(.19, 1, .22, 1)` durante 1.050 ms. No navegador, 84,35% do
desenho já estava pronto em 25% do tempo; na metade, 97,78%. A longa cauda
quase imóvel explica a sensação de movimento interrompido.

A animação do sublinhado existe: `impact-draw` estava definido globalmente
em `TrajectoryMark.css`. A hipótese inicial de keyframes ausentes foi descartada
ao conferir o CSS completo e a animação real de produção. O sublinhado usava
dois segmentos em um único path normalizado, sem controle separado de tempo.

## Ajuste

- Seta: 900 ms com curva simétrica `cubic-bezier(.35, .1, .65, .9)`.
- Ponta: aparece de 820 a 1.000 ms, acompanhando a chegada do traço.
- Sublinhado: mesmos segmentos geométricos em paths separados; primeiro de
  180 a 620 ms, segundo de 580 a 880 ms, ambos com avanço linear.
- Fonte, cores, posição, desenho final, entrada do retrato/título e troféu preservados.
- Nenhuma dependência, chamada de rede, política de Analytics ou link alterado.

## Evidência

Seek determinístico da CSSAnimation real no Chromium:

| Fração do tempo | Seta anterior desenhada | Seta ajustada desenhada |
| --- | ---: | ---: |
| 25% | 84,35% | 17,93% |
| 50% | 97,78% | 50,00% |
| 75% | 99,83% | 82,07% |
| 100% | 100% | 100% |

O script de regressão foi executado antes da edição: falhavam os critérios de
distribuição do movimento e sequência independente do sublinhado. Depois,
os cinco critérios passaram. Artefatos no workspace pai:
`output/performance/portfolio-hero-motion/comparison-regression.json` e
`output/playwright/portfolio-stroke-regression.js`.

Reprodução após fontes e foto carregadas, em 1440, 390 e 320 px: mediana de
16,7 ms e p95 de 16,8 ms entre callbacks rAF, antes e depois. Isso mede a
cadência local de callbacks, não comprova FPS de apresentação em todos os
dispositivos nem elimina possíveis engasgos no carregamento inicial.
O ajuste corrige a distribuição temporal, sem reivindicar ganho de FPS.

QA visual: sem overflow, retrato carregado e altura do hero idêntica nas três
larguras. Traços completos no final; com movimento reduzido, zero animações
nos traços. Entrada por `#projetos` permanece estática e chega à seção.
Zero erros JavaScript e zero requests Google nos contextos locais sem consentimento.

`npm run build` passou; `node node_modules/vitest/vitest.mjs run --maxWorkers=1`
passou com 153 testes em seis arquivos. Revisão independente sem achados bloqueantes.

## Comparar

- Antes: http://127.0.0.1:5214/
- Ajustado: http://127.0.0.1:5215/

São servidores locais de build. Recarregar sem hash repete a entrada; movimento
reduzido mantém a apresentação estática. A publicação do portfólio depende da
aprovação desta comparação. A publicação já autorizada do hub foi concluída
separadamente no commit `c9b4707`.
