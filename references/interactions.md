# Mobile interactions and accessibility

## Input, zoom and viewport
Use `width=device-width, initial-scale=1`; add `viewport-fit=cover` only with safe-area padding. Preserve pinch zoom. Do not use `user-scalable=no`, restrictive `maximum-scale`, global `touch-action:none`, or blanket preventDefault listeners.

For iPhone focus zoom, inspect the **computed** input/textarea/select font size and transforms. A practical starting point is at least 16 CSS px (e.g. `font-size:max(1rem,16px)`), adequate line height and a correctly sized viewport. The threshold is an observed browser heuristic, not a standards guarantee; verify on target devices and with larger system text. Do not shrink controls using transforms to circumvent it. No normative 16px guarantee was found in the reviewed primary sources.

Keep `touch-action:auto` for documents/readers. On individual buttons, `manipulation` permits panning and pinch zoom while suppressing double-tap zoom. This changes a user gesture: apply narrowly where needed. Horizontal swipe regions may use `pan-y pinch-zoom` if compatible with the chosen library. Do not disable OS edge-back gestures. Prefer Pointer Events; handle cancellation and lost capture. Avoid global touchmove listeners.

Use `min-height:100svh` for stable minimum layouts; consider `dvh` when resizing with browser chrome is desired. Neither is a universal keyboard fix. First keep inputs in normal scroll flow. If a fixed composer is obscured, inspect `visualViewport` resize/scroll events with throttled updates and teardown; account for offset and scale. Feature-detect VirtualKeyboard APIs and CSS support; never assume Android and iOS resize alike. Test focus, blur, rotation, autofill and browser chrome expansion. Do not automatically focus a form on route entry.

Use `max(basePadding, env(safe-area-inset-bottom, 0px))`, not a replacement that becomes zero on ordinary screens. Check landscape left/right insets and avoid double-padding nested shells. Include `scroll-padding`/`scroll-margin` for sticky headers and focused elements.

## Interaction acceptance criteria
| Area | Implementation rule | Verify |
|---|---|---|
| Press | Use semantic button/link, CSS active/focus-visible state; never wait for navigation to show feedback | Tap, keyboard, disabled and loading states |
| Navigation | Use existing router/history; update title and focus appropriately after route changes | Back/forward, deep link, reload, interrupted navigation |
| Dialog/sheet | Reuse native dialog or proven primitive; name it, provide close button, contain focus, restore opener; no drag-only dismissal | Tab/Shift-Tab, Escape, screen reader, nested scroll and keyboard |
| Scroll | Prefer router restoration; key manual snapshots by history entry and list state | Return from detail retains position; new navigation starts appropriately |
| Carousel | Prefer scroll snap for simple content; visible controls and no mandatory swipe/autoplay | Vertical scrolling, keyboard, reduced motion, screen reader order |
| Overscroll | Scope overscroll containment to a verified conflicting region | Pull-to-refresh, inner scroll boundaries, edge-back still usable |
| Loading | Reserve final dimensions, mark busy region, use concise status announcement | No focus loss, repetitive announcements or layout jumps |
| Optimism | Use for reversible actions; roll back with accessible error and retry; prevent duplicate submissions | Delayed failure, concurrency and retry without duplicate write |
| Motion | Use CSS transform/opacity where adequate; reusable short duration tokens without artificial waits | Reduced motion removes nonessential movement; completion is not gated on animation |

Do not set `history.scrollRestoration='manual'` unless you implement and test the complete restoration policy. Do not synthesize extra history entries to trap users in a modal. Browser back behaviour may differ for native dialog close requests; explicit close is required.

## WCAG 2.2 AA baseline
Use semantic landmarks, headings, labels, appropriate autocomplete/inputmode and linked error text. Test keyboard-only access, visible focus, focus not obscured, status messages and screen readers. Text contrast: 4.5:1 normally, 3:1 for qualifying large text; UI/non-text contrast requirements also apply. AA minimum targets are 24×24 CSS px with specified exceptions; prefer 44×44 for primary touch controls as a product target, not the AA rule. Test text resize to 200% and reflow at 320 CSS px (including 400% zoom on a 1280px viewport where applicable). Allow password managers and paste; consider Accessible Authentication requirements.

Keep content selectable and long-press menus functional. Scope `user-select:none` only to genuinely non-text controls where needed. Do not suppress copy as security. Readers must retain selection, zoom and adjustable type. Maps/drawing surfaces can own gestures locally only with visible zoom/pan alternatives, keyboard access and an escape route; surrounding UI remains zoomable. Editors retain native caret/selection/IME and composition events. Provide a single-pointer alternative for dragging unless an applicable WCAG exception holds. Accessibility takes precedence over visual imitation.

Axe and static tools cover a subset. Manual reading order, meaningful names, touch exploration, contrast over imagery, zoom and real screen-reader behaviour remain required. See platform checklist and source ledger.
