# Referências de componentes — personalidade do portfólio Guiler

Pesquisa em 20/10/2026. Somente leitura de código e fontes; nenhum pacote instalado, componente implementado, commit, push ou deploy.

**Recomendação:** preservar a linguagem clara de papel, azul e desenho técnico do portfólio. Usar um detalhe SVG de órbita/arco de quadra, o `Reveal` existente e uma resposta discreta do CTA. Caso se escolha o motivo de meteoros, construir poucos rastros com CSS, como alternativa ao movimento do fundo principal. Não sobrepor uma chuva de partículas ao Blueprint/campo já existente.

## O nome que corresponde à lembrança

- **Fato:** existe **Meteors / Meteor Effect** na [Aceternity](https://ui.aceternity.com/components/meteors) e **Meteors** na [Magic UI](https://magicui.design/docs/components/meteors).
- **Fato:** não encontrei arquivos/componentes chamados `Meteors`, `MeteorShower` ou `ShootingStars` na árvore pública de React Bits examinada, no commit [`e12c22192ac7b4b452c5e2feb9b586d74765d696`](https://github.com/DavidHDev/react-bits/tree/e12c22192ac7b4b452c5e2feb9b586d74765d696). Isso não identifica qual demo o usuário viu anteriormente.
- **Inferência:** se a lembrança é de luzes caindo em profundidade dentro do React Bits, **[Lightfall](https://reactbits.dev/backgrounds/lightfall)** é o candidato mais próximo. Se eram riscos diagonais sobre um fundo simples, **Meteors** corresponde melhor. Não apresentar essa inferência como identificação confirmada.
- **Distinção:** [Threads](https://reactbits.dev/backgrounds/threads) são fios fluidos; [Galaxy](https://reactbits.dev/backgrounds/galaxy) é outro fundo espacial. Não são nomes alternativos de Meteors. Os sources atuais de ambos usam WebGL2 nativo, não a dependência OGL frequentemente citada em versões antigas: [Threads TS](https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/src/ts-default/Backgrounds/Threads/Threads.tsx), [Galaxy TS](https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/src/ts-default/Backgrounds/Galaxy/Galaxy.tsx).

## Base local conferida

O alvo prioritário passou a ser `portfolio/`, não `linkhub/output/analytics-linkhub/`.

- `portfolio/package.json`: React `^18.3.1`, Vite `^6.4.1`, TypeScript `^5.9.3`, Motion `^12.23.24`. Não há Tailwind, GSAP ou Three nas dependências declaradas.
- `src/components/Interactions.tsx`: já existem `Reveal`, `Magnetic` e `TiltedPortrait`. `Reveal` é composição própria de Motion; os outros dois já documentam adaptação de React Bits em `THIRD-PARTY-NOTICES.txt`.
- `src/main.tsx` já aplica `MotionConfig reducedMotion="user"`. Os componentes de interação também usam `useReducedMotion` e distinguem ponteiro fino.
- `.button::before` em `src/styles.css` já faz uma passagem de preenchimento no hover. Adicionar outro efeito de borda criaria dois sinais concorrentes no mesmo CTA.
- O checkout lido em `portfolio/` ainda chama o fundo de `MagneticField`, não `BlueprintBackground`. Ele usa Canvas 2D, limita DPR a 1,5, só mantém frames enquanto os pontos precisam se mover, reage a alterações de reduced motion e pausa fora de visão/aba oculta. A versão Blueprint informada na conversa deve ser conferida na worktree de implementação. Esta pesquisa não presume que os dois arquivos sejam iguais.

**Limite da medição:** os tamanhos abaixo são bytes UTF-8 do arquivo TSX upstream, sem minificação. Não são peso de bundle, transferência gzip, GPU time ou benchmark mobile. Nenhuma performance foi medida em dispositivo.

## Seleção de até cinco referências/receitas

### 1. Meteors — referência para um hero com rastros esparsos

**Escolha:** receita CSS própria, usando **Magic UI Meteors** como referência principal e Aceternity para comparação visual.

**Fontes:** [demo Magic UI](https://magicui.design/docs/components/meteors), [TSX no commit auditado](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/apps/www/registry/magicui/meteors.tsx), [registry com keyframes](https://magicui.design/r/meteors.json), [licença MIT](https://github.com/magicuidesign/magicui/blob/efe76fc5755eca1142dd4f74c1d6f0ace2887e3c/LICENSE.md).

**Fatos do source:** usa React, elementos DOM, keyframes CSS, classes Tailwind e o helper `cn`; não importa uma engine de animação. Distribui a posição inicial com `window.innerWidth`; para um hero contido, essa referência à viewport precisa ser adaptada. Não contém tratamento próprio de reduced motion ou de visibilidade. A MIT exige preservar o aviso ao copiar partes substanciais.

**Comparação:** o [registry oficial Aceternity](https://ui.aceternity.com/registry/meteors.json) usa um wrapper de Motion, classes Tailwind e posições numa faixa fixa de 800px. Os meteoros continuam sendo CSS. A [referência oficial de licença](https://ui.aceternity.com/llms-full.txt) permite uso pessoal/comercial sem pagamento e restringe redistribuição como biblioteca concorrente; o [texto completo](https://ui.aceternity.com/licence) é uma licença própria. Não rotular Aceternity como MIT por associação com fontes de terceiros.

**Custo e complexidade:** gratuito; baixo custo de implementação na receita local, sem nova dependência. Copiar o exemplo literalmente exigiria Tailwind/`cn` ou tradução de classes.

**Receita proposta, não implementada:** camada decorativa absoluta, `aria-hidden`, `pointer-events:none`, recortada no hero. Quatro rastros no desktop e no máximo dois no mobile, posições/delays determinísticos em porcentagem do próprio hero, azul de baixa opacidade, cauda curta. Animar só `transform` e `opacity`, com intervalos longos; não criar estrelas, brilho difuso ou campo noturno. Limitar a ocorrência a uma pequena região livre de texto.

**Mobile/reduced motion:** no modo reduzido, não renderizar o movimento e manter apenas o desenho estático. Se houver repetição, pausar ao sair da viewport e ao ocultar a aba. Esses controles são adaptações necessárias; não vêm garantidos pelos exemplos.

### 2. Lightfall — identificação possível do React Bits, não recomendado para esta integração

**Fontes:** [demo](https://reactbits.dev/backgrounds/lightfall), [TSX auditado](https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/src/ts-default/Backgrounds/Lightfall/Lightfall.tsx), [CSS](https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/src/ts-default/Backgrounds/Lightfall/Lightfall.css).

**Fatos:** source TSX de 825 linhas / 28.245 bytes; importa React e CSS, mas cria renderer WebGL2 nativo. Com bloom ligado, há quatro níveis e múltiplas passagens de renderização. Possui `paused`, `dpr`, `lightMode`, `mouseInteraction` e `holdToWarp`; inclui redução de movimento, pausa por visibilidade, limite de DPR a 2 e recuperação de contexto.

**Custo/licença:** gratuito sob [MIT + Commons Clause do React Bits](https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/LICENSE.md). Uso no site é permitido; preservar o aviso se adaptado. Não é MIT simples.

**Decisão/inferência:** o túnel de luz disputaria atenção com o retrato e o Blueprint. Complexidade e custo gráfico são desproporcionais ao detalhe pretendido, embora não adicione pacote gráfico externo.

**Se virar direção visual deliberada futuramente:** usar como único fundo, com `lightMode`, `dpr={1}`, bloom desativado, mouse/warp desligados e fallback estático quando WebGL2 não existir. Testar em celular antes de publicar. Esse é um plano de adaptação, não uma promessa de performance.

### 3. CTA discreto — aproveitar o botão atual; Star Border apenas como referência rejeitada

**Referência:** [Star Border](https://reactbits.dev/animations/star-border), [TSX auditado](https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/src/ts-default/Animations/StarBorder/StarBorder.tsx), [CSS](https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/src/ts-default/Animations/StarBorder/StarBorder.css).

**Fatos:** a versão atual não é a antiga receita simples de dois gradientes CSS. Tem Canvas 2D, trajetórias no contorno, frames, partículas opcionais e 646 linhas / 22.699 bytes de TSX. Não importa engine externa. Checa reduced motion na montagem e visibilidade, mas o pulso de clique não é impedido pelo mesmo teste; não assumir que a opção do sistema elimina toda a animação.

**Licença/custo:** gratuito, [MIT + Commons Clause](https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/LICENSE.md). Complexidade média para um retorno visual pequeno neste CTA.

**Escolha:** ajustar a receita já presente. Uma única resposta de 180–250ms no preenchimento e deslocamento de até 2px da seta. Manter o botão magnético existente somente em ponteiro fino, sem adicionar estrela orbitando. Incluir o mesmo acabamento em `:focus-visible` sem remover o outline. No toque, estado pressionado imediato; em reduced motion, alteração de cor estática. Nenhum pacote e nenhuma cópia de Star Border seriam necessários.

### 4. Texto/transição — Reveal existente; Fade Content como comparação

**Referência:** [Fade Content](https://reactbits.dev/animations/fade-content), [TSX auditado](https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/src/ts-default/Animations/FadeContent/FadeContent.tsx).

**Fatos:** a versão atual importa `gsap` e `gsap/ScrollTrigger`, tem 416 linhas / 13.726 bytes e efeitos além de fade simples. Detecta reduced motion e retorna sem criar a animação nesse caso. Licença [MIT + Commons Clause](https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/LICENSE.md), sem cobrança pelo componente.

**Escolha:** não importar Fade Content nem GSAP. O `Reveal` original do portfólio já faz entrada uma vez, com Motion disponível. Reduzir eventual distância de 24px para algo como 8–12px e duração para 350–450ms é suficiente, sujeito à revisão visual. Não separar cada letra do título, usar scramble ou loop de palavras para comunicar uma mensagem fixa.

**Mobile/reduced motion:** conteúdo permanece inteiro e legível; nada depende de hover. Usar o `useReducedMotion` já presente para entrada imediata. A [documentação oficial](https://motion.dev/docs/react-use-reduced-motion) confirma atualização reativa da preferência. `MotionConfig` sozinho não cancela todas as animações: [transform/layout são desativados, enquanto opacity/backgroundColor podem continuar](https://motion.dev/docs/react-motion-config).

### 5. Órbita / arco de quadra — SVG original ligado à identidade

**Escolha:** desenho vetorial próprio. Um arco aberto que sugere ao mesmo tempo trajetória orbital e linha de uma quadra, acrescido de um pequeno ponto. É um detalhe do retrato ou da assinatura visual, não um novo fundo de página.

**Base técnica primária:** [comandos de arco elíptico SVG — W3C](https://www.w3.org/TR/SVG2/paths.html#PathDataEllipticalArcCommands), [stroke-dasharray — MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-dasharray). O SVG permite esse desenho com um ou dois `path`; não exige uma biblioteca de órbitas.

**Receita proposta:** `viewBox` fixo, traço de 1–1,5px em azul, `fill:none`, arco assimétrico cortado na borda do retrato. Criar geometria própria de aproximadamente três quartos de círculo com uma linha de quadra curta; evitar importar proporções esportivas como se fosse diagrama regulamentar. O círculo fechado pode ficar como marca pequena. Começar estático; se a composição pedir movimento, uma única aparição do traço junto ao `Reveal` existente, nunca rotação infinita.

**Custo/licença:** sem dependências, sem ativo de terceiro copiado e sem licença adicional de componente. Baixa complexidade. Documentação serve à técnica, não é material a copiar para o produto.

**Mobile/reduced motion:** usar versão menor com o mesmo arco, sem aumentar a largura de layout. `aria-hidden` se decorativo; `focusable="false"` e `pointer-events:none`. No modo reduzido, mostrar o caminho completo desde o primeiro frame.

## Direção de integração

1. Conferir a worktree ativa e o Blueprint real antes de editar. Esta pesquisa leu `portfolio/`, cujo fundo ainda tem outro nome.
2. Priorizar arco SVG + ajuste do CTA + `Reveal` existente. Essas três decisões podem ser entregues sem novas dependências.
3. Se o usuário quiser concretamente meteoros, apresentar/implementar uma variante CSS localizada como alternativa ao movimento do fundo. Não transportar o `SignalField` do linkhub.
4. Usar apenas uma fonte de movimento recorrente no hero. Reservar o azul mais forte para título, CTA e marca; o detalhe decorativo fica em intensidade secundária.
5. Na validação futura: verificar 360px/390px e desktop, teclado, preferência reduzida ao vivo, rolagem e ausência de mudança de layout. Se houver canvas/shader, também medir idle, aba oculta e GPU/mobile; esta pesquisa não substitui essa medição.

## Alternativas consultadas sem ampliar a seleção

[UIverse](https://github.com/uiverse-io/galaxy/blob/main/README.md) publica seus elementos sob MIT e pode fornecer referências CSS, mas não é necessário substituir o CTA existente por mais uma linguagem visual. O levantamento de 21st não forneceu vantagem sobre as fontes diretas para estes quatro usos; nenhum componente de marketplace foi selecionado nem sua licença presumida. A seleção fica restrita às cinco entradas acima.

## Observações de licença para eventual implementação

O arquivo local `THIRD-PARTY-NOTICES.txt` já documenta React Bits. Se novo source dessa biblioteca for copiado, registrar o URL/commit e o aviso correspondente à versão realmente incorporada. A licença atual do upstream contém cláusulas adicionais sobre ferramentas/exports que não aparecem no aviso local de 06/10; isso só exige revisão se source novo for incorporado, não autoriza atribuir automaticamente termos novos a cópias antigas.

Os rótulos **fato** descrevem o código/documentação observados. Quantidades, tempos, opacidades e escolhas de composição nas **receitas** são propostas de design e engenharia, ainda não testadas.
