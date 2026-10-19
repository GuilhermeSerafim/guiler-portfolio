# Validação da integração — 19/10/2026

Revalidação da preparação de analytics na branch `feat/analytics-portfolio`, baseada em `17b4f07`.

- `npm run test:analytics`: **36 testes aprovados em quatro arquivos**, sem transporte real ao Google.
- `npm run build`: TypeScript e Vite 6.4.4 aprovados; 1.998 módulos transformados.
- Bundle: `index-C65G1lmP.js`, 352,66 kB / 114,04 kB gzip; CSS `index-BT8sIUlh.css`, 46,13 kB / 10,53 kB gzip.
- `git diff --check`: aprovado.
- Revisão independente: nenhuma divergência entre a base desta branch e o main limpo em `17b4f07`; integração preserva os conteúdos, projetos e efeitos existentes.

O usuário autorizou configurar o Google Analytics tanto no portfólio quanto no hub. A coleta permanece sem ativação: falta obter o ID real, verificar propriedade/fluxo, configurar produção e publicar. A versão preparada é um checkpoint de código, não evidência de métricas recebidas.

Não foi repetido QA visual nesta data: o Computer Use desta conversa está sem conexão. A validação visual anterior está registrada em [13/10/2026](validation-analytics-2026-10-13.md). A coordenação com a sessão que operou o navegador continua separadamente.

Antes de declarar a ativação concluída, executar o roteiro de [analytics](analytics.md): rede antes/depois do consentimento, eventos reais e parâmetros automáticos, retirada e duas abas, fluxo entre domínios, entrada pelo Instagram e recebimento no Tempo real do GA4. Previews/localhost não coletam por projeto; consultas extras desconhecidas também bloqueiam a tag.
