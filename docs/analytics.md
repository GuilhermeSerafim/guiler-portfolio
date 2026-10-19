# Analytics do portfólio

Estado em 13/10/2026: implementação local preparada, coleta **desativada**. Não há ID Google autorizado, publicação, propriedade configurada ou coleta real comprovada. O teste usa somente transporte fake, sem enviar dados ao Google. O hub mantém uma cópia do mesmo núcleo; alterações de contrato/política precisam ser aplicadas aos dois.

## Configuração

Copie `.env.example` para uma configuração local se necessário. `VITE_ANALYTICS_ENABLED=false` e ID vazio são os padrões seguros. Ativação futura exige `true` literal, ID público válido `G-…`, hostname exato `guiler.vercel.app`, URL de entrada permitida e consentimento válido. Não colocar API secret no frontend. Localhost, previews e configurações de outro site nunca carregam a tag; não há override por query ou modo debug.

A inicialização ocorre uma vez em `main.tsx`, fora dos efeitos React. A página e os links funcionam sem configuração, sem consentimento, com storage negado ou bloqueador. Ações antes do aceite e durante o carregamento são descartadas. A Google tag só é inserida depois do aceite; nenhum ping de modo avançado é usado.

## Contrato v1

Todo evento usa `site_id=portfolio`, `schema_version=1` e `ui_location` de enumeração fixa. O serializador rejeita valores inesperados e descarta propriedades extras, inclusive PII. Não derivar IDs de títulos, índices ou hrefs. Uma ativação gera somente seu evento semântico.

| Evento | Controles e parâmetros |
| --- | --- |
| `page_view` | Uma por documento após consentimento; `ui_location=page`, URL/referrer sanitizados, título fixo |
| `project_open` | Capa, título ou seta; `project_id=georisk|seven-tools|playsenac|mesa`, posição `project_cover|project_title|project_details` |
| `project_visit` | Demo do modal; `project_id`, `ui_location=project_dialog` |
| `link_click` | GitHub (`projects_footer|contact`), LinkedIn (`about|contact`), código público (`project_card|project_dialog`); `link_id`, `destination_id`, `project_id` somente para código de projeto |
| `resume_download` | Currículo em `hero|contact`, `asset_id=resume_fullstack` |
| `contact_intent` | Mailto em `contact_arrow|contact_email`, método `email_open`; cópia em `contact_copy`, método `email_copy`, somente após Clipboard concluir |

Âncoras (inclusive “Vamos conversar”), filtros e fechamento do modal não são eventos/pageviews. A cópia negada não conta sucesso. Eventos indicam ações, não comprovam leitura, arquivo salvo, mensagem enviada, reunião ou lead recebido.

## Privacidade e sanitização

O convite é não modal e aparece apenas se a coleta está configurada e a decisão é desconhecida. Aceitar e recusar têm apresentação equivalente; “Agora não” dispensa o aviso nesta montagem. Preferências continuam no rodapé, inclusive com coleta OFF. Uma autorização salva pode ser retirada mesmo numa entrada bloqueada.

Storage local: `guiler.analytics-consent.v1`, `{version:1,analytics:"granted"|"denied",updatedAt:number}`, válido por 180 dias. Dados inválidos, futuros ou expirados voltam a desconhecido. Falha de storage mantém a escolha em memória. Domínios mantêm decisões independentes; `_gl` não transmite consentimento. Abas do mesmo origin observam retirada via `storage`. Timer com limite seguro e revalidação em `pageshow`/`visibilitychange` desativam uma autorização expirada mesmo sem novo clique.

Na retirada, o cliente bloqueia imediatamente, define `ga-disable-<ID>`, remove comandos pendentes e script, tenta excluir cookies GA próprios no path `/` e recarrega quando a recusa foi persistida e havia runtime. Sem persistência, mantém a recusa em memória e não recarrega em ciclo. O runtime retirado não é reusado; novo aceite persistido exige recarga. Dados já enviados não são apagados pela retirada. Navegadores podem bloquear/excluir cookies de formas próprias.

Google Analytics usa identificadores pseudônimos de navegador/sessão; a coleta não é anônima. Publicidade fica negada (`ad_storage`, `ad_user_data`, `ad_personalization`), Google Signals e personalização desabilitados. Cookies têm `cookie_expires=15552000` (180 dias), `cookie_update=false` e domínio exato, sujeitos a limites menores do navegador.

Página usa origem/caminho canônicos, sem hash e sem dados livres. Referrer usa somente origem HTTP(S), sem credenciais/caminho/query/hash; título é fixo. `set` e `config` também recebem esse contexto seguro e campos de campanha controlados antes de inserir a tag, pois eventos automáticos precisam da mesma proteção.

Campanhas aceitas são trios completos: `instagram/social/bio`, `linkedin/social/portfolio`, `qr/offline/palestra`. Query, pathname e hash desconhecidos bloqueiam a **ativação inteira**, preservando a URL original e a navegação. Parâmetros de redes sociais como `fbclid` podem, portanto, impedir coleta. `_gl` é preservado na navegação, limitado em tamanho/formato na entrada e omitido dos payloads manuais; esse filtro não valida identidade nem consentimento. Relaxar essas restrições exige inspeção dos payloads completos da tag real, incluindo campos automáticos. Não aplicar UTMs ao trajeto interno hub → portfólio.

## Ativação futura e operação

1. Usuário fornece ID de uma propriedade GA4 e fluxo Web. Usar o mesmo ID no hub e portfólio, fuso São Paulo, sem publicidade/Signals. Desativar toda a medição otimizada, inclusive histórico, para evitar cliques/downloads/pageviews concorrentes.
2. Configurar cross-domain com correspondência exata de `iamguiler.vercel.app` e `guiler.vercel.app`. Preservar links nativos e `_gl`. `noreferrer` limita o referrer; a continuidade precisa de consentimento separado em ambos e validação real.
3. Criar dimensões de evento `site_id`, `link_id`, `ui_location`, `project_id`, `contact_method`, `destination_id`. Marcar `contact_intent` como evento principal. Relatórios são intenção, não leads confirmados.
4. Ativar env somente no ambiente de produção escolhido e executar rebuild/deploy autorizado. A configuração do painel sozinha não ativa o build.
5. Validar rede antes/recusa (zero Google), depois do aceite (uma pageview), retirada com tag carregando, duas abas e saída/ocultação da aba. Inspecionar todos os campos de `first_visit`, `session_start`, `user_engagement` e eventos manuais, inclusive campanhas maliciosas e linker. Realtime/DebugView e travessia entre os dois hosts continuam pendentes até acesso/ID reais.
6. Registrar separadamente preparado, configurado, publicado e coletando. Rollback: flag `false` + rebuild/redeploy, confirmando navegação. Não declarar coleta a partir de mocks, nem recuperar tráfego nunca medido.

## Verificação local

`npm ci`, `npm run test:analytics`, `npm run build`, `npm audit`.

Os testes exercitam validação de política, payloads do cliente com navegador fake, expiração, falha de storage, revogação entre abas/race de carregamento e handlers reais do JSX. O harness de handlers substitui hooks e transporte; não substitui QA de teclado/foco/renderização num navegador. Não há tag real nos testes.

Vitest 4.1.11 é a versão dev fixa: substituiu 3.2.7 prevista inicialmente porque o audit encontrou vulnerabilidades sem patch nessa linha. Vite/React não foram migrados. O npm 10.9.3 encontrou um erro de resolução de peers no upgrade; `--legacy-peer-deps` foi usado só nessa instalação. O lock é verificado com `npm ci` normal, sem configuração permanente de bypass.
