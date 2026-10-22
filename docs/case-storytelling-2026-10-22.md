# Revisão dos quatro cases e trajetória

**Atualização posterior de 22/10:** Tech Text (`249b5a1`) foi publicado isoladamente após aprovação. A revisão dos cases continua local e recebeu [resumos concisos e disponibilidade contextual](project-cards-ux-2026-10-22.md): estágio e resultados aparecem somente nos detalhes. O registro abaixo preserva a primeira entrega desta revisão.

Briefing `BRIEF-MELHORIAS-PORTFOLIO.md`, de 22/10/2026, lido integralmente e executado no checkout ativo. Base local `249b5a1` (Tech Text); `origin/main` confirmado em `dda4a78` (Órbita publicada). Branch desta revisão: `feat/case-storytelling`.

O Tech Text continua preservado e local, aguardando revisão visual. Esta revisão também não foi enviada ao remoto ou publicada. Nenhum checkout antigo foi usado para substituir o conteúdo atual.

## Revisão editorial

| Case | Contribuição e resultado apresentados |
| --- | --- |
| GeoRisk | Protótipo geoespacial com cálculo por regras separado da explicação LangChain/OpenAI. Três componentes rastreáveis são escopo do índice heurístico, sem promessa de acurácia, probabilidade validada ou ganho de velocidade. Nome GeoRisk, prêmio já informado e relação com a demo OrbTalus preservados. |
| SEVEN Tools | Implementação profissional parcial de funcionalidades para propostas, diagnóstico e leads. Destaque 2 → 1 chamadas à API somente na inicialização autenticada para carregar usuário e empresa. Elegibilidade Seven Plus via ClickUp descrita por correspondência de e-mail, sem inferir posse do e-mail, volume ou produtividade. |
| Play Senac | Projeto em equipe; contribuição individual em frontend Angular, integração CRUD, formulários, carregamento/erro, RxJS e paginação. Regras de conflito/bloqueio atribuídas ao backend da equipe. Links públicos de frontend e backend disponíveis. |
| Mesa de Negócios | Landing publicada, Respondi adaptado ao dispositivo e carregamento sob demanda. Destaque −52,4% no arquivo JavaScript de entrada: 540,93 → 257,50 kB entre builds de 15/05/2026. Não é medida de velocidade, todos os chunks, tráfego ou conversão. |

Naka&Co incluída no início da trajetória: Desenvolvedor Full Stack, fev.–ago. de 2026, com contribuições concisas e stack do briefing. Quipux e Tokio Marine mantidos e renumerados, sem novos percentuais.

XYZ usado como realização, medida e método. Somente Mesa e Seven recebem destaque numérico; GeoRisk e Play usam resultados narrativos sem números artificiais. O estágio aparece nos cards e detalhes. Não houve rebranding, alteração da ordem, inclusão de quinto case ou mudança nas imagens conceituais.

## Evidências consultadas

- GeoRisk: investigação `georisk-orbtalus-2026-10-14`, `risk_calculator.py`, `ai_service.py` e handoff OrbTalus. Índice heurístico com três componentes; modelo original referido genericamente como OpenAI na copy.
- Seven: `01_Seven_Tools.md`, `05_Resultados_Cloudflare_Performance_e_Produto.md` e diff `9384717`, com getCurrentUser/getCurrentCompany consolidados em getCurrentSession.
- Mesa: `03_Contabilidade_CRM_e_Mesa.md`, `saidas-tecnicas.md` (builds L1288/L3054) e análise de código/repositório; valores e cálculo de 52,4% conferidos. A comparação parte de um build que já continha otimizações anteriores.
- Play: [integração CRUD](https://github.com/GuilhermeSerafim/play-senac/commit/fb82307), [paginação](https://github.com/GuilhermeSerafim/play-senac/commit/cc7cf8c) e [backend da equipe](https://github.com/GuilhermeSerafim/play-senac-api/commit/ffa72fb).

O usuário confirmou que Seven ficou incompleto e que não continua seu desenvolvimento. A UI explicita implementação parcial, sem deduzir se terceiros mantêm o produto. A referência independente de edição/organização/colocação do prêmio GeoRisk não foi encontrada nesta revisão: o relato existente foi preservado, sem acrescentar alegação de verificação independente. Visitas diárias da Mesa, ganho de bytes da imagem e métricas não medidas não foram adicionados à interface.

## Implementação e preservações

- `src/data.ts`: conteúdo, estágio, destaques, frontend Play e experiência.
- `src/components/ProjectResult.tsx` e `.css`: número, unidade e comparação juntos; sem dependências.
- `src/App.tsx` e `src/components/ProjectDialog.tsx`: contexto dos cards, resultado nos detalhes e links frontend/backend. Novos links usam o evento existente `project_code`, sem alterar contrato ou enviar URLs livres ao Analytics.
- `src/components/ProjectHealthStatus.tsx`: apenas prefixo de horário esclarecido para “Última verificação em”.

Destinos preservados: demos OrbTalus, Seven Tools e Play Senac em `guiler.chatgpt.site`, mais Mesa em `dennisnakamura.com/mesa-de-negocios`. Avisos sintéticos permanecem ao lado do acesso às demos. APIs, apps originais, demos, monitor, contas, configuração externa e currículos não foram alterados.

## Verificação

- `npm run build`: aprovado (TypeScript/Vite). Artefatos `index-DOc3t4yy.js` e `index-CHQwZ1Uz.css`.
- `npx vitest run tests/analytics tests/project-health --maxWorkers=1`: **153 testes aprovados em seis arquivos**.
- Browser Chromium em 1440, 390 e 320 px: quatro cards, dois destaques e 12 aberturas/fechamentos dos detalhes. Sem overflow, foco dentro do diálogo, Escape devolvendo foco ao acionador, abertura por Enter e fechamento pelo botão aprovados.
- Destinos e avisos das quatro demos/projeto, dois repositórios Play, quatro filtros, ordem da trajetória, preferências de privacidade e montagem única de Tech Text/Órbita conferidos.
- Nenhum `pageerror` ou request Google na sessão sem consentimento. Diff de `src/analytics`, `src/project-health`, `src/main.tsx`, TechText e dependências contra a base: vazio.
- Revisão independente de conteúdo e UI concluída sem bloqueadores.

Evidências no workspace raiz: `output/playwright/case-storytelling-qa.js`, `case-storytelling-qa-result.json`, capturas Mesa/Seven em três larguras, diálogo Play mobile, resultado Mesa e trajetória. Capturas incluem o estado real do feed nesse instante; não simulam disponibilidade dos produtos.

Limites: verificação do portfólio em Chromium, sem dispositivo físico. As aplicações originais e seus backends não foram executados. Nenhum evento de teste foi enviado ao GA. A confirmação operacional do agendamento do monitor é externa a esta revisão.

Preview: http://127.0.0.1:5195/#projetos ; trajetória em http://127.0.0.1:5195/#trajetoria .
