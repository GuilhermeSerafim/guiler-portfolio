# Dez posições locais para Newton

O usuário rejeitou a composição ao lado de Tesla e solicitou dez cenários com URLs diferentes para escolher. Este estudo é temporário: nenhuma opção foi adotada como versão final e nenhuma publicação foi realizada.

Índice: http://127.0.0.1:5195/__preview/maca

| URL local | Composição | Largura desktop / celular |
| --- | --- | --- |
| /__preview/maca/01 | No lugar da seta da apresentação no hero | 64 / 48 px |
| /__preview/maca/02 | Entre as legendas abaixo do retrato | 80 / 60 px |
| /__preview/maca/03 | Ao lado da introdução dos projetos | 88 / 64 px |
| /__preview/maca/04 | Centro do encerramento dos projetos e convite ao GitHub | 72 / 52 px |
| /__preview/maca/05 | Entre as duas experiências, na margem direita da timeline | 76 / 60 px |
| /__preview/maca/06 | Abertura de Sobre | 72 / 56 px |
| /__preview/maca/07 | Assinatura do texto pessoal, junto ao LinkedIn | 88 / 64 px |
| /__preview/maca/08 | Abertura azul do Contato | 96 / 64 px |
| /__preview/maca/09 | Ao lado das redes sociais | 88 / 72 px |
| /__preview/maca/10 | Pequena assinatura junto à marca no rodapé | 56 / 44 px |

Newton usa azul sobre papel e branco nas seções escuras. A mesma arte vetorial e a animação de queda são reutilizadas. A maçã anterior é ocultada apenas durante as prévias; Tesla e as outras artes permanecem. Todos os novos espaços usam fluxo normal.

## Operação

- O servidor Vite existente atende as rotas; cada link abre diretamente no desenho.
- A barra de comparação oferece opção anterior/próxima, seletor, retorno ao desenho, índice e recolhimento. Recarregar preserva a opção escolhida pela URL.
- `main.tsx` importa dinamicamente o estudo somente com `import.meta.env.DEV` e no prefixo `/__preview/maca`.
- O portal é inserido em um host temporário e removido no cleanup. Isso permite estudar posições sem reestruturar dez regiões do App. Depois da escolha, extrair somente a composição aprovada para JSX/CSS definitivo e remover o estudo.
- Limitação de ferramenta de estudo: um Fast Refresh que substitua estruturalmente o pai do portal pode exigir recarregar a página. Navegação normal entre as URLs faz recarga completa. Rerender por filtro de projetos foi validado.

## Validação

- Dez opções em quatro larguras: 320, 390, 768 e 1440 px; 40 composições verificadas em Chromium local. Uma maçã visível por página, sem overflow horizontal nem colisão do desenho com texto, imagens, outras artes ou barra de comparação.
- Revisão visual das dez opções em 390 e 1440 px. Preferência por movimento reduzido usada nas capturas para inspecionar posição final.
- Entrada automática e ativação da animação conferidas nas dez URLs com movimento habilitado.
- Índice com dez links, navegação anterior/próxima, seletor, recolhimento, recarga da URL e página comum sem estudo verificados. Zero erros JavaScript capturados na rodada completa.
- A revisão independente identificou um seletor `nth-child` que deixava a segunda legenda visível nos cabeçalhos 06/08 no celular; corrigido especificamente nas prévias. Também corrigida a variável de fonte da barra. Nova rodada em 320/390/700/701/768/1440 confirmou ambos os ajustes, o índice e os filtros de projetos.
- Transferência de foco ao recolher/reabrir o comparador e botão para rever a maçã validados por teclado em 390 px. O teste de replay configura explicitamente movimento habilitado; com movimento reduzido a arte permanece estática como esperado.
- Build TypeScript/Vite aprovado. JS `index-o9mRPHY_.js` e CSS `index-DWKikE34.css` permanecem iguais ao build anterior; nenhuma string `apple-preview` ou rota do estudo encontrada em `dist`.

Scripts na raiz do workspace: `output/playwright/apple-options-qa.js` e `apple-options-final-qa.js`. Capturas: `output/playwright/apple-option-{01..10}-{390,1440}.png`. Não houve teste em dispositivo físico.

Sem push ou deploy. A escolha da composição fica com o usuário.

## Refinamento da opção 04

A pedido do usuário, a opção 04 foi centralizada e reduzida em aproximadamente 18%: de 88 para 72 px no desktop e de 64 para 52 px no celular. No desktop, colunas laterais simétricas mantêm a maçã no centro da faixa, independentemente do comprimento do texto e do link. No celular, texto, maçã e GitHub ficam empilhados e centralizados.

Validação em 320/390/700/701/768/1440 px: diferença entre o centro da maçã e da faixa igual a zero, sem colisões ou overflow. Animação preservada, zero erros JavaScript, revisão visual desktop/celular e revisão estática independente aprovadas. Build TypeScript/Vite aprovado com os mesmos arquivos de produção. Script `output/playwright/apple-four-centered-qa.js`; capturas `apple-four-centered-{390,1440}.png`. Continua disponível na mesma URL `/__preview/maca/04`, somente localmente.
