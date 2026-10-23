# Publicação do cursor B no globo

Guiler escolheu a variante B da comparação local e autorizou sua publicação.

## Entrega

- Variante discreta aprovada incorporada ao globo da página principal: 72 partículas azuis, tamanho 1.4, mesma intensidade, máscara e fade .16–.24 da comparação.
- Módulo separado por import dinâmico. Carrega apenas quando a seção está ativa, com mouse fino e movimento permitido. Não é baixado na primeira tela nem em dispositivos de toque/movimento reduzido.
- O efeito substitui apenas o aro decorativo enquanto está ativo dentro da esfera. Cursor nativo, seleção e cliques continuam disponíveis.
- Fora da esfera a simulação para após a saída suave; fora da seção ou com aba oculta o efeito desmonta. Nos diagramas, o cursor normal retorna.
- Fonte e licença **MIT + Commons Clause** preservadas junto do componente. A variante completa e as barras de comparação continuam restritas às rotas DEV.
- Revisão independente identificou fallback visual em navegadores sem WebGL2. O sinal de inicialização do componente impede ocultar o aro quando o efeito não pode renderizar.

## Verificação

Roteiro: `output/playwright/swarm-release-qa.js` na raiz do workspace. Verifica carregamento adiado, desenho de 72 partículas, ocultação/retorno do aro, parada da simulação, reentrada, botões dos exemplos, navegação, movimento reduzido, emulação de toque e WebGL2 indisponível.

Resultado local: `output/playwright/swarm-release-qa.json`, **pass=true**, zero erros de página e zero requisições Google. Chromium 1440×900, toque emulado 390×844, movimento reduzido inicial e dinâmico, e contexto WebGL2 indisponível simulado. Captura `swarm-release-hover.png` inspecionada. Sem download do módulo no hero, em toque e em movimento reduzido; ao chegar ao globo com mouse, uma solicitação do módulo e 72 instâncias desenhadas. Contagem de desenhos estável após sair da esfera e na fase dos cards; reentrada restaurou o efeito. Na ausência de WebGL2, o aro ficou visível.

Build TypeScript + Vite passou. Artefatos: `index-CZtLrz3G.js`, `index-B0mb4QGr.css`, módulo adiado `GlobeSwarm-BKPfI6YN.js` (8,87 KB gzip) e `GlobeSwarm-DppY1T5s.css` (0,44 KB gzip). A barra e a versão A não fazem parte do build público.

Projeto Vercel confirmado: `guiler` / `prj_wUyeYCfry9rLDtwe8fasGGJtU4WU`, equipe `team_t3l2btRcwn7wsaYoGSYgedD3`. Publicação pelo CLI autenticado existente; a conexão MCP continua pedindo reautenticação. Build remoto adotado devido à limitação já registrada do empacotador Vercel no Windows.

Nenhuma alteração no hub, conteúdo dos cases, links, currículo ou configuração do Analytics. Este registro descreve comportamento/validação funcional; não é benchmark de FPS.
