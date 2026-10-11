# Architecture and lifecycle

## Decide connectivity first
| Model | Data strategy | Worker strategy |
|---|---|---|
| Online-first/protected | Server is authority; explicit retry/login state, no persistent private response cache | No worker is valid if features do not need it; or narrowly scoped worker for public assets/push |
| Offline-capable public | Versioned public app shell/content with bounded storage and visible stale status | Explicit allowlist and network fallback |
| Offline private | Separate security design, consent, expiry, account isolation and device threat model | Do not enable by default; never assume IndexedDB or Cache Storage is encrypted |

Installability is not equivalent to offline capability. Browser installation criteria vary. Serve over HTTPS (localhost for development); link a valid manifest and verify the deployed response MIME/status. Use stable `id`, `name`/`short_name`, scoped `start_url`, `scope`, appropriate display fallback and theme/background colours. Include actual 192/512 icons, purpose-separated maskable artwork with safe-zone padding and an Apple touch icon where desired. Inspect actual PNG pixels/dimensions, not only declared sizes. Test subpath deployments, redirects and authenticated start URLs. Do not add secrets or user identifiers to manifests.

Splash and launch presentation are browser controlled. Optional Apple startup assets need device testing. Do not add timer gates to imitate native launch; retain deliberate product content only when explicitly required and avoid making it block use unnecessarily.

## Worker lifecycle and stale builds
Prefer existing framework integration or maintained Workbox/Serwist tooling where justified; inspect versions, licenses and generated worker output. Do not install by default. Keep worker URL stable; set appropriate HTTP revalidation headers. A new worker installs then waits while the old worker controls clients. Do not automatically combine `skipWaiting`, `clients.claim` and unconditional reload: it can mix incompatible assets and lose work.

1. Deploy immutable hashed assets before HTML; retain previous assets through the support window.
2. Precache only public versioned assets. Use app-prefixed cache names; never delete every cache on a shared origin.
3. Notify users when an update waits. Save drafts and accept update explicitly where interruption matters.
4. Coordinate tabs via existing state or BroadcastChannel with feature detection/fallback. Distinguish first install from update. Reload only under a bounded build-ID/session guard, never on every controllerchange.
5. After a chunk load failure, show recovery UI and preserve work. Retry once if safe; persistent failure must stop with an actionable error. Avoid service-worker unregister loops.
6. Version API/schema contracts; support old clients temporarily or show upgrade-required state. Client reload cannot repair a backend contract break alone.
7. Test old-tab/new-deploy, pending mutation, offline update, failed install, two-tab activation and interrupted storage migration.

## Private data and requests
Client UI guards do not authorize resources; enforce authorization on server. Exclude authenticated API, tokens and personalized HTML from worker caches. HTTP `Cache-Control: private, no-store` is necessary where appropriate but Cache API code can still explicitly store responses: review both layers. Clear app-owned account state on logout/account switch, notify other tabs and invalidate server sessions. Do not erase unrelated origin storage.

Use request cancellation and deduplication where supported. Retry transient failures with bounded exponential backoff and jitter; honour Retry-After. Mutating retries require idempotency or application-specific duplicate protection; do not blindly retry payments or writes. Distinguish offline hints from actual request failure (`navigator.onLine` is not proof). Handle quota/eviction and denied storage; request persistence only when justified, never promise durability. Persist minimal drafts with schema versions and recovery; avoid relying solely on beforeunload.

## Background work and notifications
Background Sync is an optional enhancement with limited availability; keep foreground/manual retry and visible pending state. Workers are not continuously running processes. Push requires server subscription management, permission, secure context, worker handling and unsubscribe cleanup. Request permission after explanation and user action. iOS/iPadOS support described by WebKit starts with 16.4 Home Screen web apps; do not promise Safari-tab support or delivery deadlines. Payloads must not reveal sensitive content on lock screens. Feature detection is necessary but does not prove permission or reliable delivery. See platform matrix.
