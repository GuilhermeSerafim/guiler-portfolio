# guiler-portfolio

Meu portfólio de engenharia de software, com cases que explicam problemas, contribuição pessoal, decisões e limites. Além da apresentação em português e inglês, o projeto implementa leitura de um feed de saúde das demos e analytics condicionado a consentimento.

## Demonstração e imagens

[Abrir o portfólio](https://guiler.vercel.app) · [Hub pessoal](https://iamguiler.vercel.app). Os cases distinguem aplicações originais e demonstrações sintéticas.

## Minha contribuição e autoria

Desenvolvo a apresentação e a implementação deste portfólio. Em cada case, separo minha contribuição do trabalho realizado em equipe. Os cases comerciais não implicam abertura de seus códigos-fonte.

## Arquitetura e implementação

O conteúdo dos cases fica separado da interface em `src/data.ts`. O monitor de saúde aplica limite de payload, timeout, cancelamento e validação; observações expiradas produzem estado desconhecido. O analytics depende de habilitação, domínio esperado, identificador válido e consentimento.

Veja o [monitor](src/project-health/monitor.ts) e seus [testes](tests/project-health/monitor.test.ts).

## Instalação e configuração

Requer Node.js 22 e npm. Consulte `.env.example` para a configuração local e mantenha `VITE_ANALYTICS_ENABLED=false` durante a avaliação. O contrato e a configuração de analytics estão em [docs/analytics.md](docs/analytics.md).

Os blocos abaixo partem da raiz do repositório. Use as versões e variáveis indicadas; não coloque credenciais no código ou no README.

```text
npm ci
npm run dev
```

Para conferir a versão de produção, em outro terminal na raiz:

```text
npm run build
npm run preview
```

## Testes e verificações

Os comandos abaixo documentam a suíte existente; não representam uma execução nova nem um resultado de aprovação.

```text
npm run test:analytics
npx vitest run tests/project-health tests/i18n --maxWorkers=1
```

O comando Vitest é derivado da configuração/dependência existente; não é um script agregado do package.json.

## Limites atuais

- O script test:analytics não agrega os testes de health e i18n; execute-os separadamente.
- Uma demo sintética permite explorar interfaces e decisões, mas não comprova operação do produto original.
- Resultados quantitativos de cases precisam conservar data, contexto e evidências; não são resultados garantidos.

<details>
<summary>Referência de uso e documentação complementar</summary>

## Mapa de edição e referências

- `src/data.ts`: projetos, tecnologias, links e experiências. `tags` destaca tecnologias principais no cartão; `technologies` permite exibir a lista completa no modal.
- `src/App.tsx`: seções, navegação, filtros e contato.
- `src/styles.css`: identidade visual e layouts responsivos.
- `src/components/Interactions.tsx`: retrato Tilted Card e CTA Magnetic adaptados do React Bits; Reveal próprio.
- `src/components/ProjectVisual.tsx`: ilustrações vetoriais de GeoRisk, Play Senac e Mesa de Negócios, identificadas como visuais conceituais.
- `src/components/SevenToolsVisual.tsx`: capa conceitual do SEVEN Tools, com as ferramentas de propostas, diagnóstico comercial e qualificação de leads conectadas ao hub.
- `src/components/ProjectDialog.tsx`: detalhes em diálogo nativo, com cabeçalho fixo durante a rolagem, navegação por teclado e leitura em tela cheia no celular.
- `public/images/`: fotos fornecidas e captura da landing page publicada, otimizadas para WebP.
- `public/GuilhermeSerafim_Fullstack.pdf`: currículo original para download.

`library-research.txt` documenta a pesquisa das cinco bibliotecas, componentes escolhidos, adaptações, inspirações e dependências. `THIRD-PARTY-NOTICES.txt` preserva a licença do React Bits. R3F foi pesquisado e não integra o runtime desta versão.

O hero usa uma malha magnética de pontos que reage ao cursor e fica estática em dispositivos de toque ou com movimento reduzido. O parâmetro `?visual=original` permite comparar o layout sem o efeito. Detalhes em [docs/magnetic-field.md](docs/magnetic-field.md).

## Build e configuração versionada

`npm run build` verifica TypeScript e gera o site estático em `dist/`. `npm run preview` serve esse build localmente.

A configuração versionada em `vercel.json` declara framework Vite, build `npm run build` e saída `dist/`. Consulte também `.vercelignore` antes de preparar uma publicação.

</details>

## Avisos de terceiros

Consulte [THIRD-PARTY-NOTICES.txt](THIRD-PARTY-NOTICES.txt) para os avisos de componentes de terceiros.
