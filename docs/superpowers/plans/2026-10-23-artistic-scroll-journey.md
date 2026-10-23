# Estudo local — da órbita à construção

## Pedido e escopo

Guiler escolheu a opção A do Scroll Expand em tela inteira e pediu uma transição artística inspirada no fundo que aproxima um planeta e chega a um local em aisight.com.br. Esta é uma nova prévia local para comparação; a opção A continua intacta. Não há publicação autorizada deste experimento.

Skills aplicadas: `superpowers:brainstorming` (protótipo exploratório já solicitado), `frontend-design` (direção visual) e `playwright` (observação da referência e QA local).

## O que foi observado na referência

Na [Sight](https://www.aisight.com.br/), globo, ruas e planta de loja se sobrepõem, ampliam e dissolvem em um palco sticky de 100vh. O roteiro ocupa 460vh no desktop. O hero observado não contém vídeo ou canvas: SVGs e um PNG compõem a sensação de câmera entrando no cenário. O ponto focal e os intervalos sobrepostos fazem a ligação entre cenas.

Fontes públicas inspecionadas:

- [JavaScript da página](https://www.aisight.com.br/_next/static/chunks/app/page-02b9b46323616e9f.js)
- [Desenho do globo](https://www.aisight.com.br/hero/globe-lite.svg)
- [Desenho da cidade](https://www.aisight.com.br/hero/city-lite.svg)
- [Imagem da loja](https://www.aisight.com.br/hero/store.png)

As fontes foram consultadas para entender o comportamento. Nenhuma imagem, marca, copy ou implementação da Sight foi incorporada ao portfólio.

## Direção testada

Uma sequência de 280vh antes de “Além do editor”, com três momentos:

1. **Explorar:** instrumento orbital original, traçado em SVG, com leve deriva e aproximação. “Curiosidade em movimento.”
2. **Experimentar:** as linhas curvas cedem lugar a um desenho técnico do notebook alinhado à foto. “Dar forma às ideias.”
3. **Construir:** abertura circular revela a foto real do Guiler, terminando em tela inteira. “Do lado de cá do código.”

A astronomia é um ponto de partida; a fotografia pessoal é o destino. Off-white, azul e fonte já usados no portfólio continuam presentes. O teste usa o fundo escuro apenas nessa passagem. A copy é uma proposta do agente, sujeita ao gosto do usuário.

Alternativas consideradas: apenas ampliar a fotografia (a opção A existente), vídeo renderizado ou cena 3D. O teste utiliza desenho e composição 2D para explorar a narrativa sem instalar dependências nem introduzir vídeo. Não se afirma que tenha a mesma sensação espacial de uma câmera 3D real.

## Implementação

- Rota DEV `/__preview/scroll-journey`; importação lazy removida do build de produção.
- SVG original com esfera projetada matematicamente, órbitas e desenho frontal do notebook. A fotografia existente é reutilizada sem retoque.
- Scroll nativo, sem impedir wheel/touch. `transform`, `opacity` e máscara circular controlados por progresso suavizado com delta de tempo.
- RAF termina ao convergir e pausa fora da seção ou com a aba oculta. O leve movimento do desenho também pausa fora de cena.
- Resolução da foto escolhida considerando o tamanho de `cover` em telas verticais. Foto termina alinhada pelo topo para preservar cabelo.
- Mobile, celular em paisagem e `prefers-reduced-motion`: fotografia estática, sem altura extra de sticky ou SVGs animados.
- Texto semântico resumido e alt da foto; desenhos e legendas cênicas decorativos.
- App, projetos, currículo, Analytics e desenhos existentes preservados. Nenhuma alteração na produção.

## Verificação e decisão seguinte

Evidências da referência: `output/research/aisight/README.md`, `observed.json` e capturas, no workspace pai.

Evidências locais: `output/playwright/scroll-journey-review.js`, capturas `journey-desktop-*`, `scroll-journey-qa.js/.json` e capturas `journey-qa-*`, no workspace pai. Os testes conferem fases, retorno ao começo, geometria em tela inteira, foto carregada, ausência de overflow, pausa fora da seção, fallback estático e troca dinâmica de preferência de movimento.

Resultado: cinco cenários em Chromium (1440×900, 768×1024, celular 390×844, celular paisagem 844×390 e movimento reduzido), sem erros de execução ou requisições Google na prévia. Build passou e manteve os hashes de produção anteriores (`index-BnmMZcOv.js` e `index-30s1P9BW.css`), confirmando que o experimento não entra na distribuição. A revisão independente sugeriu evitar medições fora da tela e pausar a órbita já invisível; ambos foram ajustados. Follow-up `scroll-journey-followup.js/.json` confirmou pausa e retorno, e TypeScript passou novamente.

Ainda é necessário Guiler comparar a passagem artística com A e decidir a direção. Integração permanente e publicação ficam para depois dessa escolha. Inspeção em Chromium local não equivale a teste de Safari/iOS físico nem a garantia de FPS ou pontuação PageSpeed.

## Revisão após feedback: movimento contínuo

Guiler relatou que o globo parecia parado e a foto estática interrompia a estética. A medição anterior confirmou que a geometria do SVG não mudava, a inclinação variava quase imperceptivelmente (7° em 32s) e a foto terminava com matriz identidade. No celular, a regra anterior removia toda a animação.

A nova revisão local substitui a esfera estática por geometria 3D reprojetada em Canvas 2D, com meridianos girando e pontos orbitais móveis. Sem WebGL ou dependências novas; buffers pré-calculados e DPR limitado a 1,5. A rotação continua sem rolagem enquanto a esfera está visível, pausa quando a foto assume a cena ou a aba fica oculta, e retoma do ângulo anterior.

Para o desfecho, a proposta atual mantém a foto com movimento contínuo de câmera (deslocamento lateral e aproximação discreta), tratamento de cor em CSS e linhas orbitais sutis que continuam a linguagem do início. Não foi gerado movimento facial nem alterado o arquivo original da fotografia. A escolha entre manter essa foto ou terminar apenas no desenho foi perguntada ao usuário; não há resposta registrada até esta revisão.

Mobile também recebe o movimento e um layout adaptado. Apenas `prefers-reduced-motion` mantém a versão estática. A versão A e o site publicado continuam preservados.

Evidências desta revisão no workspace pai: `journey-motion-before.js`, `journey-live-motion-qa.js/.json` e capturas `journey-live-*` em `output/playwright/`. A checagem de movimento compara pixels do canvas e transformações da câmera em intervalos sem rolagem; screenshots isolados não comprovam movimento.

Validação final da revisão: desktop 1440×900, mobile 390×844 e paisagem 844×390 confirmaram movimento do globo e da câmera sem rolagem, pausa do globo invisível, retomada ao voltar, ausência de bordas vazias/overflow e fallback ao alternar movimento reduzido. Nenhum erro de execução nesses contextos. A aba é explicitamente trazida para frente antes das medições para testar animação visível. Build passou, mantendo os hashes da distribuição anterior; TypeScript passou novamente após a instrumentação declarativa `data-active` do canvas.
