# Foco inicial e performance — investigação de 23–24/10/2026

## Problema e hipótese

O Lighthouse local contra a versão publicada `2933060` atribuiu o maior reflow síncrono ao `focus()` de `ReactDOM.commitMount`. `AnalyticsPreferences` montava um botão com `autoFocus` dentro de um diálogo fechado. Isso ocorre desde `d472953`, anterior à versão Swarm B.

Hipótese testada: impedir essa tentativa de foco reduziria o bloqueio inicial. Instrumentação em navegador confirmou a tentativa no botão “Fechar preferências”, mas um controle que omitiu somente essa chamada manteve grande parte do trabalho total de layout. Portanto, a chamada **antecipa trabalho pendente da página** e não explica sozinha o gargalo. Não confundir duração atribuída ao gatilho com economia garantida ao removê-lo.

## Correção delimitada

Remover apenas `autoFocus` desse botão. O primeiro controle focável continua sendo Fechar, e `dialog.showModal()` cuida do foco ao abrir. O efeito existente conserva a restauração para o acionador conectado ou para o controle persistente quando o convite desaparece. Nenhuma mudança no visual, efeitos, consentimento ou envio de eventos.

O teste `tests/browser/privacy-focus.js` observou a falha na versão antiga e passou na corrigida. Ele usa o componente real no navegador e instrumenta a chamada nativa sem substituir seu comportamento. É um smoke desktop de viewport explícita, não uma matriz móvel.

## Evidência e limites

- O controle de foco incluiu seis sessões, alternando o comportamento original e a omissão da chamada no navegador de teste. A produção não foi modificada.
- O trace mostrou duas passagens amplas de layout, com 1.089 e 1.430 objetos; a preparação de texto respondeu por parcela relevante do custo.
- Ocultar seções e trocar fontes foram experiências descartáveis, sem atribuição estável suficiente para uma correção. Nenhuma delas entrou no produto.
- `content-visibility` amplo foi descartado: além do ganho inconclusivo, contenção em `#contato` afetaria o convite de privacidade `position:fixed` que é seu descendente. Não aplicado.
- Swarm não foi carregado nas navegações iniciais do audit anterior. Não atribuir a ele este bloqueio.
- Cinco testes antigos chamavam `App()` diretamente, embora o componente agora receba props. O harness foi corrigido para `App({})`, preservando suas asserções e sem alterar o componente para acomodar o teste.

## Validação e reprodução

1. `npm run test:analytics`: 69 testes, quatro arquivos.
2. `npm run build`: TypeScript e build Vite. Para reproduzir o build publicado, fornecer os mesmos valores públicos de `VITE_GA_MEASUREMENT_ID` e `VITE_ANALYTICS_ENABLED`; o padrão local desativa coleta. Localhost continua excluído pela política de hosts.
3. Servir o build com `npm run preview -- --port 5221 --strictPort`.
4. Abrir esse endereço numa sessão de `playwright-cli`, depois executar `run-code --filename tests/browser/privacy-focus.js`. Falha deve retornar erro/exit não zero. O resultado fica em `window.__privacyFocusQA` na aba controladora.
5. QA adicional usou build local sob origem pública emulada em contextos isolados. Chamadas Google foram interceptadas/bloqueadas, sem enviar métricas. Foram verificados desktop, 390×844 e movimento reduzido; abertura pelo convite, Fechar, Escape, backdrop, teclado, aceite e retirada com recarga. Não é uma revalidação de entrega GA4 real.

Artefatos externos ao repositório, na raiz do workspace: `output/performance/2026-10-23-privacy-focus/` (experiências, trace, QA e série interrompida) e `output/performance/2026-10-24-privacy-focus/` (nova comparação pareada). A série do dia 23 foi interrompida por `Storage.clearDataForOrigin: Target closed`; resultados de dias diferentes não devem ser agrupados.

A comparação de 24/10 completou 12 rodadas, três por versão/dispositivo. Performance mediana: desktop 91 antes / 87 após; mobile 65 antes / 63 após. TBT mediano: desktop 242 / 298 ms; mobile 1.280 / 1.491 ms. Houve pares em ambas as direções e grande variação de CPU (benchmarkIndex 991,5–2.232,5). **Não foi demonstrado ganho consistente**; as medianas piores também não isolam causalmente uma regressão. O foco indevido foi corrigido, mas não se afirma resolução do bloqueio inicial.
