# Entradas do Instagram e Analytics

Correção de 19/10/2026, aplicada ao Linkhub e ao portfólio. Escopo: manter a medição consentida quando a URL contém `fbclid`, `igsh` ou `utm_content`. Conta, fluxo, ID `G-SR6CCMWW7D`, eventos, dimensões e configurações do Google permanecem iguais.

## Antes e depois

Antes, qualquer uma dessas três chaves impedia carregar o Google Analytics, inclusive com consentimento válido. Agora, a interface oferece a escolha normalmente e, após aceite novo ou já salvo, remove todas as ocorrências dessas chaves antes de criar `dataLayer`, `gtag` ou o script Google. Valores codificados nas chaves também são reconhecidos por `URLSearchParams`.

A limpeza usa `history.replaceState(history.state, "", url)`: preserva o estado da página, a âncora permitida e a campanha aprovada. O valor de `_gl` permanece, embora a serialização possa codificar caracteres da query de forma equivalente. Uma URL já limpa não é reescrita. Não ocorre recarga nem nova entrada no histórico.

Antes de aceitar e após recusar, não há limpeza nem coleta. Se a substituição falhar, não mudar a URL ou resultar em uma URL diferente da preparada, o cliente bloqueia a inicialização. Outras chaves, caminhos privados/admin, hashes desconhecidos, campanhas incompletas/duplicadas e linkers inválidos continuam bloqueados sem alterar a URL. Os guardas usados após a inicialização continuam estritos.

`utm_content` é descartado; não foi criada uma dimensão para seu conteúdo. Nenhum dos valores removidos é usado para inferir origem. Para atribuir a bio à campanha conhecida, use:

```text
https://iamguiler.vercel.app/?utm_source=instagram&utm_medium=social&utm_campaign=bio
```

Mantenha o link interno hub → portfólio sem essas UTMs. Consentimento continua independente em cada domínio.

## Validação

Os testes de regressão foram escritos antes da implementação e falharam pelo comportamento antigo; passaram após a correção. Cobrem aceite novo/salvo, recusa, ordem de limpeza, erros/no-op/divergência de replaceState, duplicatas, chaves codificadas, preservação de estado/hash/campanha/linker, entradas bloqueadas e reintrodução de parâmetros nos pontos de revalidação.

- Portfólio: **67/67 testes de Analytics** e build TypeScript/Vite aprovados.
- Linkhub: **304/304 testes da suíte completa** e build TypeScript/Vite aprovados.
- Chromium com hosts canônicos roteados aos builds locais: SDK real carregado com HTTP 200 e coleta HTTP 204 nos dois sites; casos combinados e repetidos/codificados aprovados.
- Nenhuma requisição Google antes do aceite, após recusa ou após retirada nos cenários observados. Estado, hash, campanha e linker preservados.
- URLs com chaves desconhecidas permaneceram sem coleta e intactas. No callback do admin do hub, a normalização preexistente para `/admin` continuou funcionando, com zero Google; isso foi distinguido de uma expectativa incorreta do teste de URL.
- Clique real do hub para o portfólio preservou o linker gerado pelo Google e a continuidade de navegador/sessão após a limpeza; os identificadores foram comparados em memória e registrados somente como resultados booleanos. Consentimento independente foi respeitado.
- As URLs, corpos e cabeçalhos Referer das requisições Google capturadas não continham os marcadores dos valores descartados. A campanha ficou `instagram/social/bio` e `campaign_content` vazio.
- **Limite da execução:** a troca de aba em headless não produziu `visibilityState=hidden`; o teste de navegação não registrou `pagehide`. Esses casos não comprovam a execução dos eventos automáticos de saída/ocultação. Não houve requisição adicional observada após fechar as abas, mas isso não equivale a cobertura do ciclo de saída.

Os testes usaram o ID real e podem aparecer como visitas de validação nos relatórios. Eles não representam audiência orgânica. A publicação e a checagem nos hosts de produção são registradas no relatório operacional desta correção.

## Limites

A validação em Chromium com URLs controladas não substitui um teste no navegador interno do aplicativo Instagram. Outros parâmetros inesperados ainda bloqueiam a coleta. A limpeza não recupera visitas antigas, não supera bloqueadores e não transforma intenção de contato em contato concluído.

Os guardas do cliente verificam a URL antes de iniciar, ao terminar a carga, antes de ações e nas transições de visibilidade/pageshow. Não há garantia de interceptar toda alteração de URL feita por outro script entre esses pontos e eventos automáticos internos do SDK.

Referências verificadas: [campos de configuração do Google Analytics](https://developers.google.com/analytics/devguides/collection/ga4/reference/config?hl=en) e [History.replaceState](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState).
