# Estudo local — tecnologias com ícones e movimento

## Pedido e escopo

Pesquisar modelos em bibliotecas e portfólios, propor alternativas e testá-las localmente. Estes são **protótipos para comparação**, não um design final aprovado. Não houve push nem deploy deste estudo.

Base: commit `79a515c`, portfólio React 18.3 / Vite 6 / Motion 12. A seção atual agrupa 12 tecnologias em Interface, Sistemas e Dados & IA, sem ícones. As propostas substituem somente essa apresentação nas rotas locais de estudo. Mantêm as tecnologias atuais, tipografia, creme/preto/azul e desenho do Einstein à direita. Não atribuem níveis de proficiência nem acrescentam competências.

## Referências pesquisadas

| Fonte primária | Evidência e aproveitamento |
| --- | --- |
| [React Bits — Logo Loop](https://reactbits.dev/animations/logo-loop) / [código](https://github.com/DavidHDev/react-bits/blob/main/src/content/Animations/LogoLoop/LogoLoop.jsx) | Loop de logos, fade nas extremidades e cópias ocultas de leitores de tela. Inspiração para A e B; código do estudo escrito para o projeto, sem copiar o componente. |
| [React Bits — Scroll Velocity](https://reactbits.dev/text-animations/scroll-velocity) | Reação do movimento à rolagem. C usa apenas deslocamento limitado a ±12 px, sem velocidade autônoma ou distorção. |
| [Magic UI — Marquee](https://magicui.design/docs/components/marquee) | Repetição horizontal com CSS e opção de direção reversa. Referência estrutural; não instalamos Tailwind nem o componente. |
| [Aceternity — Infinite Moving Cards](https://ui.aceternity.com/components/infinite-moving-cards) | Cards contínuos configuráveis. Descartado o peso visual de cartões grandes para esta seção. |
| [21st — Marquee Logo Scroller](https://21st.dev/@ravikatiyar162/components/marquee-logo-scroller) | Referência secundária de sequência de SVGs; dependências/licença específica não verificadas, nenhum código reutilizado. |
| [Chánh Đại](https://chanhdai.com/#stack) / [código](https://github.com/ncdai/chanhdai.com/blob/main/src/features/portfolio/components/tech-stack.tsx) | Categorias numeradas, ícones e nomes, organização editorial. Principal referência de hierarquia para B/C. |
| [Pratham Periwal](https://prathamperiwal.dev/) / [código](https://github.com/PrathamPeriwal/Portfolio/blob/main/src/pages/SkillsPhilosophy.tsx) | Rótulos por categoria e marquee ao hover no código. Aproveitado o rótulo fixo; a informação no protótipo não depende de hover. |
| [Abu Said](https://abusaid.netlify.app/) / [código](https://github.com/said7388/developer-portfolio/blob/main/app/components/homepage/skills/index.jsx) | Cards com ícone e nome em react-fast-marquee. Inspiração de comportamento, com densidade e ritmo adaptados. |
| [M. Kashan Ashraf](https://itzkashan.dev/#stack) / [código](https://github.com/Kashan-2912/modern-portfolio/blob/main/src/features/portfolio/components/tech-stack.tsx) | Catálogo compacto de ícones. Mantivemos nomes visíveis para quem não reconhece todos os símbolos. |

Estrutura e comportamento dos portfólios foram conferidos em código público. Pratham e Abu Said não tiveram o deploy observado ao vivo; não se presume correspondência exata entre o site publicado e a branch consultada. A pesquisa de bibliotecas e de portfólios foi dividida entre agentes independentes.

## Três propostas

| Proposta | URL local | Benefício / compromisso |
| --- | --- | --- |
| A — Faixa contínua | http://127.0.0.1:5195/__preview/tecnologias/a#tecnologias | Uma única faixa, nomes maiores, menor altura. Leitura menos imediata de quais ferramentas pertencem a cada área. |
| B — Trilhos por área | http://127.0.0.1:5195/__preview/tecnologias/b#tecnologias | Categorias fixas e três trilhos; Sistemas segue no sentido oposto. Melhor equilíbrio proposto entre movimento e organização; ocupa mais altura que A. |
| C — Catálogo em movimento | http://127.0.0.1:5195/__preview/tecnologias/c#tecnologias | Todas as tecnologias disponíveis sem esperar o loop; deslocamento mínimo ligado ao scroll. Mais tranquilo e legível, menos próximo da barra contínua pedida. |

Recomendação inicial: **B**, a confirmar pela escolha do usuário. A interface de comparação fica em uma barra no topo das rotas de estudo. O link Atual leva ao site local sem substituição.

## Implementação experimental

- `src/preview/TechnologyPreview.tsx` e `.css`: protótipos isolados. Montagem temporária por portal na posição da seção atual, preservando `App.tsx`.
- `src/main.tsx`: carregamento condicionado a `import.meta.env.DEV` e às três rotas explícitas. O build de produção elimina os protótipos; não há impacto no bundle publicado.
- 12 SVGs locais, sem fonte de ícones ou CDN em runtime: Devicon v2.17.0 (11) e Simple Icons 13.0.0 (LangChain). Origem, hashes e licenças em `src/preview/technology-assets/SOURCE-NOTES.md`.
- Nenhuma dependência nova. Símbolos monocromáticos, com cores originais no hover. Texto continua visível.
- A/B: CSS `transform`, grupos de largura idêntica, duplicatas com `aria-hidden`, nenhum elemento focável duplicado, suspensão fora da área visível.
- “Ver todas” substitui os trilhos por uma lista estática; permite leitura completa e interrompe o movimento sem exigir hover. “Ver em movimento” restaura o loop.
- `prefers-reduced-motion`: lista estática automática, nenhum deslocamento em C. Este tratamento segue a orientação de [Pause, Stop, Hide do W3C](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).

## Validação

Build TypeScript/Vite concluído. JS `index-B5T2Dzbd.js` e CSS `index-BK39wZpG.css` permaneceram idênticos ao build local da versão aprovada anterior: protótipos e SVGs não foram incluídos na saída de produção.

QA final aprovado em sessão dedicada `technology-final`, com `output/playwright/technology-studies-qa.js` no workspace raiz:

- A/B/C em 320, 390, 768 e 1440 px: sem overflow, sem colisão entre título e Einstein, ícones carregados.
- Grupos dos loops têm exatamente um terço da largura da faixa completa, preservando a continuidade entre cópias.
- “Ver todas” mostra as 12 tecnologias sem corte a 320 px e remove as animações; retorno ao movimento funciona. Trilhos param fora da viewport.
- Movimento reduzido: as 12 tecnologias ficam disponíveis e as animações da seção são removidas nas três opções.
- Rota local `/` preserva a apresentação anterior. Nenhum request para Google ou CDN de ícones na sessão, zero erros JavaScript.
- Capturas `output/playwright/technology-{a,b,c}-{390,1440}.png`; inspecionadas visualmente no workspace raiz.
- `tsc --noEmit` e `git diff --check` também passaram após o ajuste final.

Uma execução inicial observou visibilidade desatualizada após mudanças rápidas de largura. A causa exata desse episódio não foi capturada. A revisão identificou que o callback só considerava a primeira observação de um lote; agora aplica a mais recente por `time` e ignora callbacks após cleanup, conforme a [semântica documentada da API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#intersection_change_callbacks). Oito recarregamentos com redimensionamento e a suíte final sem instrumentação passaram depois do ajuste. Não se alega teste em aparelho físico.

## Próximo passo

Escolher A, B ou C (ou ajustar uma composição). Só então integrar o design escolhido ao componente definitivo, eliminar o comparador e validar novamente antes de uma futura publicação autorizada.
