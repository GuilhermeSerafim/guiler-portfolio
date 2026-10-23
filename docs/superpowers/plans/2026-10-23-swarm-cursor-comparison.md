# Comparação local de Swarm Cursor

## Pedido e limites

Guiler pediu duas versões locais para comparar visualmente, sem publicação: o Swarm Cursor completo e a proposta discreta somente sobre o globo. Trata-se de um experimento autorizado; nenhuma versão foi escolhida para produção.

Branch local `preview/swarm-cursor-2026-10-23`, baseada na publicação `fd3dfd3`. A página principal e o hub permanecem iguais. A entrada das variantes é protegida por `import.meta.env.DEV`.

## Alternativas

- **A — Completo:** componente original React Bits, com 800 partículas, redemoinhos, entrada, movimento ocioso, explosão no clique e contorno dos botões. Limitado à seção do globo para comparação contextual.
- **B — Discreto:** mesmo motor, com poucas partículas azuis, pequenas e de rastro curto. Ativo somente sobre a esfera inicial, desaparece antes da abertura da malha. Sem explosão no clique nem contorno dos botões.
- **Sem efeito:** link para o estudo aprovado da transição, como referência.

Ambas preservam o cursor nativo e deixam passar os cliques. O aro decorativo do portfólio é ocultado enquanto o efeito ocupa seu lugar. Não há efeito em toque, movimento reduzido ou fora da seção/aba ativa.

## Implementação do experimento

Fonte oficial obtida de `https://reactbits.dev/r/SwarmCursor-TS-CSS.json`, em 23/10/2026. A e B são implementadas em paralelo, com arquivos separados; a integração e a verificação pertencem à sessão principal. Nenhuma dependência npm adicional é necessária.

Rotas locais:

- `/__preview/swarm/a`
- `/__preview/swarm/b`
- `/__preview/globe-story` (referência)

A barra de comparação permite navegar entre as versões; a entrada local posiciona a página no início do globo. Não publica barra, salto automático, componente ou código das variantes na produção.

## Verificação planejada

Conferir visualmente A/B em movimento, transição do globo, interação com botões, retorno do cursor ao sair, movimento reduzido, toque, cleanup e build de produção sem módulos do experimento. Registrar limites de qualquer amostra de desempenho; não extrapolar resultados de navegador automatizado para aparelhos físicos.

## Resultado local

Implementadas as duas versões. B usa 72 partículas (`size=1.4`, `spread=62`, `speed=.42`, `swirl=.12`, `tail=.18`, `trail=.12`, `wander=.06`, `depth=.14`), máscara da esfera com opacidade máxima .58 e desaparecimento entre progressos .16–.24. Após 180 ms fora da esfera, desliga a simulação. Mantém contexto enquanto a cena está habilitada; desmonta em movimento reduzido, toque, fora da seção e aba oculta.

A preserva os parâmetros originais. O vendor recebeu suporte opcional para reconhecer botões irmãos no mesmo palco e ajuste de cleanup para React StrictMode. A licença oficial **MIT + Commons Clause** foi preservada integralmente, com fonte e hashes em `src/preview/swarm/vendor/README.md`.

Verificação Chromium: `output/playwright/swarm-preview-qa.json` na raiz do workspace, `pass=true`, zero erros de página e zero requisições Google. Capturas `swarm-a-globe.png`, `swarm-b-globe.png`, `swarm-a-cards.png`, `swarm-b-cards.png` inspecionadas. Testes confirmaram:

- Renderização de 800 / 72 partículas e movimento nas duas versões.
- Aro decorativo oculto durante o efeito; retorno em B ao sair da esfera.
- B sem novos desenhos na fase dos cards; A com contorno dos controles.
- Troca de integração e simulação de falha funcionando nas duas versões.
- Desmontagem em movimento reduzido e fora da seção.
- Emulação de toque 390×844 sem canvas Swarm nem overflow.

Não foi feito benchmark de FPS nem teste em dispositivo físico. Contagem de chamadas de desenho serve para verificar movimento/parada, não medir desempenho.

Build passou, mantendo exatamente os artefatos de produção `index-Chnd7E-b.js` e `index-B0mb4QGr.css`. Nenhum push ou deploy nesta etapa.
