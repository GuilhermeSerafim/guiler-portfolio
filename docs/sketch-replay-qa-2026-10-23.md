# Repetição dos desenhos ao reaparecer

Mudança local em `CuriositySketch.tsx`: todos os cinco desenhos repetem a animação ao reaparecer. O estado só é reiniciado após saída completa; limiares existentes (75% para Newton e 35% para os demais), desenhos, posições, durações e preferência de movimento reduzido preservados.

## Verificação

- Antes: eventos CSS `animationstart` no Chrome confirmaram replay apenas de Newton; cosmos, Tesla, Leonardo e Einstein animavam uma vez.
- Depois: cinco desenhos verificados em 1440×800 e 390×844, entrando por ambas as direções e com pequenas rolagens sem saída completa. A animação repete nas entradas e não reinicia nas oscilações parciais.
- Tesla no desktop exigiu uma verificação adicional: seu contêiner acompanha a coluna da trajetória (`position: sticky`), portanto o primeiro roteiro não o retirava da tela. O teste corrigido saiu da seção inteira e confirmou três entradas com três animações, reset em ambas as saídas e nenhum reinício ao rolar dentro da seção.
- Movimento reduzido: zero animações nos cinco desenhos. Sem erros de execução. `npm run build` (TypeScript + Vite) e `git diff --check` concluídos com sucesso.
- Revisão estática independente sem achados. Nenhuma dependência, listener de scroll contínuo ou temporizador adicionado.

Artefatos no workspace pai: `output/playwright/sketch-replay-before.json`, `sketch-replay-after.json` e `sketch-tesla-replay-qa.json`, com seus roteiros JavaScript. O resultado inicial de Tesla desktop no segundo arquivo é inconclusivo por não haver saída; a verificação adicional registra as posições reais e resolve esse caso.

Prévia local em `http://127.0.0.1:5217/`; sem publicação nesta etapa.
