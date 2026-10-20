# Estado público das demonstrações

Implementação local, 20/10/2026. Branch `feat/project-health-status`, baseada em `main` (`f3b66aa`). A evolução visual em `curiosity-lab` permanece separada.

## Plano

- [x] Isolar o trabalho e ler o contrato v1 e `status.schema.json` do workspace `portfolio-health`.
- [x] Validar o feed, a identidade dos alvos e a validade de projeto/componentes com testes.
- [x] Consumir somente o endpoint público confirmado, sem credenciais, e atualizar expiração com a aba aberta/foco.
- [x] Integrar estado compacto nos cards e detalhes no modal, preservando identidade do projeto e Analytics.
- [x] Atualizar somente URLs finais confirmadas e explicar o caráter sintético das demos.
- [x] Verificar erros, expiração, teclado, mobile, eventos existentes e build.
- [x] Registrar commits/evidências e entregar preview local, sem push, merge ou deploy.

## Decisões

O feed é informativo e não controla a navegação. Falha de rede, observação vencida, schema inválido ou alvo diferente resultam em disponibilidade não confirmada. A validade é o menor valor entre `validUntil` e `checkedAt + 45 minutos`, tanto para o projeto quanto para seu componente. `generatedAt` e o horário do download não renovam a medição.

A UI não aproveita URLs do feed como links. Ela compara URL, papel e cobertura com os destinos aprovados no código; `targetId` precisa existir e o histórico não é transportado entre alvos. Manutenção só aparece mediante declaração com janela válida e é separada da evidência de disponibilidade.

Um único consumidor atende os quatro projetos. Consulta inicial, atualização a cada cinco minutos enquanto visível e ao recuperar foco com intervalo mínimo de um minuto. A expiração é reavaliada no máximo a cada minuto e no instante do próximo vencimento conhecido; não depende de nova resposta de rede. Requisições têm timeout, limite de tamanho e cancelamento no desmontar.

O contrato mede GET do HTML e do arquivo JavaScript principal/selecionado da mesma origem. O seletor do Play distingue o `main-` dos polyfills; o consumidor não presume que o primeiro módulo seja o principal em todos os projetos. Isso não prova execução no navegador, IA, API, banco, reserva ou envio de lead. O modal informa essa cobertura e o horário real da checagem. Campos do feed são tratados como dados sem HTML.

## Fontes locais

- Brief autorizado: `C:/Users/Guiler/.codex/agent-manager/agentes/portfolio-recovery-2026-10-20/BRIEF-INTEGRACAO-PORTFOLIO.md`
- Contrato: `C:/Users/Guiler/Desktop/wks/portfolio-health/CONTRACT.md`
- Schema: `C:/Users/Guiler/Desktop/wks/portfolio-health/status.schema.json`

O monitor é mantido em outro repositório por outra frente. Esta branch não cria rotinas de coleta nem modifica as demos.

## Integração e configuração

Endpoint confirmado: https://guilhermeserafim.github.io/portfolio-health/status.json.

O endereço é o padrão de `src/project-health/config.ts`. `VITE_PROJECT_HEALTH_URL` permite configurar outro endpoint HTTPS público; valor vazio desativa consultas. Nenhuma chave, cookie ou header de autorização é enviado. A política de referrer é `no-referrer`.

A leitura tem timeout de oito segundos e limite de 64 KiB, conferido durante o streaming. Respostas rejeitadas pelos headers têm o corpo cancelado; toda requisição é abortada ao terminar ou desmontar o consumidor. O fetch usa revalidação, mas timestamps continuam sendo a autoridade sobre frescor.

O estado é uma prop separada no modal: atualizações do monitor não recriam o objeto `Project`, reabrem o diálogo ou reiniciam sua rolagem. O feed não adiciona eventos ao Analytics nem envia dados do monitor à tag.

| Projeto | Destino aprovado | Papel |
| --- | --- | --- |
| GeoRisk | https://orbtalus-demo.guiler.chatgpt.site/ | Demo sintética |
| SEVEN Tools | https://seven-tools-demo.guiler.chatgpt.site/ | Demo sintética |
| Play Senac | https://play-senac-demo.guiler.chatgpt.site/ | Demo com reservas sintéticas e locais |
| Mesa de Negócios | https://dennisnakamura.com/mesa-de-negocios | Página original, preservada |

Os aceites públicos das demos foram comunicados pela coordenação: OrbTalus `b50ad24f`, SEVEN `d5a893aa` e Play `e55a10aa`. A conferência do consumidor verificou separadamente os três destinos dos botões e seus avisos de demonstração (`project-health-links-qa.js`). Não repetiu a jornada completa das demos nem a revisão dos seus assets.

## Evidência executada

### Testes e revisão

- Baseline anterior à integração: 67 testes de Analytics aprovados.
- Após implementação e revisão: **153 testes aprovados em seis arquivos**, incluindo os 67 existentes, 73 de contrato/seleção e 13 de transporte/ciclo de vida.
- Testes com relógio controlado cobrem expiração de 45 minutos com aba aberta, retorno de foco, downloads repetidos do mesmo documento, erro de rede, timeout, JSON/schema/headers inválidos, resposta antiga, limite de tamanho e cancelamento.
- Revisão independente identificou download não cancelado quando headers eram rejeitados. Dois testes com `ReadableStream.cancel()` reproduziram a falha e passaram após a correção.
- TypeScript/Vite: build aprovado. Nenhuma dependência adicionada.

### Browser com fixture fictícia

Script: `<workspace>/output/playwright/project-health-browser-qa.js`. A fixture usa domínio `.test`, dados fictícios e relógio controlado; **não representa uma medição pública**.

Passou em 320, 390, 768 e 1440 px, sem overflow horizontal. Com o modal aberto, o relógio avançou mais de 45 minutos: estado mudou para `unknown`, preservando rolagem e foco. Escape devolveu foco ao card. O link e o contexto continuaram disponíveis após falha de rede. Nenhum `pageerror` ou request Google foi observado.

Capturas em `<workspace>/output/playwright`:

- `project-health-cards-fixture.png`
- `project-health-expired-fixture.png`
- `project-health-mobile-fixture.png`

### Browser com endpoint público real

Scripts: `project-health-public-qa.js` e `project-health-headers-qa.js`, no mesmo diretório de evidências. Contexto de navegador novo, sem fixture nem relógio simulado.

Em 20/10/2026, o browser em `http://127.0.0.1:5192` leu o feed real. GeoRisk e Mesa estavam `operational`, com `checkedAt` de **15:57:46Z** e **15:57:45Z**, respectivamente. SEVEN e Play estavam `pending`/`unknown`, sem horários inventados.

A fonte dessa amostra foi `github-actions`, evento `push`, execução `39453162568`, commit `8d2d47d453cb63a7c7f6d9b3fc73c1e669b56377`. Isso comprova a publicação por push, **não uma execução agendada**.

Na conferência de headers às 16:08Z: HTTP 200, `application/json; charset=utf-8`, CORS `*`, `Cache-Control: max-age=600` e ETag presentes. A revalidação também foi observada no navegador. O cache de dez minutos não prolonga o TTL das evidências.

Capturas: `project-health-cards-public.png` e `project-health-dialog-public.png`. Nenhum `pageerror` ou request Google no QA. O console informou apenas React DevTools e o aviso esperado de movimento reduzido da biblioteca Motion.

Leituras pontuais posteriores da UI às **16:13:14Z** e **16:22:23Z**, sem fixture ou requisição manual adicional: GeoRisk, SEVEN e Mesa mostraram `operational`, com checagens de 16:10:42Z, 16:10:40Z e 16:10:41Z. Play permanecia `unknown`, sem horário. Roteiro: `project-health-state-read.js`. O aceite público da SEVEN foi comunicado pela coordenação antes de configurar seu destino; os controles locais das três demos foram conferidos por `project-health-links-qa.js`.

Após a última troca de URL e o ajuste da descrição de cobertura, `npm run build` passou novamente. A suíte completa não foi repetida para mudanças finais apenas em destinos e textos; os três controles receberam QA pontual no navegador.

## Commits

- `297ede5` — consumidor, validade e testes.
- `f891af7` — URL revisada de GeoRisk/OrbTalus e distinção da demo sintética.
- `13bd5fb` — estados nos cards e informações no modal.
- `0e07692` — URL revisada da SEVEN Tools e cadastro do alvo.
- `407ad80` — URL revisada do Play Senac e cadastro do alvo.
- `ceda325` — cobertura descrita como arquivo JavaScript selecionado, conforme contrato atualizado.

## Limites da entrega local

- Preview desta integração: http://127.0.0.1:5192/#projetos.
- A evolução visual de personalidade continua em http://127.0.0.1:5191/, intacta na branch separada.
- O teste responsivo usou Chromium; não representa aparelho físico, Safari ou o navegador interno do Instagram.
- A coleta HTTP não demonstra jornada completa, APIs, IA, banco ou entrega de formulário.
- O quarto alvo foi autorizado para publicação no monitor após o aceite de Play. A UI passa a mostrar sua observação quando ela chegar no feed; até lá, `pending` continua `unknown`. O consumidor não fabrica medição nem antecipa o resultado da coleta.
- Uma execução agendada (`source.event: schedule`) ainda não foi comprovada por esta sessão. Esse aceite operacional pertence à frente do monitor.
- A publicação do portfólio continua dependente da revisão do usuário; nenhum push, merge ou deploy foi feito nesta tarefa.
