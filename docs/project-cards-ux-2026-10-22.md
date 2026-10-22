# Cards concisos e disponibilidade contextual

Revisão local solicitada em 22/10/2026, sobre `ac93cf0`. Sem publicação nesta etapa.

## Hierarquia

- Cada card tem uma frase sobre o propósito do projeto. A stack permanece em tags separadas; não é repetida no resumo.
- Estágio, contribuição, decisões e resultados ficam nos detalhes. Os destaques numéricos da Mesa e da Seven permanecem na seção “O resultado”, com unidade e contexto.
- Status e horário deixam os cards. No modal, “Verificação do link” é um `details/summary` nativo, recolhido inicialmente, abaixo dos links.
- Falha ou instabilidade com evidência válida gera aviso antes do CTA. Manutenção ativa mantém mensagem e previsão visíveis, inclusive quando a observação HTTP expirou.
- `unknown` não ganha aparência de falha nem é convertido em “online”. Rótulo, mensagem, horário e cobertura reais continuam acessíveis ao expandir. Os links nunca são desabilitados pelo monitor.

## Skill aplicada

`ui-ux-pro-max:ui-ux-pro-max`, em `C:/Users/Guiler/.codex/plugins/cache/ui-ux-pro-max-skill/ui-ux-pro-max/2.15.0/.claude/skills/ui-ux-pro-max/SKILL.md`.

As buscas de disclosure e implementação React não retornaram correspondência útil. A orientação veio das referências gerais verificadas da própria skill (`references/quick-reference.md`): `content-priority`, `visual-hierarchy`, `progressive-disclosure`, `color-not-only` e acesso por teclado. Controle com alvo mínimo de 44 px, foco visível, sem depender de hover e sem nova animação. Revisão independente sem bloqueadores.

## Verificação

- TypeScript/Vite aprovado: `index-4wZasMV3.js`, 407,54 kB / 134,70 kB gzip; CSS 64,20 kB / 14,03 kB gzip.
- 86 testes existentes de contrato e transporte do monitor passaram.
- Chromium: 1440, 768, 390 e 320 px; 16 aberturas/fechamentos dos quatro projetos; sem overflow, destinos e avisos sintéticos preservados. Enter e Espaço operam a expansão; Escape restaura o foco no card.
- Fixtures fictícias: operacional, instável, falha, manutenção, evidência expirada, evidência expirada com manutenção ativa e erro de rede. Não são medições dos serviços públicos.
- Expiração com modal e detalhes abertos preserva expansão, foco e rolagem. Nenhum erro JavaScript ou request Google na matriz; nenhum consentimento foi concedido.
- Evidência fora do repositório: `<workspace>/output/playwright/project-cards-ux-qa.js`, `project-cards-ux-qa-result.json` e capturas `project-cards-ux-*.png`.

Contrato, TTL de 45 minutos, transporte, fontes, URLs e Analytics não foram alterados. Preview: http://127.0.0.1:5195/#projetos.
