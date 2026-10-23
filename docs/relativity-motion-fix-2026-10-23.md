# Relatividade: deformação da malha SVG

Correção local em `src/components/CuriositySketch.tsx` e `.css`, em 23/10/2026.

## Causa e correção

Os dois paths da malha tinham geometria fixa. `sketch-fabric` apenas alterava escala de 0,94 para 1 e opacidade. A reprodução no navegador confirmou `deforms: false` enquanto a matriz de escala mudava.

`SpacetimeGrid` agora interpola os pontos de controle das curvas em 1,6s, de malha plana até o desenho original, com acomodação discreta. Os atributos `d` mudam; não há transformação de escala. O efeito termina e cancela o RAF quando o desenho sai da tela ou desmonta. Não adiciona dependências nem loop permanente.

Tamanho (80px desktop, 64px mobile), posição, raio de luz e geometria final foram preservados. O observer continua acompanhando a visibilidade sob movimento reduzido para permitir a reativação posterior. CSS e o controller da malha respeitam a preferência; com redução ativa, a pose final permanece estática.

Referências de API consultadas: [SVG `d`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/d) e [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame). A duração usa o timestamp do frame.

## Verificação

`npm run build` aprovado (TypeScript + Vite), artefatos `index-CCJHE-dx.js` e `index-B4HXuMX8.css`.

Scripts e evidências no workspace pai, em `output/playwright/`:

- `relativity-regression.js`, `relativity-before.json`: geometria constante antes da correção.
- `relativity-after.json`: geometria muda e a transformação permanece `none`.
- `relativity-qa.js`, `relativity-qa.json`: verificação final aprovada em Chromium 1440×900 e 390×844, sem erros JavaScript.
- Deformação, repouso ao terminar e replay após sair completamente da tela conferidos.
- Movimento reduzido testado tanto durante a animação quanto ativo no carregamento, seguido de reativação.
- Largura original e ausência de overflow horizontal confirmadas; capturas `relativity-1440.png` e `relativity-390.png`.

O teste usa viewport móvel emulado, não aparelho físico. Não mede FPS. Uma primeira coleta por amostras temporais retornou falhas intermitentes; foi repetida com registro de geometria, visibilidade e preferência. O relatório final contém essas evidências e `pass: true`.

Prévia: `http://127.0.0.1:5219/#tecnologias`. Para repetir, tirar o desenho completamente da tela e voltar. Sem push ou deploy.
