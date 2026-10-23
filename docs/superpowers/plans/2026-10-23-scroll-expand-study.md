# Scroll Expand — propostas e plano de adoção

**Goal:** avaliar localmente uma expansão de foto durante a rolagem, usando fotos reais do Guiler, e escolher a posição antes de integrar ao portfólio.
**Architecture:** spike isolado em rotas DEV, componente React/CSS adaptado do React Bits. O App publicado continua sendo a referência; nenhum experimento foi publicado.
**Tech Stack:** React 18, TypeScript, Vite, CSS, Playwright para inspeção. Nenhuma dependência nova.
**Spec:** pedido de 23/10/2026 para planejar com brainstorming e testar localmente o componente Scroll Expand com a foto horizontal no computador.

## Estado e autorização

Os ajustes anteriores foram publicados no commit `e6bbc90`, deployment `dpl_33mxepAvLjaQyDTGAoCQHNSP9bdR`, em `https://guiler.vercel.app`. A conferência pública confirmou HTTP 200, ajustes de UX, prêmio, alinhamento da relatividade e ID real do Analytics, sem requisições Google antes da escolha.

O usuário autorizou pesquisa e teste local e, depois de comparar, escolheu **A, com a foto ocupando a tela inteira**. Esta revisão continua local, sem autorização nova de publicação. O teste segue a etapa de protótipo exploratório da skill `superpowers:brainstorming`.

## Alternativas

| Opção | Antes → depois | Vantagem | Custo |
| --- | --- | --- | --- |
| A — Transição ampla | Trajetória passa diretamente a Além do editor → uma foto horizontal se amplia entre as seções | Apresentação pessoal mais expressiva, mantendo projetos e experiência antes do efeito | Acrescenta uma seção e mais rolagem; a página passa a mostrar três fotos pessoais |
| B — Foto integrada | Duas fotos inclinadas em Além do editor → foto no computador se amplia dentro da coluna | Mais discreta e compacta, próxima do texto pessoal | Substitui a foto de comunidade e reduz a variedade da seção; expansão menos evidente |

**Escolha do usuário: A, em tela inteira.** A recomendação inicial foi a transição ampla pela presença da foto; B permanece disponível apenas para comparação. A revisão remove o limite anterior de 720 px e o desconto da barra de estudo na altura do palco.

## Foto e tratamento

Selecionada para os dois estudos: `public/21.jpeg` no workspace pai, 6016×4016, Guiler sozinho diante do notebook e fundo azul-acinzentado. Não houve geração ou retoque de rosto/cenário. Foram produzidas versões WebP de 960, 1600 e 2200 px, com 23.028, 46.216 e 75.404 bytes.

Alternativas investigadas: `public/2.jpg` (já usada como building.webp, trabalho no evento) e `public/4.jpg` (headphone/mão no cabelo). A foto 21 evita repetir a imagem atual. Enquadramento do estudo: `object-position:60% 0%`, sem zoom adicional, abertura vertical inicial de 98% para preservar o cabelo.

## Funcionamento proposto

- Moldura amplia na rolagem natural da página, com máscara e cantos que suavizam. Sem scroll interno ou bloqueio de wheel/touch.
- A: começa em 74% da largura do palco, expande a toda a largura útil e altura da janela; sticky em 0 px; percurso de 0,65 altura do palco, seguido de 0,18 altura com a foto totalmente aberta; cantos 28→0 px. A toolbar do estudo permanece no início da página e sai naturalmente da tela ao rolar.
- B: começa em 88%, termina em 100%; percurso de 0,45 altura do palco; cantos 18→6 px.
- Suavização com delta de tempo real; RAF termina ao estabilizar e pausa com a aba oculta.
- Celular ≤700px, celular em paisagem com altura ≤500px e ponteiro coarse, ou preferência por movimento reduzido: foto estática, sem palco sticky nem espaço extra de animação. Em A, ocupa toda a largura e mantém a proporção original, sem cortar a foto para forçar altura de tela.
- Texto importante permanece fora da imagem. Projetos, links, currículo, Analytics e cinco desenhos pessoais são preservados.
- Imagem responsiva com lazy loading, dimensões intrínsecas e srcSet. Sem promessa de FPS ou PageSpeed a partir da inspeção de código.

## Plano

- [x] Investigar documentação e fonte oficial, dependências e comportamento acessível.
- [x] Conferir fotos reais e preparar uma imagem responsiva.
- [x] Criar duas rotas locais: `/__preview/scroll-expand/a` e `/__preview/scroll-expand/b`.
- [x] Conferir expansão e retorno em 1440 e 768 px, foto estática em 390 px e movimento reduzido; sem overflow ou erros de execução.
- [x] Conferir celular em paisagem 844×390, troca dinâmica da preferência de movimento, redimensionamento para mobile e rotas com barra final. Nenhum palco de animação permanece nos modos estáticos.
- [x] Build TypeScript/Vite e isolamento: nenhuma foto, classe, toolbar ou código do experimento no bundle de produção; os hashes JS/CSS permanecem iguais aos do build local anterior à prévia.
- [x] Usuário escolher posição: A, com expansão até a tela inteira, mantendo a foto 21.
- [x] Revisar A localmente em tela inteira: 1440×900, 1920×1080 e 768×1024 chegam à largura útil total e altura da janela, sem toolbar sobreposta; expansão e retorno conferidos. Mobile 390×844 e movimento reduzido ficam estáticos, agora sem margens laterais. B preservada. Seis cenários sem erros de execução; build e TypeScript passaram.
- [ ] Após escolha, integrar apenas a alternativa selecionada na árvore normal do App, remover toolbar/portal de laboratório e ajustar eventual repetição de fotos/copy.
- [ ] Validar navegação por âncoras, teclado, movimento reduzido, celular em retrato/paisagem e perfil de renderização em dispositivo representativo.
- [ ] Publicar somente a integração posteriormente aprovada.

## Arquivos do estudo

- `src/preview/ScrollExpandPreview.tsx/.css`: inserção A/B e toolbar local.
- `src/preview/scroll-expand/ScrollExpand.tsx/.css`: motor adaptado.
- `src/preview/scroll-expand/assets/`: fotos otimizadas, importadas apenas pela prévia.
- `src/main.tsx`: importação lazy condicionada a `import.meta.env.DEV`.
- `src/preview/scroll-expand/LICENSE.react-bits.md`: licença e crédito preservados.

## Fontes e limites

- Página: https://www.reactbits.dev/animations/scroll-expand
- Fonte fixada: https://github.com/DavidHDev/react-bits/blob/1eeb6f105c68b964289d85dabbe84a1d551f3797/src/ts-default/Animations/ScrollExpand/ScrollExpand.tsx
- Licença da mesma revisão: https://github.com/DavidHDev/react-bits/blob/1eeb6f105c68b964289d85dabbe84a1d551f3797/LICENSE.md

O original usa scroll interno por padrão, ocupa 2,55 alturas de palco e não torna a foto estática ao reduzir movimento. A adaptação usa scroll da janela, percurso menor e fallback estático real. Não foram adotados o overlay de texto nem vídeo. O teste visual é local em Chromium; não equivale a validação de Safari/iOS físico ou de performance em celular real.

Evidências no workspace pai: `output/playwright/scroll-expand-qa.json`, `scroll-expand-followup.json`, capturas `scroll-expand-*`, `ux-release-2026-10-23.json` e `output/research/scroll-expand/` com fonte consultada e script de otimização.

Revisão de tela inteira: `output/playwright/scroll-expand-fullscreen-qa.js/.json` e capturas `scroll-expand-fullscreen-*`. O `sizes` de A considera a largura efetivamente renderizada em modo cover para escolher uma foto com resolução suficiente também em tablet vertical. As dimensões excluem a barra de rolagem nativa; não se usa a API Fullscreen nem se bloqueia a navegação.
