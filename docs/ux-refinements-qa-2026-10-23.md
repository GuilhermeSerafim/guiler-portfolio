# Refinamentos de UX — validação local

Data: 23/10/2026. Base publicada: `a41397e`. Branch: `feat/portfolio-ux-refinements-2026-10-23`.
Prévia: `http://127.0.0.1:5217/`. Sem push, deploy ou mudança no hub.

## Resultado

- O acesso ao site/demonstração aparece antes do conteúdo longo nos quatro cases. Destinos, repositórios, avisos específicos, resultados e eventos existentes preservados.
- Convite de estatísticas com texto curto, aceitar/recusar lado a lado, privacidade e adiamento acessíveis. Sem mudança na política de coleta ou no armazenamento do consentimento.
- Hero com descrição concreta do trabalho; o texto do prêmio abre GeoRisk e usa o novo valor fechado `hero_award` em `project_open`. O troféu continua sendo o controle de animação.
- Introdução e resumos em 15 px no tablet, currículo em 14 px e tags em 10 px. Mobile mantém os tamanhos posteriores de 16 px para os parágrafos.

## Verificações

- Dois testes novos observados falhando antes da implementação: controle do prêmio e catálogo fechado. Após implementação, **155 testes passaram em 6 arquivos**, via `node node_modules/vitest/vitest.mjs run --maxWorkers=1`.
- `npm run build`: TypeScript e Vite concluídos com sucesso. Sem dependências novas. `git diff --check` sem erros.
- Chrome/Playwright: larguras 320, 390, 768, 960 e 1440. Sem erros de execução e sem rolagem horizontal na página. Hero e retrato sem sobreposição; colunas e textos de projetos conferidos no tablet.
- Em 320×568, os quatro CTAs de acesso ficam inteiros na abertura do modal (limite inferior entre 404 e 450 px). Em 390×844, entre 406 e 410 px. GeoRisk também verificado nas duas larguras de tablet.
- Prêmio operado por foco + Enter, abertura real do GeoRisk, Escape e retorno do foco verificados nos cinco tamanhos.
- Convite: altura de **168 px em 390×844** e **189 px em 320×568**; quatro controles com altura de 44 px, todos visíveis. Detalhes abrem e devolvem foco. Controle de privacidade do rodapé não coberto pelo convite (24 px de separação em 390×844).
- Adiar não salva autorização; recusar persiste `denied`, inclusive após recarregar. Zero tentativas de Google antes da escolha, após adiamento ou recusa.
- Aceitar solicita uma tag simulada e enfileira uma `page_view`; clique no prêmio enfileira uma `project_open` com `project_id=georisk`, `ui_location=hero_award` e `site_id=portfolio`. Retirar autorização recarrega com `denied`, sem nova tentativa de tag.
- Revisão independente somente leitura: nenhum achado concreto de regressão. QA visual e funcional executada separadamente pelo agente responsável.

## Ambiente e limites

O build de QA usa `VITE_ANALYTICS_ENABLED=true` e o ID fictício público `G-LOCALTEST123` somente no processo de build. Não foram alterados arquivos de ambiente. Em localhost, a coleta e o convite continuam desativados pelo bloqueio de hostname existente.

Para testar o convite, um contexto isolado interceptou `https://guiler.vercel.app` e respondeu com o build local. Todas as solicitações Google foram substituídas por um script vazio ou abortadas. Isso verifica a interface, as condições de consentimento e os comandos da aplicação; **não é uma nova verificação da tag real, de payloads do SDK Google ou do Realtime**. Nenhum dado de QA foi transmitido ao Analytics.

Um teste adicional com `CSS zoom: 2` manteve os controles do convite acessíveis, mas provocou overflow do título principal baseado em viewport. CSS zoom não equivale ao zoom nativo: o atalho enviado pelo Playwright não alterou o zoom do Chrome. Não se reivindica aprovação de zoom nativo a 200%; o reflow foi verificado diretamente até 320 CSS px. Nenhuma regra do título foi alterada nesta etapa.

Capturas longas de elementos podem mudar o viewport durante a captura e recortar conteúdo. A aparente quebra da primeira captura de projetos em 768 foi conferida novamente com screenshot de viewport e dimensões do DOM: cards, resumos e seção sem overflow.

## Artefatos locais

No workspace pai, `C:/Users/Guiler/Desktop/wks/guiler/output/playwright/`:

- `portfolio-ux-refinements-qa.js/.json`: layouts, dimensões, destinos e foco dos cases.
- `portfolio-ux-consent-qa.js/.json`: convite, persistência, adiamento, retirada e comandos simulados.
- `portfolio-ux-final-qa.js/.json`: foco no rodapé e limites do teste de ampliação.
- `portfolio-ux-tablet-inspect.js/.json/.png`: conferência das colunas reais do tablet.
- `portfolio-ux-390-case.png`, `portfolio-ux-390-consent.png`, `portfolio-ux-390-footer-consent.png` e `portfolio-ux-1440-motion.png`: referências visuais.

A próxima publicação deve fazer um build novo com as variáveis de produção; não publicar o `dist` usado pela QA.

## Ajuste posterior: alinhamento do prêmio

Em resposta à revisão do usuário, a frase “Ideias testadas. Trabalho reconhecido.” e o nome do prêmio foram agrupados no mesmo botão. Isso remove o espaço criado pela centralização da segunda linha em um alvo de 44 px. O troféu continua sendo um controle separado.

QA local em 320, 390, 768 e 1440 px: separação visual de 3 px entre as linhas, sem corte horizontal; alvo de 44 px ou maior quando o texto quebra. Abertura do GeoRisk por teclado e retorno do foco após Escape passaram nas quatro larguras. Os seis testes existentes de controles/eventos passaram. Artefatos no workspace pai: `output/playwright/hero-award-spacing-qa.json` e `hero-award-{before,after}-{width}.png`.
