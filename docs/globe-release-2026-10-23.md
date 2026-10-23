# Publicação da transição de engenharia

Guiler aprovou a publicação do estudo local e pediu a correção da numeração repetida na página.

## Integração

- `GlobeStory` incorporado à página principal, antes de `#sobre`, na posição aprovada.
- Componentes movidos de `src/preview/globe-story` para `src/components/globe-story`.
- A rota de comparação local reutiliza a mesma App, sem duplicar a cena. Continua excluída do build público, assim como a barra de estudo e o salto automático.
- Etapas internas chamadas apenas Curiosidade, Conexões e Princípios em ação. Numeração 01–04 preservada somente nas seções principais.
- Exemplos de integração e continuidade mantêm sua identificação como demonstrações; não representam métricas pessoais.
- Revisão independente apontou sobreposição entre 601–615 px. Breakpoint ajustado para 640 px. Janelas estreitas e muito baixas usam a composição estática acessível, inclusive com zoom.
- A correção anterior da malha de relatividade faz parte desta entrega.
- Conteúdo dos cases, links, currículo, configuração do Analytics e projeto do hub preservados.

## Verificação

Build TypeScript + Vite com as variáveis públicas de produção passou. O empacotador local `vercel build` apresentou `spawn cmd.exe ENOENT` neste Windows; o build foi executado pelo script npm do projeto, carregando o arquivo local de ambiente sem expor seu conteúdo. Publicação usa build remoto na Vercel.

Roteiro de integração: `output/playwright/globe-release-qa.js` na raiz do workspace. Inclui primeira entrada sem salto, cena única, posição antes de Sobre, botões, redirecionamento simulado, restauração, movimento reduzido, leitura com zoom, âncoras e ausência de requisições Google antes do consentimento.

Resultado: **4/4 cenários passaram**, sem erros de JavaScript nem requisições Google. Chromium em 1440×900, 390×844 com toque, 601×800 e janela compacta 320×256. Relatório: `output/playwright/globe-release-qa.json`; capturas `globe-release-{largura}.png`. A primeira execução mediu as âncoras antes do término da rolagem suave no caso compacto; o roteiro passou a esperar a chegada ao destino, sem alteração de código. Emulação de viewport/toque, não teste em aparelho físico nem benchmark de FPS.

Artefatos locais de produção: `index-Chnd7E-b.js` e `index-B0mb4QGr.css`. Os rótulos internos não contêm mais numeração concorrente com as seções 01–04.

Alvo conferido: projeto Vercel `guiler`, `prj_wUyeYCfry9rLDtwe8fasGGJtU4WU`, equipe `team_t3l2btRcwn7wsaYoGSYgedD3`. A conexão MCP requereu reautenticação; CLI existente autenticada e alvo confirmado. Repositório: `GuilhermeSerafim/guiler-portfolio`.
