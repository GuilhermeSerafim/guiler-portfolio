# Validação da integração — 19/10/2026

Revalidação da preparação de analytics na branch `feat/analytics-portfolio`, baseada em `17b4f07`.

- `npm run test:analytics`: **36 testes aprovados em quatro arquivos**, sem transporte real ao Google.
- `npm run build`: TypeScript e Vite 6.4.4 aprovados; 1.998 módulos transformados.
- Bundle: `index-C65G1lmP.js`, 352,66 kB / 114,04 kB gzip; CSS `index-BT8sIUlh.css`, 46,13 kB / 10,53 kB gzip.
- `git diff --check`: aprovado.
- Revisão independente: nenhuma divergência entre a base desta branch e o main limpo em `17b4f07`; integração preserva os conteúdos, projetos e efeitos existentes.

## Configuração e publicação

O usuário autorizou a configuração nos dois sites e o aceite dos termos do Google. A integração foi commitada, integrada e enviada ao main em `d472953`. A sessão Playwright `manager-ga4` permitiu configurar o painel após a falha da conexão nativa de Computer Use.

- Conta `Guiler` (`412582095`), propriedade `Guiler - Portfolio e Links` (`559695471`), fluxo Web `Linkhub e portfolio` (`16161526766`).
- ID público compartilhado: `G-SR6CCMWW7D`. Fuso São Paulo, moeda BRL.
- Medição otimizada e detecções opcionais automáticas da tag desligadas; Google signals desligado; personalização de anúncios permitida em zero regiões.
- `Allow user-provided data capabilities` desligado, preservando ocultação de e-mails em `Redact data`.
- Cross-domain com correspondência exata para os dois hosts. Seis dimensões no escopo Evento: `site_id`, `link_id`, `ui_location`, `project_id`, `contact_method`, `destination_id`.
- `contact_intent` marcado como evento principal, sem valor monetário, uma contagem por evento. Representa intenção de contato, não lead confirmado.
- Production com `VITE_GA_MEASUREMENT_ID=G-SR6CCMWW7D` e `VITE_ANALYTICS_ENABLED=true`, seguido de rebuild.
- Deploy do portfólio Ready: `dpl_6tbZvy7fbKm1Wigk5HpxbWZuAXGm`, [versão imutável](https://guiler-kvm8ul5ab-guilhermeserafims-projects.vercel.app), domínio [guiler.vercel.app](https://guiler.vercel.app). Bundle esperado `index-CbqlftIK.js`.
- Deploy do hub Ready: `dpl_AK79TNCMwd31FaaxaZjDVtNbmLGm`, [versão imutável](https://iamguiler-rlhqqn1du-guilhermeserafims-projects.vercel.app), domínio [iamguiler.vercel.app](https://iamguiler.vercel.app).

## Validação em produção

O QA visual da versão com coleta desligada foi repetido em ambos os sites em 19/10: renderização, preferências, âncora Projetos e diálogo GeoRisk aprovados; nenhuma requisição Google observada.

Com os deploys ativos, o QA confirmou zero requisições Google antes do consentimento e após recusa nos dois sites. Depois do aceite pela interface, cada documento enviou uma `page_view`, com resposta HTTP 204, ID real e `site_id` correto.

O clique nativo hub → Projetos abriu o portfólio em `#projetos` com `_gl`. A inspeção de rede confirmou o mesmo identificador de navegador e sessão nos dois hosts, após consentimentos independentes. A URL de página enviada ficou canônica, sem `_gl` ou hash; o referrer ficou vazio nesse trajeto, conforme `noreferrer`.

No Chrome visível, [Tempo real desta propriedade](https://analytics.google.com/analytics/web/?pli=1#/a412582095p559695471/realtime/overview?params=_u..nav%3Dmaui) confirmou às 16:41–16:43 BRT:

- 1 usuário ativo, 1 visualização de **Guiler | Links** e 1 de **Guiler | Portfólio**.
- `page_view: 2`, `link_click: 1`, `project_open: 1`, `contact_intent: 1`, `session_start: 1`, `first_visit: 1`.
- Detalhamento `page_view → site_id`: `linkhub: 1` e `portfolio: 1`.
- `contact_intent` também presente no cartão de eventos principais, após o botão real **Copiar e-mail**.

Retirar autorização no portfólio recarregou ambas as abas do mesmo site. Em ambas, `gtag` ficou ausente e não houve nova requisição Google durante a revogação. O hub preservou sua autorização independente.

Esses são números do teste. Os relatórios históricos e dimensões novas ainda passam pelo processamento normal do Google; não há dados retroativos. As evidências do workspace estão em `docs/linktree-research/ga4-realtime-2026-10-19.md`, na raiz que contém os dois projetos.

O QA complementar confirmou os cliques reais em **Abrir projeto**, **Baixar currículo**, repositório Play Senac e Instagram do hub. Foram 14 eventos em 13 POSTs HTTP 204 (um lote agrupou dois eventos), cinco cargas da tag HTTP 200 e uma pageview por cada um dos cinco documentos. Não houve duplicação por ação/documento no recorte examinado. Valores de e-mail copiado, texto livre, destinos externos, `_gl` e hash não apareceram nos payloads examinados.

A retirada em duas abas também passou no hub, sem nova requisição Google. Em um contexto isolado adicional, foram conferidos apenas nomes de cookies: `_ga` e `_ga_SR6CCMWW7D` estavam presentes após aceite em ambos os sites; após a retirada e recarga, a lista ficou vazia e `gtag` ausente. Valores de cookies não foram registrados.

A matriz de entradas passou em **16/16 casos**: `fbclid`, `igsh`, `utm_content`, `/admin` e `/admin/auth/callback` sem coleta em ambos os hosts (as rotas administrativas do portfólio retornam 404); os três trios UTM permitidos produziram uma pageview HTTP 204 por caso com origem, mídia e campanha corretas. Mesmo com consentimento salvo, parâmetros desconhecidos bloqueiam a coleta completa daquela entrada, conforme a política existente.

Relatórios detalhados no workspace: `docs/linktree-research/analytics-live-qa-2026-10-19.md` e `docs/linktree-research/analytics-entry-qa-2026-10-19.md`. Sessões públicas isoladas encerradas; sessão autenticada do Analytics preservada.

Limites: a entrada pelo aplicativo Instagram e todos os navegadores/dispositivos não foram testados; os 180 dias de validade não foram aguardados. Previews/localhost são bloqueados pelo código e testes locais. O QA real cobriu o escopo acima e não transforma intenção de contato em lead confirmado. Não há gráficos GA no admin do hub, nem recuperação de tráfego anterior à ativação.
