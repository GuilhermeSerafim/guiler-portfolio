# Estudo local — globo, conexões e engenharia

## Escopo

Guiler rejeitou a abertura circular da fotografia e pediu uma leitura mais cuidadosa de todas as transições da AISight, mantendo o foco atual no globo. Este documento registra a pesquisa e a direção implementada para comparação local em 23/10/2026. Substitui a direção visual da tentativa anterior, documentada em `2026-10-23-artistic-scroll-journey.md`; os resultados de QA daquela tentativa não validam esta revisão.

O estudo está no worktree `output/portfolio-variants/entry-flow`. As rotas `/__preview/globe-story` e `/__preview/scroll-journey` são condicionadas a `import.meta.env.DEV` em `src/main.tsx`. Não é integração em produção. Não há fotografia ou máscara circular nesta cena. A montagem de foguete permanece adiada para outra etapa, após as referências que Guiler pretende enviar.

## Pesquisa da AISight

Foi inspecionada a [página inteira da AISight](https://www.aisight.com.br/) em Chromium desktop 1440 × 900, numa sessão separada: hero em 11 frações, seções intermediárias, dois palcos de scroll, quatro dashboards, câmera, FAQ e CTA final. Foram exercitados retorno do scroll, hover, indicadores e teclado, sem envio de formulário.

| Observação no navegador | Detalhe conferido no código público |
| --- | --- |
| Globo gira parado; a aproximação desloca o foco e conecta globo, cidade e loja por sobreposição. | Giro temporal de aproximadamente 9°/s; palco de 460vh com sticky de 100vh; escalas com zoom exponencial e intervalos sobrepostos. |
| Loja inclina; trajetórias cinza dão lugar a laranja, calor acende e três métricas aparecem em sequência. | Perspectiva de 1300px, rotação Y de −10° a +10°; calor e rotas são camadas independentes; chips com atrasos de 80/240/400ms. |
| Fotos reais dissolvem no mesmo retângulo; logos percorrem uma faixa. | Fotos trocam a cada 4,6s com dissolvência de 1,15s; faixa contínua de 38s. |
| Números contam e colunas variam a altura relativa; manifesto escurece palavras novamente ao subir. | Contagem de 1,5s, executada uma vez; parallax por coluna; opacidade de palavras vinculada à posição no viewport. |
| “Como funciona” revela três etapas; OnSight→InSight reorganiza pontos de uma planta em rede radial, junto do texto e do trilho. | Dois palcos de 240vh; progresso deriva do scroll, permitindo reversão. Não são efeitos acionados apenas na primeira entrada. |
| Dashboards formam leque; a seleção sobe e vem à frente. Hover pausa, saída retoma e setas funcionam. | Quatro screenshots, rotação Z e escala ativa de 1,06; autoplay de 4,2s. Não são gráficos ao vivo nem perspectiva 3D. |
| Perto do fim, a cabeça de uma câmera wireframe gira enquanto o suporte permanece fixo; há movimento leve mesmo parada. | Dois paths SVG separam base e parte móvel; giro segue scroll e pequena oscilação temporal produz a respiração. |
| FAQ expande; CTA final tem grade que se curva perto do ponteiro; botão troca preenchimento, texto e seta. | FAQ em grid de 0fr→1fr; CTA usa Canvas 2D, alcance de 190px e atração de 26px. O código também prevê onda radial no clique; essa onda não foi exercitada no navegador. |

Fontes de implementação: [JavaScript da página](https://www.aisight.com.br/_next/static/chunks/app/page-02b9b46323616e9f.js), [utilitários de movimento](https://www.aisight.com.br/_next/static/chunks/7125-0b45d880bb3b2a71.js) e [CSS](https://www.aisight.com.br/_next/static/css/a4638646df448a36.css). Os hashes identificam a versão consultada e podem mudar.

A principal conclusão é a continuidade: ponto focal, câmera, traços e informação mudam juntos. Apenas ampliar um círculo e revelar uma foto não reproduz esse mecanismo. Não foram incorporados assets, marca ou implementação da AISight.

Evidências locais, fora deste worktree: `output/research/aisight-deep-audit/whole-page/README.md`, `inventory.json`, `sweep.json`, `interactions.json`, `additional.json` e capturas. Pares úteis: `section-5-p30.png`/`section-5-p100.png`, `camera-top-520-1.png`/`camera-top-100-3.png`, `cta-final.png`/`cta-hover.png`. A auditoria não mede FPS nem substitui teste em aparelho móvel.

## Referências React Bits

| Referência oficial | Mecanismo relevante | Decisão neste estudo |
| --- | --- | --- |
| [Threads](https://reactbits.dev/backgrounds/threads) | Linhas que fluem, se deformam e respondem ao cursor. | Referência de continuidade dos traços. Os vértices do próprio globo se abrem em malha; não foi inserido um segundo background independente. |
| [Grid Scan](https://reactbits.dev/backgrounds/grid-scan) | Grade em perspectiva atravessada por varredura luminosa. | Referência de profundidade e sinal atravessando o campo. A varredura local é discreta e desenhada na malha existente. |
| [Orb](https://reactbits.dev/backgrounds/orb) | Anel luminoso com fluxo de cor e reação ao cursor. | Não selecionado: não resolve a transformação espacial e repetiria uma forma circular decorativa já rejeitada. |

A pesquisa de código consultou os registries oficiais [Threads](https://reactbits.dev/r/Threads-TS-CSS.json), [GridScan](https://reactbits.dev/r/GridScan-TS-CSS.json) e [Orb](https://reactbits.dev/r/Orb-TS-CSS.json). Na versão consultada, usam WebGL2 nativo e não declaram dependências npm. Isso não significa custo gráfico zero. GridScan mantém webcam desativada por padrão; webcam não faz parte deste trabalho.

Nenhum desses componentes foi instalado ou copiado. As referências orientam o vocabulário visual; a execução atual usa Canvas 2D, SVG e CSS próprios. Pesquisa detalhada no workspace pai: `output/research/aisight-deep-audit/reactbits.md`.

## Direção implementada

**Curiosidade → conexões → engenharia**, num palco de 3,6 alturas de viewport antes de `#sobre`, com scroll nativo:

1. Globo de meridianos e paralelos com rotação temporal perceptível. O ponto azul guia o olhar; aproximação altera posição e eixos.
2. A mesma topologia de 325 vértices se abre em plano. Rotas acendem, um sinal percorre conexões e uma varredura discreta atravessa a malha.
3. Desenho de sistema com interface, API, dados e IA entra em perspectiva. Dois resultados documentados aparecem em cards; o fundo continua em movimento leve.

| Arquivo | Responsabilidade |
| --- | --- |
| `src/preview/globe-story/GlobeField.tsx` | Projeção esfera→plano em Canvas 2D; malha, ponto focal, rota e varredura. DPR limitado a 1,5. |
| `src/preview/globe-story/SystemPlane.tsx` | Diagrama SVG original dos módulos e conexões. É esquema visual, não arquitetura literal de um case específico. |
| `src/preview/globe-story/GlobeStory.tsx` | Progresso do scroll, fases de texto, perspectiva, cards e controle de visibilidade. |
| `src/preview/globe-story/GlobeStory.css` | Composição, entradas, barras, responsividade e alternativa com movimento reduzido. |
| `src/preview/ScrollJourneyPreview.tsx` | Monta o App existente e insere a cena por portal antes de `#sobre`; abre a prévia diretamente no estudo e conserva link de comparação com A. |

O controller suaviza o progresso por delta de tempo e interrompe seu RAF ao convergir. O canvas mantém movimento temporal enquanto ativo. Ambos contêm guardas para visibilidade da seção e da aba. A implementação contém tratamentos para celular, paisagem e troca de `prefers-reduced-motion`. No modo reduzido, a cena vira conteúdo estático sem altura extra de sticky. Os resultados e limites da verificação estão abaixo.

A abertura direta da prévia revelou uma entrega do IntersectionObserver com dois registros, `[false, true]`, na mesma callback. Ler o primeiro mantinha toda a cena pausada. O controller agora usa a observação mais recente. A malha converge para um único passe ao virar plano, evitando alternância de espessura por uma classificação de profundidade que já não se aplica. O alvo da API usa a mesma âncora final do canvas (60% da largura, 50% da altura); a perspectiva gira em torno desse ponto.

## Métricas e limites da representação

Os destaques dos cards vêm de `projects` em `src/data.ts`:

- **Mesa de Negócios:** −52,4% no JavaScript de entrada, de 540,93 para 257,50kB, entre dois builds de 15/05/2026. Não representa redução de tempo de carregamento ou de todo o site.
- **SEVEN Tools:** duas chamadas passam a uma para carregar usuário e empresa no início da sessão autenticada. Não representa redução de todas as chamadas da aplicação.

Valor, rótulo e contexto usam `resultHighlight`. As legendas das duas barras da Mesa ainda repetem os números documentados como literais no componente; mantêm correspondência com `src/data.ts`. A proporção visual da barra posterior é 47,603% da anterior. O fluxo de pontos de SEVEN é ilustração do resultado, não telemetria ao vivo. Nenhuma nova métrica foi criada para decorar o estudo.

## QA desta revisão — 23/10/2026

Prévia: `http://127.0.0.1:5219/__preview/globe-story`. A rota anterior `/__preview/scroll-journey` mostra esta mesma revisão. A comparação A permanece em `/__preview/scroll-expand/a`.

| Verificação | Resultado |
| --- | --- |
| `npm run build` (TypeScript + Vite) | Passou. Artefatos principais continuam `index-BnmMZcOv.js` e `index-30s1P9BW.css`; busca na distribuição não encontrou a nova cena. |
| Chromium 1440×900, 768×1024, 390×844 e 844×390 | Passaram. Mobile/paisagem com emulação de toque e DPR 2; não é aparelho físico. |
| Scroll 0 → 32% → 58% → 78% → 98% → 0 | Canvas muda de fase, cards entram e saem, rotas completam, texto final aparece e o estado inicial retorna nos quatro tamanhos. |
| Movimento temporal | Hash dos pixels muda entre amostras sem scroll, sem screenshot entre elas. Não é medição de FPS. |
| Fora do viewport e retorno | Canvas fica inativo e os pixels param de mudar; ao retornar, movimento volta nos quatro tamanhos. |
| Abertura direta / autojump | Cena ativa em três reloads consecutivos, além dos quatro contextos do teste principal. |
| Movimento reduzido dinâmico | Canvas removido, sticky substituído por fluxo, cards visíveis; volta ao movimento ao restaurar a preferência. |
| Geometria | Sem overflow horizontal; palco ocupa o viewport. Revisão visual corrigiu globo sobre o título no tablet e aumentou contexto dos cards mobile para 11px. |
| Conteúdo e isolamento | Valores/contextos conferidos em `src/data.ts`; zero fotos/vídeos na nova cena. App, dados, links de projetos e Analytics não foram editados. |
| Navegação de comparação | Link A abre a rota da fotografia existente. `#projetos` permanece presente. Não foi reexecutada toda a suíte funcional do portfólio. |
| Console / rede | Zero erros JavaScript e zero requests Google nos quatro contextos locais limpos. Isso não é nova validação do Analytics de produção. |

Evidências no workspace pai: `output/playwright/globe-story-qa.js`, `globe-story-qa.json` (`pass: true`), `globe-story-final.json` e capturas `globe-story-{desktop,tablet,mobile,landscape}-{start,end,reduced}.png`. Capturas intermediárias: `globe-story-desktop-{0,16,32,45,60,74,96}.png`; foram feitas antes dos últimos ajustes de âncora e legibilidade, e as capturas nomeadas por dispositivo registram o estado final.

**Limite específico:** trazer uma segunda aba à frente não mudou `document.hidden` neste Chromium automatizado. Assim, a pausa por aba oculta foi conferida no código, mas não validada em condição real; o relatório complementar registra `hidden: false`, sem tratá-lo como teste aprovado. A pausa fora da seção foi efetivamente exercitada.

A revisão visual pelo Guiler permanece pendente. O estudo está apenas local; sem push ou deploy. Não há afirmação de performance medida nem equivalência com Safari/iOS físico.
