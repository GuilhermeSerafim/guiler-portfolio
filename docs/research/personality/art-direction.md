# Direção de arte — personalidade no portfólio Guiler

Pesquisa de 20/10/2026. Alvo: `portfolio`, publicado em https://guiler.vercel.app. Escopo deste documento: referências e recomendação editorial; nenhum código de produto alterado.

**Recomendação:** meteoros discretos no hero, substituindo a malha existente, e um caderno compacto de curiosidade em `#sobre`. O percurso principal continua sendo entender o trabalho, explorar projetos e conversar. Os interesses pessoais acrescentam reconhecimento e assunto à apresentação.

## Contexto observado

- O código local já usa papel `#f7f6f2`, tinta `#222320`, azul `#2546ef`, Bricolage Grotesque, DM Sans e IBM Plex Mono. Isso já fornece uma linguagem editorial adequada.
- O hero contém retrato, selo, sublinhado desenhado, prova do hackathon e `MagneticField`. A substituição da malha por meteoros atende à nova direção sem empilhar dois fundos.
- `#sobre` já tem o título “Curioso por natureza. Builder por escolha.”, duas fotografias reais, texto e um sticker “Sempre construindo.” É o lugar natural para os interesses.
- O contato já tem grande superfície azul e CTA evidente. O rodapé deve permanecer uma conclusão curta, sem uma segunda coleção de símbolos.
- Essas observações vêm de `portfolio/src/App.tsx`, `styles.css` e `components/MagneticField.tsx`. As URLs públicas não puderam ser carregadas pela ferramenta de pesquisa; este documento não afirma ter auditado visualmente a versão publicada.
- Astronomia, basquete, Da Vinci, Einstein e Newton/maçã são interesses informados no briefing. Não há evidência aqui sobre prática esportiva, observação com telescópio, rotina de leitura ou formação científica do Guiler.

## Fontes primárias: observação e interpretação

| Fonte | O que a fonte mostra ou documenta | Inferência para esta direção |
| --- | --- | --- |
| [NASA SVS — Orbit Views of our Solar System](https://svs.gsfc.nasa.gov/4790/) | Visualizações de órbitas com vistas superior e oblíqua; versões com e sem rótulos. | Uma curva, um ponto e espaço vazio bastam para sugerir astronomia. O desenho autoral pode ser abstrato, sem simular um mapa astronômico exato. |
| [NASA — Meteors & Meteorites Facts](https://science.nasa.gov/solar-system/meteors-meteorites/facts/) | Distingue o meteoro visível na atmosfera do fragmento que chega ao solo. | Para o hero, usar breves traços luminosos; evitar rochas ilustradas, explosões ou uma chuva permanente. Chamar o efeito de “meteoros” em documentação. |
| [Royal Collection Trust — Leonardo’s Study of Anatomy](https://www.rct.uk/collection/stories/leonardo-in-the-royal-collection/leonardos-study-of-anatomy) | Explica o uso de vistas, cortes e decomposição em camadas para esclarecer estruturas. | A referência útil é observar e explicar com desenhos econômicos. Não é necessário reproduzir manuscritos, sépia, caligrafia ou um retrato do artista. |
| [FIBA — Official Basketball Rules 2024, diagrama 1, p. 7](https://assets.fiba.basketball/image/upload/documents-corporate-fiba-official-rules-2024-v10a.pdf) | O diagrama organiza a quadra com limites retos, círculos e arcos. É uma referência visual datada, não uma afirmação sobre a regra vigente. | Uma meia quadra simplificada permite reconhecer basquete usando o mesmo vocabulário de linhas do desenho orbital. Não precisa de bola laranja, placar ou textura de madeira. |
| [Royal Society — Newton’s apple tree](https://royalsociety.org/blog/2012/02/newtons-apple-tree/) | Apresenta o relato da maçã registrado por Stukeley e reconhece os embelezamentos acumulados pela história. | A maçã pode ser um pequeno símbolo de pergunta e observação. Evitar a narrativa literal de fruta atingindo uma cabeça ou uma suposta frase de Newton. |

As decisões abaixo são propostas de design, não conclusões científicas ou alegações sobre a biografia do Guiler. Nenhuma imagem dessas instituições precisa ser incorporada: usar apenas SVG autoral de geometria simples.

## Direção A — Meteoros e caderno de curiosidade

É a recomendação para uma presença pessoal um pouco mais explorável. Quatro detalhes bastam.

### 1. Meteoros no espaço livre do hero

Traços em azul, com cauda que se desfaz, espessura visual de aproximadamente 1–1,5 px. Um meteoro visível por vez, em intervalos irregulares de cerca de 7–12 segundos; duração curta, sem pulsação de brilho. Esses números são parâmetros iniciais de composição, não uma simulação astronômica.

Concentrar o efeito nos vazios laterais e acima do retrato. Mascarar o título, introdução, CTA, selo e fotografia. Preservar o papel claro. Não acrescentar constelações, planetas e grades ao mesmo fundo.

No mobile, usar no máximo um traço curto, afastado da leitura, com menor frequência. Em `prefers-reduced-motion`, manter apenas alguns pontos/traços estáticos ou ocultar o fundo. Suspender animação quando o hero sai da tela ou a aba fica oculta.

### 2. Um caderno com “Cosmos / Quadra / Ideias” em `#sobre`

Inserir abaixo dos parágrafos da apresentação e antes do link do LinkedIn. Um painel único, com linha superior fina, três abas de texto e um desenho pequeno. Não usar três cards, capas ou fundos diferentes.

| Estado | Desenho autoral | Texto possível, limitado ao interesse informado |
| --- | --- | --- |
| Cosmos | Duas órbitas abertas e um ponto, em desenho de 96–120 px. | “Astronomia também faz parte das minhas referências.” |
| Quadra | Meia quadra simplificada, com um arco de arremesso. | “Basquete também tem espaço por aqui.” |
| Ideias | Maçã linear pequena, um segmento de queda e uma marca de observação. | “Da Vinci, Einstein e Newton: referências para minha curiosidade.” |

Os textos são pontos de partida concisos. Não escrever “jogo toda semana”, “passo as noites olhando estrelas”, “estudo relatividade” ou atribuir ao Guiler práticas não informadas.

Desktop: desenho à esquerda, frase à direita; largura acompanha a coluna de texto. Reservar uma altura estável de aproximadamente 164–184 px para a área de conteúdo, ajustada após renderização. Mobile: desenho de 80–96 px e texto em uma coluna, sem scroll horizontal; permitir altura suficiente para a maior frase.

Abas com área de toque de pelo menos 44 px; texto ativo sublinhado e com contraste visível. Seleção precisa funcionar por toque e teclado. Se forem implementadas como tabs, usar o padrão de foco e associação com o painel correspondente. Nenhuma informação depende de hover.

Troca por fade de até 150 ms, sem morph, órbita contínua ou bola quicando. Em movimento reduzido, a troca é imediata. A altura não deve variar conforme a seleção. Desenhos meramente ilustrativos não entram na ordem de foco nem repetem o texto para leitores de tela.

### 3. A referência a caderno aparece no acabamento

Reutilizar a fonte monoespaçada apenas nas abas ou em uma pequena rubrica “ALÉM DO CÓDIGO”. Traço em azul, corpo de texto na cor normal. Reaproveitar as linhas e proporções existentes; não incluir textura de papel, fita adesiva, coordenadas fictícias, numeração de experimento ou fórmulas ornamentais.

Remover o sticker “Sempre construindo.” quando o caderno entrar. As fotografias reais continuam sendo a imagem humana dominante. O módulo acrescenta uma história, sem competir com dois enfeites na mesma seção.

### 4. Contato e rodapé respiram

Não repetir os desenhos abaixo de `#sobre`. A seção azul de contato mantém o foco no e-mail e nos links úteis. O rodapé não ganha um “feito com café”, uma maçã, planetas, emojis ou outra faixa de interesses.

## Direção B — Meteoros e nota editorial

Alternativa mais silenciosa, caso o caderno interativo pareça excessivo no conjunto. Mantém os meteoros solicitados no hero e concentra a personalidade em três detalhes adicionais:

1. **Parágrafo humano em `#sobre`.** Acrescentar um único parágrafo curto ao texto atual: “Astronomia, basquete e a curiosidade de Da Vinci, Einstein e Newton também fazem parte das minhas referências.” Não transformar as preferências em tese sobre produtividade ou talento.
2. **Um desenho marginal.** No espaço hoje ocupado pelo sticker, uma única linha de trajetória com ponto final, em azul, com até 110 px. A curva pode lembrar tanto órbita quanto arremesso; essa associação é intencionalmente abstrata. Não acrescentar ícones separados para todos os interesses.
3. **Uma nota tipográfica.** Uma pequena rubrica “ALÉM DO CÓDIGO” estabelece a mudança de assunto. Usar o mesmo mono e a mesma linha fina já presentes no portfólio, sem box ou fundo novo.

No desktop, nota e desenho ficam próximos ao texto. No mobile, a nota ocupa uma linha acima do parágrafo e o desenho pode ser omitido. Tudo permanece estático, inclusive com movimento reduzido. Esta alternativa troca a descoberta por interação por uma leitura direta e mais curta.

## Limites para manter clareza e conversão

- Escolher A ou B. Não juntar o caderno, a nota, um desenho marginal e uma lista de interesses.
- Projetos, reconhecimento e CTA aparecem antes da exploração pessoal. Não usar o caderno como gate, jogo obrigatório ou navegação substituta.
- Os interesses devem ser compreensíveis sem identificar a referência histórica. O trabalho não depende de decifrar uma piada visual.
- Só uma família de linhas; só as cores já existentes. Cada diagrama deve funcionar em preto e branco.
- Nada de retratos de cientistas, citações, `E=mc²` decorativo, cérebros, lâmpadas ou “gênio” como atributo de marca.
- Conferir em 390 px e em desktop: título e CTA livres de traços; aba selecionada visível; painel estável; ausência de overflow; leitura humana acima de qualquer ilustração.
- A proposta pode aumentar identificação pessoal. Ganho de conversão ainda é hipótese; não há dados desta pesquisa que o comprovem.

## Decisão editorial

**Usar A, em dose pequena:** o hero introduz astronomia; `#sobre` dá contexto aos interesses; as fotografias mantêm a presença real do Guiler; projetos e contato sustentam o objetivo do portfólio. A maçã fica restrita ao estado “Ideias”, e Da Vinci/Einstein/Newton aparecem como referências pessoais, sem emprestar credenciais ao autor.
