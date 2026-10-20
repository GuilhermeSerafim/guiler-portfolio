# Personalidade no portfólio — validação local

Data: 20/10/2026. Escopo escolhido pelo usuário: **portfólio guiler primeiro**.

## Comparação disponível

- Base: http://127.0.0.1:5190/
- Nova versão: http://127.0.0.1:5191/
- Caderno de curiosidades: http://127.0.0.1:5191/#sobre
- Branch isolada: `feat/personality-details`.
- Base Git: `f3b66aadfe9ae087cb94611eb8fac1821fd4580c`.
- Worktree: `output/portfolio-variants/curiosity-lab`, relativo ao workspace.
- Entrega exclusivamente local, sem push, merge ou deploy.

Recarregar o hero para ver a sequência de meteoros. Ela termina em aproximadamente 4,3 segundos; os pontos estáticos permanecem. As abas do caderno reproduzem movimentos breves ao serem selecionadas.

## Pesquisa e decisão

Três pesquisas independentes cobriram portfólios, componentes e direção de arte. Os relatórios estão em `portfolio-references.md`, `component-references.md` e `art-direction.md`.

As referências orientaram uma evolução pequena da identidade existente: papel claro, tinta azul, fotos reais e conteúdo profissional em primeiro plano. Meteors tem exemplos diretos em Magic UI e Aceternity; Lightfall, do React Bits, é apenas uma possibilidade para a lembrança do usuário, sem identificação confirmada. A implementação usa CSS/SVG autoral, evitando adicionar motores gráficos para detalhes pequenos.

| Antes | Depois |
| --- | --- |
| Campo magnético de pontos no hero | Três meteoros finitos e estrelas esparsas; dois rastros em telas pequenas |
| Sticker “Sempre construindo” em Sobre | Caderno com Cosmos, Quadra e Ideias, ilustrações e textos pessoais |
| Seta convencional no CTA | Trajetória desenhada no hover/foco e sublinhado breve em “impacto” |

Nenhuma dependência adicionada. Fotos, dados de projetos, destinos e código de Analytics não foram alterados.

## Verificações executadas

- `npm run build` (TypeScript e Vite): aprovado novamente após a última correção de CSS.
- Suíte de Analytics antes e depois das mudanças: **67 testes aprovados, em quatro arquivos**.
- Navegador Chromium, larguras **320, 390, 768 e 1440 px**: sem overflow horizontal; painel do caderno com altura estável entre as três abas em cada largura.
- Teclado: setas, Home e End selecionam/focam abas; os nomes e vínculos do painel correspondem à seleção.
- Toque em contexto móvel emulado: menu, navegação para Sobre, seleção de Quadra e Ideias.
- Preferência de movimento reduzido alterada durante a sessão: meteoros, sublinhado, seta e animações do caderno ficam sem animação.
- Meteoros com execução finita; saída do hero suspende sua execução por visibilidade.
- CTA “Explorar projetos” e entrada direta em `#projetos`: seção alinhada corretamente.
- Filtros de projetos: Landing page mostra um projeto; Todos restaura quatro.
- Modal de GeoRisk: abertura, Escape para fechar e devolução do foco ao botão.
- QA final: nenhum `pageerror` e nenhuma requisição ao Google Analytics/Tag Manager em localhost.
- Revisão independente concluída. Encontrou conflito de especificidade no tempo de transição do botão; a reprodução mostrou `0.5s`. Após a correção, o estilo computado confirmou `0.22s`, ou `0s` com movimento reduzido.
- `git diff --check`: aprovado.

## Commits locais

- `b1dc25a` — `docs(design): planejar detalhes pessoais do portfolio`
- `908169d` — `feat(hero): adicionar meteoros ao fundo do portfolio`
- `8a0df0b` — `feat(sobre): adicionar caderno de curiosidades`
- `106c88b` — `feat(ui): refinar gestos com tracos de trajetoria`

## Evidências de navegador

Arquivos locais em `output/playwright`, relativo ao workspace:

- `personality-before-hero.png`
- `personality-final-hero.png`
- `personality-final-about.png`
- `personality-about-mobile.png`
- `personality-final-touch.png`
- `personality-notebook-cosmos.png`, `personality-notebook-quadra.png`, `personality-notebook-ideias.png`
- Roteiros: `personality-hero-qa.js`, `personality-notebook-qa.js`, `personality-final-qa.js`, `personality-duration-qa.js`.

As capturas estáticas não demonstram movimento; usar os links locais para avaliar as animações.

## Limites

O QA móvel foi emulado em Chromium, sem teste em aparelho físico ou Safari. A suspensão por aba oculta existe no componente e foi revisada no código, mas não foi exercitada nesta rodada de navegador. Não houve nova auditoria da propriedade GA4 nem mudanças na publicação.
