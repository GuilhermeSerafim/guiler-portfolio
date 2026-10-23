# Refinamentos de UX do portfólio — plano de implementação

**Goal:** aplicar os cinco ajustes da avaliação aprovada, com prévia local.
**Architecture:** React existente, mesmos componentes e tokens; alterações independentes em acesso ao case, convite de Analytics e apresentação do hero/tablet.
**Tech Stack:** React 18, TypeScript, Vite, CSS, Vitest e Playwright CLI para QA.
**Spec:** avaliação `output/portfolio-review-2026-10-22.md` do workspace pai e resposta do usuário “Prossiga @ui-ux-pro-max”.

## Restrições

- Preservar demos, URLs, currículo, métricas, imagens, efeitos aprovados e consentimento separado por origem.
- Sem publicação nesta etapa; apresentar em servidor local.
- Sem dependências novas. Usar componentes e estilos existentes.
- Resumos de projetos continuam curtos; stack em tags e resultados dentro dos cases.
- O prêmio abre o case GeoRisk; o troféu mantém sua interação de animação.

## Tarefas e responsáveis

- [x] Acesso ao projeto — agente: `ProjectDialog.tsx` e CSS específico. Mover ação para perto do título/estágio, distinguir demo/site, preservar avisos específicos e repositórios. Root verifica posição em 390/320, foco/escape, URLs e evento único por clique.
- [x] Consentimento compacto — agente: `AnalyticsPreferences.tsx/.css`. Texto curto; aceitar/recusar em linha quando couber; preservar adiar, detalhes, retirada e persistência. Root verifica altura menor que 190 px em 390, alvos de 44 px e fluxo de consentimento com requests externos bloqueados na QA.
- [x] Hero e prêmio — root: `App.tsx`, `styles.css`, `analytics/events.ts` e testes do catálogo/eventos. Texto aprovado; botão nomeado abre GeoRisk e registra `project_open` com localização fixa `hero_award`, sem valores livres.
- [x] Tablet — root: `styles.css`. Resumos/introdução em 15 px, currículo 14 px e tags 10 px no intervalo até 960 px; manter mobile 16 px onde já aplicado. Conferir 320, 390, 768, 960, 1440 e ampliação.
- [x] Integração: build, suite existente, QA visual/funcional e revisão independente. Commits convencionais separados por mudança.

## Focos da revisão

1. Botão demo/site precisa aparecer antes do texto longo, sem esconder os limites da demonstração.
2. Consentimento nunca é concedido ao adiar/recusar; nenhuma requisição Google antes de aceitar.
3. Novos controles operáveis por teclado, retorno de foco ao prêmio ao fechar o case.
4. Texto maior não pode sobrepor retrato, selo ou CTAs nos breakpoints intermediários.
5. Evento novo usa catálogo fechado; eventos antigos, IDs e destinos preservados.

## Decisões de execução

O relatório e as cinco recomendações foram aprovados na conversa. A execução usa frentes
independentes, com arquivos separados, e revisão final. A escolha de adiar permanece;
o objetivo é compactar a apresentação, sem alterar a política de coleta.

As buscas do plugin confirmaram orientação pertinente para legibilidade e conteúdo/foco
não coberto por overlays. A busca inicial de consentimento retornou chips e foi descartada.

## Evidências

Concluído localmente. Evidências e limites em `docs/ux-refinements-qa-2026-10-23.md`. Nenhum push ou deploy nesta etapa.
