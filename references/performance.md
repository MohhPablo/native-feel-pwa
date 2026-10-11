# Measurement and performance

Current Core Web Vitals targets: p75 LCP ≤2.5s, INP ≤200ms, CLS ≤0.1, segmented by mobile/desktop. These are field targets, not a claim about this repository's demos. Lighthouse lab TBT is not INP. Single-page navigation and back/forward-cache journeys need explicit measurements beyond a cold-load score.

## Baseline protocol
Choose representative routes and one constrained real phone. Record build ID, OS/browser, hardware, network, cache state, dataset and sample count. Compare cold and warm launches, route changes, typing, long-list scrolling and return navigation. Repeat lab runs (e.g. five) with the same configuration; report median and range, not a cherry-picked score. Use privacy-conscious RUM for p75 over a declared period; never collect typed text, tokens or private URLs. Do not install analytics without authorization.

Starting **project budgets**, to adjust after baseline: initial route JS ≤200kB gzip; route additions ≤50kB gzip; cold-load LCP ≤2.5s on agreed test setup; no avoidable >50ms main-thread tasks during core interactions; no unexplained bundle growth >10%. These are engineering negotiation points, not universal requirements. The included budget tool totals every JS file in a build, making a conservative regression ceiling, not a route budget. Record transfer and parse/evaluate costs separately.

## Diagnose before optimizing
| Symptom | Evidence | Focused response |
|---|---|---|
| Slow launch | Network waterfall, coverage, trace | Route split, remove unused imports, avoid waterfalls; verify SSR/hydration tradeoff |
| Rerenders | React Profiler, commit attribution | Narrow subscriptions, colocate state; memoize only demonstrated expensive work |
| Typing lag | Event/long-task trace | Defer expensive filtering, worker for measured CPU-heavy work; never debounce input feedback |
| Janky animation | Frame/paint timeline on device | Transform/opacity, reduce blur/layers; avoid animating layout, don't add permanent will-change everywhere |
| Layout shift | Layout shift sources | Explicit media dimensions, stable skeletons, font metrics/fallback |
| Image/font cost | Resource sizes and priorities | Responsive images, modern formats, subset/self-host authorized fonts, font-display; don't lazy-load LCP image |
| Huge DOM | Node count, memory, accessibility test | Paginate first; virtualize only when necessary with focus/reading-order validation |
| Memory growth | Repeated navigation heap profiles | Abort requests, disconnect observers, clean listeners/timers, revoke object URLs |
| Repeated fetching | Requests by interaction | Existing query cache, dedupe, freshness policy, cancellation; don't add a second state system |

Measure blur/backdrop-filter on lower-end hardware; an attractive screenshot is not performance evidence. Avoid allocating on every pointermove. CSS animations can still be costly. No tool here certifies FPS or native equivalence.

For CI, compare production bundles and browser journeys; if adding Lighthouse CI, pin versions and use median tolerances matched to CI variability. Fail meaningful budgets, not arbitrary perfect scores. Preserve reports and explain environment differences before claiming an improvement.
