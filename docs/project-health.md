# Estado público das demonstrações

Implementação local, 20/10/2026. Branch `feat/project-health-status`, baseada em `main` (`f3b66aa`). A evolução visual em `curiosity-lab` permanece separada.

## Plano

- [x] Isolar o trabalho e ler o contrato v1 e `status.schema.json` do workspace `portfolio-health`.
- [ ] Validar o feed, a identidade dos alvos e a validade de projeto/componentes com testes.
- [ ] Consumir somente o endpoint público confirmado, sem credenciais, e atualizar expiração com a aba aberta/foco.
- [ ] Integrar estado compacto nos cards e detalhes no modal, preservando identidade do projeto e Analytics.
- [ ] Atualizar somente URLs finais confirmadas e explicar o caráter sintético das demos.
- [ ] Verificar erros, expiração, teclado, mobile, eventos existentes e build.
- [ ] Registrar commits/evidências e entregar preview local, sem push, merge ou deploy.

## Decisões

O feed é informativo e não controla a navegação. Falha de rede, observação vencida, schema inválido ou alvo diferente resultam em disponibilidade não confirmada. A validade é o menor valor entre `validUntil` e `checkedAt + 45 minutos`, tanto para o projeto quanto para seu componente. `generatedAt` e o horário do download não renovam a medição.

A UI não aproveita URLs do feed como links. Ela compara URL, papel e cobertura com os destinos aprovados no código; `targetId` precisa existir e o histórico não é transportado entre alvos. Manutenção só aparece mediante declaração com janela válida e é separada da evidência de disponibilidade.

Um único consumidor atende os quatro projetos. Consulta inicial, atualização a cada cinco minutos enquanto visível e ao recuperar foco com intervalo mínimo de um minuto. A expiração é reavaliada no máximo a cada minuto e no instante do próximo vencimento conhecido; não depende de nova resposta de rede. Requisições têm timeout, limite de tamanho e cancelamento no desmontar.

O contrato mede GET do HTML e do primeiro módulo JavaScript da mesma origem. Isso não prova execução no navegador, IA, API, banco, reserva ou envio de lead. O modal informa essa cobertura e o horário real da checagem. Campos do feed são tratados como dados sem HTML.

## Fontes locais

- Brief autorizado: `C:/Users/Guiler/.codex/agent-manager/agentes/portfolio-recovery-2026-10-20/BRIEF-INTEGRACAO-PORTFOLIO.md`
- Contrato: `C:/Users/Guiler/Desktop/wks/portfolio-health/CONTRACT.md`
- Schema: `C:/Users/Guiler/Desktop/wks/portfolio-health/status.schema.json`

O monitor é mantido em outro repositório por outra frente. Esta branch não cria rotinas de coleta nem modifica as demos.
