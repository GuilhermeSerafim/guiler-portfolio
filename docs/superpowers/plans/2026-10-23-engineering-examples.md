# Engineering Examples Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir os dois cards de resultados no preview por demonstrações educativas de engenharia, preservando a narrativa globo → conexões → software.

**Architecture:** Duas demonstrações locais com estado React e desenhos SVG pequenos, integradas à etapa final de `GlobeStory`. O globo e a ilustração principal continuam como centro visual; as interações explicam consequências concretas sem medir serviços reais.

**Tech Stack:** React 18, TypeScript, Vite 6, CSS e SVG; sem dependência nova necessária.

**Spec:** Pedido de revisão de 2026-10-23 e direção adotada após pesquisa, consolidados abaixo. Escopo exclusivo do preview no worktree `output/portfolio-variants/entry-flow`; avaliação visual do usuário ainda pendente.

## Global Constraints

- Preservar `GlobeField.tsx`, `SystemPlane.tsx` e a progressão existente entre globo, conexões e diagrama de software.
- Usar o marcador exato `03 / PRINCÍPIOS EM AÇÃO` e manter poucas palavras na tela.
- Remover os antigos case cards somente deste preview. Não alterar `src/data.ts`, os dados reais, os componentes de projetos ou seus resultados.
- Exibir `Demonstrações interativas.` junto do título final e `EXEMPLO 01/02` nos próprios cards, inclusive em movimento reduzido, telas baixas e antes da entrada do título final. Os marcadores e os botões contextualizam os exemplos sem um parágrafo adicional.
- Não apresentar percentuais, uptime, tempos de recuperação ou resultados pessoais inventados. Os títulos abaixo descrevem a finalidade dos princípios demonstrados.
- Ações locais e reversíveis; sem chamadas a serviços de produção ou implantação. Commit convencional local, sem push.

## Direções comparadas

| Direção | Avaliação |
| --- | --- |
| Cases e KPIs | Funcionam como evidência de projetos específicos, mas repetem a seção de projetos e não explicam o mecanismo de engenharia. Manter os dados reais onde já pertencem. |
| Catálogo de siglas | SOLID, DI, Clean Architecture e AWS juntos exigem leitura técnica e misturam princípios, técnicas, arquitetura e plataforma. |
| Demonstrações de consequências — escolhida | Uma ação produz uma mudança visível. Comunica valor com pouco texto e aproveita a ilustração existente. |

## Brief visual e de interação

Manter o desenho principal aberto e legível, com os dois cards como apoio. Reutilizar a paleta escura, linhas finas e acento azul do preview; reservar contraste adicional para o elemento que mudou. Os desenhos dos cards não devem virar novos diagramas grandes nem cobrir o núcleo da ilustração. No mobile, reorganizar cards e espaço reservado para a arte sem sobreposição, corte ou texto microscópico.

| Demonstração | Copy e ação | Causa e efeito |
| --- | --- | --- |
| Menos retrabalho | `Trocar uma integração mantendo as regras do produto.` Botão: `Trocar integração`. | Mostrar Produto → Encaixe → Serviço A. A ação troca somente o serviço por B; encaixe e produto permanecem estáveis. Estado textual identifica o serviço conectado. O status acessível também informa que regras e contrato permanecem iguais. |
| Menos interrupções | `Se um servidor falha, outro pode continuar atendendo.` Botão: `Simular falha`; após a sequência, `Restaurar`. | Mostrar duas rotas/instâncias. A ação torna A indisponível, exibe `Detectando falha…` e depois `Servidor B assumiu`, junto da rota saudável. Restaurar repõe o cenário inicial. |

Os estados devem ser compreensíveis sem depender exclusivamente de cor. Não mostrar redirecionamento instantâneo antes da detecção nem sugerir que todo incidente é recuperável. Uma rota alternativa saudável é uma premissa da segunda simulação. As durações visuais servem à explicação, não representam tempos operacionais.

Com `prefers-reduced-motion`, conservar os controles e as mudanças de estado, substituindo deslocamentos e pulsos por atualizações discretas. Usar botões nativos, foco visível e uma mensagem de estado acessível. Evitar animação contínua fora da área visível e limpar temporizadores ao desmontar.

## Fundamentação técnica — fontes primárias verificadas

- **DIP, DI e Clean Architecture são distintos.** Inversão de dependência (DIP, o D de SOLID) orienta o código a contratos e abstrações. Injeção de dependências (DI) fornece a implementação de fora, por exemplo pelo construtor; pode ser manual e não equivale ao princípio. Clean Architecture organiza limites em torno das regras de negócio e usa DIP para manter os detalhes externos fora do núcleo. A primeira demonstração ilustra essa substituição por contrato; não promete trocar qualquer integração sem trabalho. [Microsoft — Architectural principles](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/architectural-principles), [Martin Fowler — Dependency Injection](https://www.martinfowler.com/articles/injection.html), [Robert C. Martin — The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).
- **Redundância e detecção apoiam a continuidade.** A AWS recomenda distribuir recursos e dados entre zonas e encaminhar tráfego a instâncias disponíveis. Os health checks do Application Load Balancer detectam alvos não saudáveis antes de retirá-los do atendimento. A demonstração usa esse mecanismo como exemplo; AWS por si só não garante a disponibilidade da aplicação. Se todos os alvos falharem, o cenário de uma rota saudável já não se aplica. [AWS — Multiple locations](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_fault_isolation_multiaz_region_system.html), [AWS — Health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html), [AWS — Shared responsibility for resiliency](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/shared-responsibility-model-for-resiliency.html).

## Referências de apresentação verificadas

- [Josh W. Comeau — A Friendly Introduction to Spring Physics](https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/): interação pequena para experimentar uma causa e observar seu efeito; o artigo contempla mouse, toque e teclado. Aplicar o método de explicação, sem copiar a estética nem introduzir movimento elástico desnecessário.
- [Stripe — APIs as infrastructure: future-proofing Stripe with versioning](https://stripe.com/blog/api-versioning): exemplo concreto de contrato e transformação nas bordas preservando expectativas do consumidor. Referência conceitual e de diagrama, não evidência de que versionamento e DI sejam a mesma técnica. Artigo histórico de 2017; não usado como descrição da política atual de releases da Stripe.
- [Vercel — How Vercel adopted microfrontends](https://vercel.com/blog/how-vercel-adopted-microfrontends): diagramas de limites e migração incremental tornam mudanças de arquitetura observáveis. Aproveitar a clareza de antes/ação/depois; não reproduzir os resultados quantitativos da Vercel nem recomendar microfrontends para este portfolio.
- A documentação AWS de múltiplas zonas e health checks, acima, informa a ordem visual falhar → detectar → redirecionar. A demo é esquemática, sem logos ou painéis que pareçam infraestrutura real do autor.

## Arquivos de implementação previstos

| Arquivo | Responsabilidade |
| --- | --- |
| `src/preview/globe-story/EngineeringExamples.tsx` | Duas demos, controles e estados locais acessíveis. |
| `src/preview/globe-story/EngineeringDiagrams.tsx` | Os dois pequenos SVGs esquemáticos, sem animação da ilustração principal. |
| `src/preview/globe-story/EngineeringExamples.css` | Mini-ilustrações, estados visuais, layout responsivo e movimento reduzido. |
| `src/preview/globe-story/GlobeStory.tsx` | Substituir apenas os case cards do preview e atualizar marcador/divulgação. |
| `src/preview/globe-story/GlobeStory.css` | Ajustar composição final e retirar estilos exclusivos dos cards substituídos. |

## Review Focus

Cliques rápidos não devem sobrepor sequências ou deixar estado impossível; sair e voltar à etapa deve manter controles coerentes; teclado precisa alcançar e acionar os botões; movimento reduzido deve preservar a explicação; telas pequenas precisam manter a arte e as duas demos legíveis. Verificar todos esses pontos no passo 4.

## Plano em quatro passos

- [x] **1. Integrar a nova apresentação:** em `GlobeStory.tsx`, substituir os case cards por `EngineeringExamples`, aplicar `03 / PRINCÍPIOS EM AÇÃO` e a divulgação educativa; preservar globo, arte e dados dos projetos.
- [x] **2. Implementar Menos retrabalho:** em `EngineeringExamples.tsx`, alternar Integração A/B pelo botão `Trocar integração`; manter Aplicação e Contrato estáveis e informar o resultado em texto.
- [x] **3. Implementar Menos interrupções e compor os cards:** no mesmo componente e CSS dedicado, encadear falha → detecção → redirecionamento, permitir `Restaurar` e aplicar layout responsivo, foco e movimento reduzido.
- [x] **4. Validar a mudança completa:** executar `npm run build`; conferir as interações por mouse e teclado, repetição/restauração, retorno à etapa, viewport mobile e `prefers-reduced-motion`; revisar o diff para confirmar que resultados reais e arte principal continuam intactos.

## QA

`npm run build` passou (TypeScript + Vite). A prévia permanece fora do bundle de produção: `index-CCJHE-dx.js` / `index-B4HXuMX8.css`, os mesmos artefatos anteriores a esta revisão.

Verificação principal em Chromium: 1440×900, 768×1024, 390×844, 320×568 e 844×390, com toque/mobile emulado nos três últimos. `output/playwright/engineering-qa.json`, no workspace pai, registra `pass: true`:

- Troca A→B preserva o desenho do produto; Enter e Tab exercitados nos dois primeiros tamanhos e toque nos três últimos.
- Sequência `detecting → rerouted` observada, botão bloqueado durante detecção, rota B ativa e X no servidor A; restauração repõe estado saudável.
- Sair durante detecção cancela/reset a sequência; retornar começa com serviço A. Os controles estão desabilitados e fora da árvore acessível antes de aparecerem.
- Movimento reduzido mantém controles e estados funcionais, sem canvas, pulsos ou transições.
- Cards dentro do viewport, sem overflow interno/horizontal ou colisão com o título em todos os tamanhos. Em tela curta, composição mais compacta.
- Zero erros JavaScript e zero requests Google nos contextos locais limpos. Não é nova validação do Analytics de produção.
- O diff confirma `GlobeField.tsx`, `SystemPlane.tsx`, `src/data.ts` e a correção da relatividade intactos.

A checagem encontrou um texto de orientação transparente interceptando cliques em paisagem; foi corrigido com `pointer-events: none` nesse elemento decorativo. Capturas: `output/playwright/engineering-qa-{1440,768,390,320,844}-changed.png`.

A revisão de copy acrescentou os marcadores `EXEMPLO 01/02` aos cards. A checagem focada `engineering-label-check.js` / `engineering-labels.json` confirmou os rótulos visíveis em 320×568 e 844×390, inclusive sob movimento reduzido, sem colisão ou overflow. Capturas finais: `engineering-final-320.png` e `engineering-final-844.png`.

O roteiro e o relatório estão no workspace pai, não no bundle do site. Testes emulados não equivalem a aparelhos físicos ou medição de FPS. Revisão visual do Guiler pendente. Apenas local, sem publicação.
