# English portfolio implementation plan

**Goal:** provide a complete English portfolio alongside Portuguese and verify integration and mobile/desktop performance locally.

**Architecture:** Portuguese remains at `/`, English lives at `/en/`, sharing React components and assets. A tiny typed locale context chooses existing Portuguese or English copy without adding dependencies. Native locale links preserve the query and section hash, and do not store language preferences. Vite builds two HTML entrypoints with locale-specific metadata. Canonical/hreflang tags point to production URLs; the feature is not published as part of this request.

**Baseline:** worktree based on `7bf299c`, including the existing privacy-focus fix and corrected analytics tests; pending Anatomy prototypes and cloud-runner edits remain untouched in entry-flow.

**Constraints:** preserve facts, dates, metrics, project names/IDs, destinations, section IDs, privacy consent and campaign allowlist. Do not label the existing Portuguese PDF as an English résumé. Do not introduce translation services, locale dependencies or new animation work.

- [x] Translate main page, navigation, filters and contact, and add an accessible PT/EN switch.
- [x] Translate case studies, career data, project dialogs and result/visual labels.
- [x] Translate engineering illustrations, technology catalog, decorative accessible text and interaction states.
- [x] Integrate locale route/HTML metadata, privacy/download copy and narrowly allow `/en` and `/en/` in portfolio analytics.
- [x] Build and run existing tests plus focused route/data/privacy regression tests.
- [x] Verify both locales in a real browser at desktop/mobile: switching/hash, filters/modals, résumé, contact/privacy and absence of runtime errors/overflow.
- [x] Measure the baseline and both locale builds in the same local Lighthouse environment; report variation and bundle delta, without presenting local scores as cloud or real-user results.

## Review focus

- Direct English route load/reload and section links must work without Portuguese flashing.
- Locale changes must retain section/hash/campaign without broadening analytics entry policy.
- A longer translation must not overflow header, hero, modals or mobile controls.
- Labels, dialogs, SVG text and accessibility copy must match the selected language.
- Static page metadata and the Portuguese résumé language must be truthful.
