# Pre-implementation reuse decision — 2026-10-11

Task: generic online-first reading page with an information dialog, keyboard support, readable selectable content and safe mobile layout. Fresh examples have no local design system or dialog implementation. Frameworks selected: React/Vite and Next.js; existing host projects must use their own frameworks.

Research occurred before the example files were written. Official docs reviewed: MDN dialog, Radix accessibility, React Aria quality, shadcn introduction, Vaul repository, Embla, Virtuoso and Motion accessibility (see source ledger).

| Candidate | Gates and maintenance evidence | Cost/fit | Decision |
|---|---|---|---|
| Native HTML dialog | MDN documents native modal/inert/focus behaviour; runtime integration still needs tests; no third-party license | Zero library JS, thin React ref wrapper, no drag requirement | Select |
| Radix dialog 1.2.0 | Registry reports MIT, published 2026-10-05; official accessibility docs describe keyboard/focus support; not installed or independently device-tested | Strong for a project already using Radix; incremental bundle not measured | Not needed for this simple dialog |
| React Aria Components 1.22.1 | Registry reports Apache-2.0, 2026-10-09; official quality documentation reviewed; not installed | Broad widget needs exceed this example; bundle not measured | Reserve for complex controls |
| Vaul 1.1.2 | Registry reports MIT, 2024-12-14; no recent release demonstrated; current maintenance needs further verification | Drag/scroll complexity unnecessary here | Reject for this requirement |

No custom focus trap or gesture system. Author only the semantic content, CSS and a small dialog open/close wrapper; reuse platform dismissal/focus behaviour. The selected primitive does not imply every future sheet should use it.

Runtime dependencies proposed: React/react-dom 19.3.0 for both examples, Vite 8.3.4 development build tool, Next.js 16.4.0 for the second framework example. Validation-only dependencies: Playwright 1.64.0, axe integration 4.13.0 and YAML parser 2.9.1. These installations are within the user's explicit request to build and test this new repository, not changes to an existing application. Pin versions and lock transitive resolution. Registry license metadata is a screening signal; inspect installed LICENSE files for selected packages. No component package or copied third-party implementation is included.

Verify: production builds, static manifest/viewport checks, dialog label and Escape/close focus return, keyboard containment, 320px reflow, reduced motion, axe checks and device checklist. Physical iOS/Android results remain NOT RUN until tested.
