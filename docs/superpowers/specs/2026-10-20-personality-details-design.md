# Detalhes pessoais no portfólio

Alvo confirmado pelo usuário: **portfólio guiler primeiro**. O usuário autorizou pesquisa segmentada, síntese, plano e execução com commits convencionais. Pediu ver a evolução **antes de publicar**. Esta entrega permanece local, sem push, merge ou deploy.

## Direção

Papel claro, tinta azul e curiosidade de quem observa e constrói. Preservar fotos reais, tipografia, conteúdo profissional, quatro projetos, navegação e contato. Os interesses informados são astronomia, basquete, Leonardo da Vinci, Einstein e Newton; não inventar histórias, hábitos, formação científica ou citações.

Três pesquisas independentes estão em `docs/research/personality/`: portfólios, componentes e direção de arte. A referência de meteoros é Magic UI/Aceternity; Lightfall é uma identificação apenas provável da lembrança do React Bits. Implementação nova será autoral com CSS/SVG, sem copiar código desses componentes. Adaptações React Bits já existentes continuam com seus avisos.

## Decisões de composição

1. **Hero:** substituir MagneticField por `MeteorField`, conservando o componente antigo para comparação/histórico. Poucos pontos e três rastros azuis no espaço livre, sem fundo escuro. Movimento inicial finito: cada rastro dura até 1,8 s; a sequência termina em até 4,5 s. Mobile mostra apenas dois rastros. Não há loop ou cursor customizado. Ao sair da viewport ou ocultar a aba, a animação pausa. Em reduced motion, ficam apenas marcas estáticas. O retrato, título e botões são dominantes.
2. **Sobre:** remover sticker “Sempre construindo” e inserir um único `CuriosityNotebook` na coluna de texto, depois dos parágrafos e antes do LinkedIn. Três abas: Cosmos, Quadra, Ideias. Um desenho SVG autoral e uma frase por estado. Sem cards adicionais, fontes externas ou imagens geradas.
3. **Caderno:** Cosmos mostra órbitas; Quadra mostra meia quadra e arremesso; Ideias mostra uma maçã e um traço de queda. Estado inicial estático. Seleção por clique/toque/teclado pode disparar um gesto curto, até 2 s, sem repetição. Abas com foco roving, setas/Home/End e painel associado. Desenhos decorativos aria-hidden. Área estável entre estados e controles de pelo menos 44 px. Reduced motion mostra a composição final imediatamente.
4. **Acabamento:** sublinhado “impacto” desenha uma vez; CTA principal ganha uma seta de trajetória desenhada, com resposta breve de foco/hover/press. Preservar o href e o botão magnético atual; não adicionar outra biblioteca, loader, texto rotativo ou transformação de letras.

## Texto pessoal inicial

- Cosmos: “Astronomia me faz querer entender o que existe além do que a gente vê.”
- Quadra: “Basquete, movimento e as possibilidades de uma boa jogada.”
- Ideias: “Da Vinci, Einstein e Newton: gosto de quem olha para o óbvio e faz outra pergunta.”

São propostas editoriais baseadas nos interesses declarados, apresentadas para revisão local. Não são frases atribuídas aos cientistas.

## Limites técnicos e validação

- React 18, TypeScript, CSS/SVG e Motion já instalado. Nenhuma dependência nova.
- Não alterar eventos, consentimento, política de URLs ou configuração de Analytics.
- Não modificar fotos, projetos, tags, métricas profissionais ou destinos.
- Sem overflow em 320/390/768/1440 px; teclado e toque funcionam; texto não depende da animação.
- Conferir reduced motion tanto na carga quanto após mudança de preferência, suspensão fora do hero e aba oculta, cleanup dos listeners e duração finita.
- Testar abas, retorno do foco dos modais de projeto, navegação direta a `#projetos` e filtros existentes.
- Registrar comparação do hero atual, hero novo e seção Sobre. Manter localhost para o usuário avaliar.

## Decisões do implementador

Movimento finito em vez de chuva contínua é escolha de acabamento e de leitura. Um único caderno concentra referências pessoais. A implementação local autorizada prossegue sem uma nova rodada de aprovação do plano; publicação continua explicitamente bloqueada pelo pedido do usuário.
