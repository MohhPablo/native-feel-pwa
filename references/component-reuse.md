# Reuse before recreation

Complete the report BEFORE editing. Prefer: existing accessible project component → browser primitive → compatible maintained component → small justified custom implementation. Do not force this order when evidence favours a later choice. A browser primitive still needs integration testing and styling.

## Decision process
1. Inventory components, design tokens, imports, dependencies, lockfile, framework versions and existing tests. Inspect candidate source and call sites; file names alone prove nothing.
2. Write behavioural requirements: keyboard, focus return, screen reader name, dismissal, nested scrolling, drag alternative, reduced motion, SSR and gestures. Separate essential behaviour from visual preference.
3. Consult official docs and repositories for at least one credible external alternative when one exists. Record version/date, exact license file, release activity, unresolved relevant bugs, archive/maintenance notice, peer dependencies, SSR support and security advisories. Release recency alone does not establish quality.
4. Reject candidates that cannot satisfy accessibility, license, maintenance-risk or framework requirements. Record unknowns rather than inventing scores. Measure incremental production bundle size in the target app for finalists; registry size is not tree-shaken transfer cost.
5. Propose dependencies with exact versions, expected impact and rollback. Follow user/repository authorization. Never execute an unreviewed `npx` generator or import arbitrary registry code as a shortcut.
6. Adapt tokens, not entire architecture. Keep licenses for copied code and note upstream source/version. Copied shadcn components become locally maintained code; upstream fixes do not automatically propagate.

## Candidate matrix (discovery leads, not endorsements)
| Need | Candidate | Evaluate carefully | Smaller baseline |
|---|---|---|---|
| Styled component source | [shadcn/ui](https://ui.shadcn.com/docs) | Selected registry, underlying primitive, styling dependencies, local update ownership | Existing design system |
| React dialogs/menus | [Radix](https://www.radix-ui.com/primitives/docs/overview/accessibility) | Accessible labels, composition, portal/SSR and host focus behaviour | Native dialog/select |
| Complex accessible widgets | [React Aria](https://react-aria.adobe.com/quality) | Internationalization, gestures, SSR and imported subset | Native controls |
| Dragging drawer | [Vaul](https://github.com/emilkowalski/vaul) | Verify maintenance and keyboard/scroll bugs afresh; do not assume actively maintained | Dialog styled as sheet without dragging |
| Carousel | [Embla](https://www.embla-carousel.com/) | Keyboard controls, announcements, autoplay stop, nested scroll | CSS scroll snap and explicit previous/next controls |
| Large variable-height lists | [React Virtuoso](https://virtuoso.dev/) | Focus retention, find-in-page, SSR, reading order; product/license variant | Paginated semantic list |
| Complex motion | [Motion](https://motion.dev/docs/react-accessibility) | Reduced motion, mount cost, layout work and lazy loading | CSS opacity/transform transitions |

Do not treat a component library as WCAG certification. Verify the integrated product.

## Reusable decision matrix
Use pass/fail/unknown for hard gates (license, required behaviour, framework, accessibility). For passing candidates compare integration effort, ownership, measured bundle delta, maintenance evidence and device results. Do not average away a failed hard gate.

| Candidate/version | Existing? | Behaviour/a11y | License/source | Maintenance evidence/date | Framework/SSR | Bundle delta | Decision/reason |
|---|---|---|---|---|---|---|---|
| Populate before code | | | | | | | |

Custom code is appropriate for a small semantic wrapper or when candidates fail requirements. State exactly what is custom and what platform functionality is reused. Do not rebuild focus traps, gesture engines or virtualization casually.
