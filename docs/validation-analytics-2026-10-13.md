# Validação local — 13/10/2026

Branch `feat/analytics-portfolio`, base `17b4f07ce6e45fcaf3089f875d637794d19f4a12`. Sem commit, push, deploy ou ID real de Analytics.

- `npm ci` normal passou; Vitest 4.1.11 exato, React/Vite preservados. Auditoria final: zero vulnerabilidades reportadas.
- `npm run test:analytics`: **36 testes em quatro arquivos**, aprovados, incluindo consentimento, URLs, transporte, handlers e foco das preferências.
- `npm run build`: TypeScript/Vite 6.4.4 passaram. Bundle final `index-C65G1lmP.js` (352,66 kB / 114,04 kB gzip); CSS `index-BT8sIUlh.css` (46,13 kB / 10,53 kB gzip).
- `git diff --check`: sem erros de whitespace. Conteúdo editorial, projetos, fotos e efeitos preservados.

Prévia de build: http://127.0.0.1:5182/.

No navegador: 1440/390/320 px sem overflow horizontal; quatro modais de projeto abriram por Enter, fecharam com Escape e devolveram o foco. PDF respondeu corretamente. Preferências indicaram coleta OFF e permitiram retirar grant salvo mesmo com coleta indisponível. Duas abas reais sincronizaram a retirada; um cookie `_ga` de teste foi removido. Nenhuma tag/requisição Google ou erro de página observado.

A revisão corrigiu timer de expiração sem novo clique, revalidação ao retomar a página, retirada com configuração OFF, limpeza de cookies sem script e retorno de foco ao acionador com fallback quando desconectado. O QA visual corrigiu espaçamento de letras herdado pelo título das preferências; captura final em 320 px confirmou título sem overflow.

Os testes de transporte usam mocks, não demonstram SDK Google real. Convite configurado, consentimento com tag, cookies efetivos do SDK, unload, linker, atribuição e DebugView exigem ID/configuração e validação da etapa externa descrita em [analytics.md](analytics.md). Nenhuma coleta está ativa.
