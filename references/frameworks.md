# Framework integration

## React/Vite
Inspect existing router, state and PWA plugin first. Vite build output is normally `dist`; subpath hosting requires coordinated Vite base, manifest URLs, worker scope and router base. Prefer build-time hashed assets; do not manually cache a stale index forever. If adding a worker plugin, inspect its generated worker and runtime rules. Browser APIs belong in effects/events with cleanup; Strict Mode may expose missing teardown. Profile before memoizing. The example uses native dialog and online-first delivery without a worker.

## Next.js App Router
Use framework manifest metadata conventions (`app/manifest.*` or a static manifest linked by metadata), and the dedicated viewport export. Keep server/client boundaries small; do not turn an entire layout into a client component for a dialog. Browser APIs must stay in client code. Inspect server rendering, data-cache configuration and HTTP caching separately from service-worker caching. Never blanket-cache RSC/Flight responses, authenticated routes or mutations. Verify deployed headers and route outputs, not only source config. `public/sw.js` is possible, but generated worker integration must match current framework/tool versions. The example uses static public manifest metadata and a client island; no offline guarantee.

## Other frameworks
The references and CLI work without React. Use the host router, SSR conventions and component ecosystem (Vue/Svelte/Angular/plain web) instead of installing React libraries. Rendered/runtime metadata must be inspected when static scans cannot evaluate framework generation. Preserve multi-package workspace boundaries; explicitly choose the app root/public root. Validate production rather than development-only behaviour.
