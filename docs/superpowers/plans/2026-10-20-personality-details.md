# Personalidade no portfólio — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar o portfólio pessoal com meteoros, referências de ciência/basquete e pequenas interações, para avaliação local.

**Architecture:** Componentes decorativos isolados em `src/components`, com CSS próprio; integração pontual em App.tsx. Movimento finito, condicionado à preferência e visibilidade, sem alterar analytics. A página principal e seus dados continuam iguais.

**Tech Stack:** React 18, TypeScript, CSS/SVG, Motion existente, Vite, Vitest e Playwright CLI.

**Spec:** `docs/superpowers/specs/2026-10-20-personality-details-design.md`.

## Global Constraints

- Somente portfólio; nenhuma dependência nova.
- Sem push, merge ou deploy. Commits locais convencionais.
- Manter conteúdo profissional, fotos, destinos, consentimento e instrumentação.
- Efeitos finitos; reduced motion é respeitado.

## Review Focus

- Mudança de reduced motion durante a sessão: remover movimento, manter conteúdo.
- Hero fora da tela/aba oculta: suspender rastros sem timers contínuos.
- 320 px e texto maior: tabs legíveis e nenhum overflow horizontal.
- Teclado: setas/Home/End selecionam e focam abas; aria-controls corresponde ao painel.
- Hash #projetos, filtros e modal: manter funcionamento após os novos componentes.

## Task 1: Hero com meteoros

**Files:** criar `src/components/MeteorField.tsx` e `.css`; alterar import/render em `src/App.tsx`.
**Interfaces:** `MeteorField()` decorativo sem props, substitui o fundo anterior. `data-active` representa visibilidade; CSS controla movimento.

- [ ] Registrar base e pesquisa. Iniciar preview atual e novo em portas distintas.
- [ ] Implementar três rastros determinísticos finitos, pontos esparsos, reduced motion e suspensão.
- [ ] Verificar no browser limite de duração, mobile, preferência alterada e saída de viewport; build TypeScript/Vite.
- [ ] Capturar evolução do hero; commit `feat(hero): adicionar meteoros ao fundo do portfolio`.

## Task 2: Caderno de curiosidades

**Files:** criar `src/components/CuriosityNotebook.tsx` e `.css`; integrar em `src/App.tsx`.
**Interfaces:** `CuriosityNotebook()` autocontido, estado Cosmos inicial e IDs acessíveis por useId.

- [ ] Implementar três abas e ilustrações SVG autorais conforme spec, removendo sticker antigo.
- [ ] Verificar por browser seleção/toque, ArrowLeft/Right/Home/End, altura estável, reduced motion e movimento finito.
- [ ] Conferir layout 320/390/768/1440, captura de cada estado; commit `feat(sobre): adicionar caderno de curiosidades`.

## Task 3: Gestos, revisão e entrega local

**Files:** criar `src/components/TrajectoryMark.tsx` e `.css`; integrar CTA e sublinhado em `src/App.tsx`.

- [ ] Adicionar seta autoral de trajetória no CTA e desenho breve do sublinhado; foco/hover/press sem alterar ação.
- [ ] Rodar build, 67 testes de analytics e QA browser de navegação, filtros/modal, reduced motion e responsividade.
- [ ] Revisão independente da branch e correção de problemas concretos.
- [ ] Commit `feat(ui): refinar gestos com tracos de trajetoria`.
- [ ] Registrar evidência, limites e links locais em `docs/research/personality/validation.md`; manter preview aberto, sem publicação.

## Verificação proporcional

Essas mudanças visuais são reversíveis e de baixo impacto: não criar testes que espelhem JSX/CSS. Usar QA real do navegador para interação/acessibilidade e a suíte existente para invariantes de analytics. Problemas lógicos encontrados recebem reprodução específica antes de correção.
