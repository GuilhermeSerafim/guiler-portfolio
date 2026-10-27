# Versão em inglês — validação local de 27/10/2026

> Complemento: a pedido do usuário, foi executada uma [validação na nuvem com preview e produção](validation-english-cloud-2026-10-27.md). As notas locais abaixo não representam o desempenho atual do site publicado no PageSpeed.

## Entrega

- Português em `/`; inglês em `/en/`, com acesso direto a `/en` e `/en/index.html` também em inglês.
- Seletor PT/EN no cabeçalho, com idioma atual e nomes acessíveis. Mantém hash e query ao navegar; lê a URL atual no clique para não restaurar ruído removido pelo consentimento.
- Tradução da página, quatro cases, trajetória, filtros, modais, gráficos, exemplos interativos, catálogo, fotografias, privacidade e estados de interação.
- Fatos, métricas, datas, nomes próprios, tecnologias, IDs, links e demos preservados. Currículo original explicitamente identificado como PDF em português.
- Dois HTMLs estáticos com `lang`, título, descrição, Open Graph, canonical e hreflang próprios. Sem biblioteca de tradução, autodetecção ou armazenamento de idioma.

Worktree `output/portfolio-variants/english`, branch `feat/portfolio-english-2026-10-27`, base `7bf299c`. Os arquivos concorrentes do worktree `entry-flow` foram preservados. A entrega inicial foi local. Após pedido explícito de teste na nuvem, foi criado um deployment de preview, sem promover a produção; veja a validação remota complementar.

## Integração

Build de produção e TypeScript passaram. **184 testes, 9 arquivos, passaram**: política e transporte de Analytics, consentimento, handlers existentes, entradas em inglês, troca de idioma, identidade/destinos dos projetos e renderização de privacidade/currículo. O baseline tem 155 testes aprovados.

Playwright com Chromium real verificou desktop 1350 px, tablet 720 px e mobile 390/320 px. Cabeçalho conferido também em 701/760 px. Não houve overflow nem sobreposição. Foram verificados:

- filtros e quatro modais, navegação por Escape e retorno de foco;
- URLs diretas e recarga, PT↔EN preservando `#projetos` e campanha LinkedIn;
- download efetivo do PDF, MIME/assinatura e SHA256 idêntico ao original;
- cópia real de e-mail e feedback;
- preferências de privacidade em inglês, foco e fechamento;
- exemplos de troca de integração e falha/recuperação de servidor em inglês;
- metadados, ausência de erro de execução e bloqueio de chamadas Google em localhost.

O rebuild final confirmou o aria-label inglês do troféu, `/en/index.html` com `lang=en` e os nomes acessíveis do seletor com as siglas visíveis. A troca PT↔EN com `#projetos` foi repetida no bundle final `main-DDJIg9Bq.js`; 184 testes passaram novamente.

SDK real GA4: origem canônica simulada no navegador e conteúdo servido pelo preview local. Script Google real, todas as coletas respondidas pelo interceptador local (nenhum evento de teste enviado à propriedade). Antes do aceite e após recusa: zero chamadas Google. Após aceite: uma page_view EN; após trocar para PT: uma page_view PT. URLs/títulos/site_id/campanha corretos; `igsh` e `utm_content` fictícios ausentes dos payloads inspecionados e da URL após limpeza. Essa evidência não equivale a implantação, recebimento em Tempo real, nem teste dentro do app Instagram.

## Evidências

Na raiz do workspace, `output/playwright/portfolio-english/` contém o relatório completo de QA, capturas desktop/tablet/mobile, scripts reproduzíveis, resultados de routing/download/engenharia e `analytics-sdk-result.log`. `output/performance/2026-10-27-english/` contém logs de build/testes, configuração do benchmark e relatórios Lighthouse. São artefatos locais de revisão, fora do conteúdo público.

## Performance

Mesmo conjunto de dependências e assets. JavaScript principal final: 474.040 → 491.589 bytes (+17.549; +3,70%); gzip: 158.610 → 165.054 bytes (+6.444; +4,06%). Medição de gzip com a mesma configuração nos dois arquivos. As duas línguas compartilham o bundle; não há segunda requisição de dicionário nem serviço externo de tradução.

Lighthouse 12.8.2, 12 relatórios válidos, execuções seriais com perfil limpo e ordem alternada, duas rodadas por versão/dispositivo. Notas de performance abaixo: mediana [mínimo–máximo].

| Versão | Desktop | Mobile |
| --- | ---: | ---: |
| Baseline PT | 88 [82–94] | 59 [54–64] |
| Nova PT | 87 [87–87] | 58,5 [55–62] |
| Nova EN | 84,5 [81–88] | 66,5 [65–68] |

No desktop, LCP mediano: baseline 764 ms, PT 772 ms e EN 793 ms. No mobile: 3.724 ms, 3.690 ms e 3.289 ms. CLS abaixo de 0,002 em todos os cenários. O TBT variou consideravelmente, inclusive no baseline; quatro rodadas mobile emitiram aviso de CPU mais lenta que a esperada. As faixas e a amostra pequena não sustentam uma conclusão de regressão consistente ou ganho garantido. Não são resultados do PageSpeed Insights nem dados reais de usuários.

Acessibilidade 96, boas práticas 100 e SEO 92 em todas as rodadas. Contraste já falhava no baseline, nas imagens conceituais dos projetos. O SEO local aponta `/robots.txt` recebendo o fallback HTML do preview, tanto no baseline quanto no novo build; não é evidência de comportamento em produção. A auditoria não pontuada de nome acessível encontrou o novo seletor PT sem a sigla no aria-label; os links foram ajustados para `PT — Português` e `EN — English`, com verificação pontual após rebuild.

Relatórios completos: `output/performance/2026-10-27-english/lighthouse-2026-10-27T18-16-41-673Z/summary.md`, `summary.json` e 12 JSONs originais. Esse benchmark usou `main-CyaGskbf.js`; o ajuste posterior muda somente os dois nomes acessíveis do seletor, sem alteração visual ou de lógica. A diferença é registrada para não apresentar a medição anterior como uma execução no hash final.

A auditoria direcionada final (`language-switcher-audit-2026-10-27T18-25-31-961Z/summary.json`) confirmou ausência de achados no seletor em PT e EN. Restou apenas o `hero-award-link` preexistente, também presente no baseline. O bundle final tem 14 bytes a mais, tanto bruto quanto gzip, que o build usado nas 12 medições. Não foi repetido o benchmark completo por uma alteração restrita a dois nomes acessíveis.

## Limites

Testes em Chromium de desktop com viewports móveis; não substituem aparelhos físicos, outros navegadores ou auditoria completa com leitor de tela. Destinos externos foram preservados e conferidos, sem retestar o funcionamento dos outros produtos. A versão em inglês não traduz o arquivo PDF do currículo.
