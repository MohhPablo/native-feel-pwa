# Source ledger

Reviewed 2026-10-11. Primary documentation supports the linked topics; recommendations and budgets are project engineering judgments. Browser support changes: recheck compatibility tables for the actual deployment range. No claim of exhaustive review or unique invention.

| Source | Use and evidence boundary |
|---|---|
| [Agent Skills specification](https://agentskills.io/specification) | Frontmatter, naming, progressive disclosure, skills-ref validator |
| [Codex skill documentation](https://developers.openai.com/codex/skills) | Repository/user .agents/skills discovery; installation docs checked, harness integration not end-to-end tested |
| [Pi skills documentation](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/skills.md) | Portable directory format, .agents discovery and /skill:name; not a Pi runtime test |
| [MDN installability](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) | Manifest and browser-specific installation criteria; offline and installation are distinct |
| [WebKit Web Push](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) | 16.4 Home Screen push introduction and user interaction requirement, not a blanket native API claim |
| [WebKit safe areas](https://webkit.org/blog/7929/designing-websites-for-iphone-x/) | viewport-fit and insets; base padding remains necessary |
| [MDN touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action) | Gesture semantics, manipulation and pinch zoom, ancestor intersection |
| [MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport) | Visual/layout viewport distinction and events; device keyboard behaviour still needs testing |
| [MDN Background Sync + compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API#browser_compatibility) | Limited availability; foreground fallback |
| [MDN Vibration + compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API#browser_compatibility) | Limited availability; no portable iOS haptic guarantee |
| [MDN dialog + compatibility](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) | Native modal semantics and explicit close mechanism; newer attributes vary |
| [W3C manifest draft](https://www.w3.org/TR/appmanifest/#purpose-member) | Purpose token processing; draft status and browser recovery differ from strict project checks |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Accessibility criteria, exceptions and conformance basis; automated tools are partial |
| [web.dev Web Vitals](https://web.dev/articles/vitals) | Current LCP/INP/CLS thresholds and lab/field distinction |
| [web.dev worker lifecycle](https://web.dev/articles/service-worker-lifecycle) | Installing/waiting/activation hazards; application update policy is our synthesis |
| [Vite production build](https://vite.dev/guide/build) | Production output, public base and asset deployment |
| [Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps) | Framework metadata/worker/push integration; not a requirement to add push |
| [shadcn docs](https://ui.shadcn.com/docs) | Source distribution and component ownership |
| [Radix accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility) | Primitive focus/keyboard support; integration still needs verification |
| [React Aria quality](https://react-aria.adobe.com/quality) | Accessibility/internationalization quality approach |
| [Vaul repository](https://github.com/emilkowalski/vaul) | Drawer candidate; maintenance must be checked at decision time |
| [Embla](https://www.embla-carousel.com/) | Carousel candidate, not mandatory dependency |
| [Virtuoso](https://virtuoso.dev/) | Virtualization candidate; distinguish package/product licenses |
| [Motion accessibility](https://motion.dev/docs/react-accessibility) | Reduced-motion integration |

## Registry screening snapshot
Direct npm registry metadata read on the review date. These are discovery facts, not ongoing endorsement or source-license verification. Check the selected release's LICENSE and peer dependencies before adoption.

| Package | Version | Reported license | Published |
|---|---|---|---|
| @radix-ui/react-dialog | 1.2.0 | MIT | 2026-10-05 |
| react-aria-components | 1.22.1 | Apache-2.0 | 2026-10-09 |
| vaul | 1.1.2 | MIT | 2024-12-14 |
| embla-carousel-react | 8.6.0 | MIT | 2025-04-04 |
| react-virtuoso | 4.18.16 | MIT | 2026-09-29 |
| motion | 14.1.0 | MIT | 2026-10-09 |
| shadcn | 4.21.4 | MIT | 2026-10-07 |

Registry source pattern: `https://registry.npmjs.org/<package>`; version metadata and time fields. Older release dates do not prove abandonment. Exact incremental bundle size is unknown until measured in the host app.

## Overlap and contribution
| Existing resource | Already solves | Added focus here |
|---|---|---|
| [Vercel agent-skills](https://github.com/vercel-labs/agent-skills) | React performance and web-interface review guidance | Cross-framework PWA lifecycle, connectivity/private data decisions and physical-device evidence gates |
| [Design systems to skills](https://github.com/vercel-labs/design-systems-to-agent-skills) | Translating existing design-system knowledge to skill context | Reuse decision record before UI implementation |
| [Pi skills](https://github.com/badlogic/pi-skills) | Reusable tool-oriented skills, including research helpers | A task workflow that links component research to measured PWA fixes |
| [shadcn skills](https://ui.shadcn.com/docs/skills) | Component ecosystem-specific agent guidance | Compare rather than mandate one component ecosystem |
| Browser/framework documentation above | Platform primitives and framework integration | Bounded read-only tools, negative tests and integrated acceptance reports |

No existing skill implementation was copied. Overlap review is representative, not proof that no equivalent PWA skill exists. The 16px iPhone input-focus threshold is an empirical heuristic, not established as a normative guarantee by this research.
