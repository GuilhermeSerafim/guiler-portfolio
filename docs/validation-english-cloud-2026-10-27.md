# Portfólio bilíngue — PageSpeed na nuvem, 27/10/2026

## Escopo e ambiente

Medição solicitada explicitamente pelo usuário após esclarecer que as notas do primeiro comparativo eram locais. As auditorias deste documento executam Lighthouse na infraestrutura do Google, pela API PageSpeed Insights, usando OAuth em memória do `gcloud` e o projeto de quota existente `neon-water-511016-k2`. Não foi criada infraestrutura de execução nem chave nova.

- Produção: `https://guiler.vercel.app/`.
- Preview PT: `https://guiler-c8aeqd1si-guilhermeserafims-projects.vercel.app/`.
- Preview EN: `https://guiler-c8aeqd1si-guilhermeserafims-projects.vercel.app/en/`.
- Deployment de preview: `dpl_3LYggVjPcwM5H4KNJ6udtANYPBwc`, pronto, sem promoção à produção.
- Produção preservada: `dpl_CvTs1tPvpFyJ9SeeNW25ZT9oA9KS`.
- Bundle do preview: `main-DDJIg9Bq.js`; SHA256 `114a769a93effd9f6e30f0d5d97e376d7a32cbb95857e072f4f002d670bd5710`, idêntico byte a byte ao build local validado.

Três solicitações por versão/dispositivo; quatro categorias (Performance, Accessibility, Best Practices, SEO); execução serial. A contagem de amostras considera `fetchTime`, ambiente e assets, descartando respostas repetidas em cache das estatísticas. Relatórios preservam versões, CPU informada, avisos, métricas e JSONs do Lighthouse. Não equivalem a dados de usuários reais ou FPS das animações.

## Controle do acesso ao preview

O projeto já exige autenticação nos previews. A primeira tentativa usou um link de compartilhamento limitado a esse deployment, com expiração de uma hora. Ele adicionou um redirecionamento 307 para estabelecer cookie de acesso. Essas medições foram preservadas como diagnóstico, mas **não são a comparação final**.

Para eliminar esse atraso, foi aplicada uma exceção temporária somente à URL do novo deployment. Ambos os idiomas foram conferidos com acesso anônimo HTTP 200, sem login, cookie ou redirecionamento, antes das solicitações finais. A proteção global do projeto permaneceu `all_except_custom_domains`; outros deployments e produção não foram alterados.

O preview mantém `X-Robots-Tag: noindex`, esperado para uma versão de revisão. Essa diferença deve ser separada da nota de performance e de eventuais diferenças de SEO. O HTML PT pode receber a integração de comentários da Vercel; a presença efetiva em requests das auditorias é conferida nos relatórios, sem inferir custo apenas do HTML.

Tokens OAuth e o segredo de compartilhamento não são escritos nos relatórios. O helper de preview remove ocorrências do segredo antes de persistir respostas do Google. Uma varredura final de 51 arquivos confirmou ausência desse segredo. Ao terminar, a exceção temporária e o compartilhamento foram revogados, e o arquivo local ignorado que continha o segredo foi removido. A API confirmou ausência dos dois escopos e o mesmo deployment de produção.

## Resultados

O lote final contém **18 respostas válidas e 16 auditorias distintas**; duas respostas repetidas em cache na produção foram excluídas das estatísticas. Cada idioma do preview tem três auditorias distintas por dispositivo. Medianas e intervalos de performance:

| Página | Mobile | Desktop |
| --- | ---: | ---: |
| Produção atual | 94,5 [93–96] | 99,5 [99–100] |
| Preview PT | 94 [93–94] | 100 [100–100] |
| Preview EN | 94 [94–96] | 99 [99–100] |

Lighthouse remoto 13.5.0. Todos os grupos: acessibilidade 96, boas práticas 100 e SEO 100. O achado de contraste já existe na produção. Nenhum erro de execução, aviso do Lighthouse, redirecionamento ou request à barra de comentários nos 12 relatórios diretos. URLs solicitadas e finais coincidem.

LCP mobile mediano: produção 2,405 s; PT 2,508 s; EN 2,627 s. TBT mobile mediano: produção 18 ms, ambos os previews 0 ms. No desktop, LCP 0,572 / 0,548 / 0,560 s, respectivamente. Os resultados mantêm a boa faixa de performance na nuvem. A diferença mobile de +222 ms de LCP do inglês frente à produção foi registrada, sem atribuição causal: versões, conteúdo e recursos do laboratório diferem, e a amostra é pequena. Não há dados CrUX suficientes para afirmar experiência real ou aprovação dos Core Web Vitals de visitantes.

Embora o preflight tenha recebido `noindex`, os relatórios diretos deram SEO 100. O SEO 92 do diagnóstico com compartilhamento vinha de `/robots.txt` recebendo HTML de autenticação; desapareceu com acesso direto. Não atribuir essa falha ao código do portfólio.

Evidências em `output/performance/2026-10-27-english-cloud/`, na raiz do workspace:

- `production/`: produção atual, 6 respostas válidas, 4 auditorias diferentes; mobile 93–96 (mediana 94,5), desktop 99–100 (mediana 99,5).
- `preview/`: diagnóstico inicial com redirecionamento de compartilhamento; não misturar com o lote direto.
- `preview-direct/`: lote final, acesso direto.
- `COMPARACAO.md` e `comparison.json`: comparação consolidada.
- `deployment-verification.json`: confirmação de target de produção preservado.
- `verification.json`: verificação de URLs, requests, runtime e ausência do segredo nos artefatos.
- `preview-access-revoked.json`: confirmação de revogação das duas permissões temporárias.

Essa comparação remota complementa e distingue os [testes locais anteriores](validation-english-2026-10-27.md). O baseline local de 59 não representa a nota atual da produção; o lote remoto contemporâneo confirmou mobile 93–96.
