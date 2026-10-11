# native-feel-pwa

A reuse-first Agent Skill for building, auditing, fixing and optimizing polished Progressive Web Apps. It teaches agents to inspect what exists, choose appropriate components, preserve accessibility, handle PWA lifecycle risks and verify improvements.

**Status:** v1.0.0 release candidate. See [validation evidence](docs/VALIDATION.md) for actual results and untested platforms. This is not a promise of native API parity, WCAG certification or production readiness for every host application.

## Install in a project
Requires an Agent Skills-compatible coding agent. Core tools require Node.js 22.12+; they need no npm install. From your application repository:

```sh
git clone https://github.com/MohhPablo/native-feel-pwa.git .agents/skills/native-feel-pwa
```

The path works for documented Codex and Pi shared skill discovery. Alternatively copy the entire skill directory there. Do not copy node_modules, build outputs or test reports. For a local Git bundle distribution:

```sh
git clone /path/to/native-feel-pwa-v1.0.0.bundle .agents/skills/native-feel-pwa
```

These Git/Node commands work in PowerShell as well as POSIX shells; use your actual quoted paths. No global install is needed. Avoid duplicate copies with the same skill name. In Pi, `/reload` refreshes skills; in Codex restart if discovery does not refresh. Review unfamiliar skills before granting project trust.

## Invoke
Codex:
```text
$native-feel-pwa Audit this repository for iPhone keyboard, dialog and stale-build problems. Do not modify files. Prioritize findings with reproducible evidence.
```
Pi:
```text
/skill:native-feel-pwa Fix the verified dialog focus-return bug. Reuse existing components, keep the diff focused, and run its regression test.
```
Other usage prompts:
- **Build:** Add an accessible mobile settings sheet using our existing tokens. Research local and upstream components before implementation; propose new dependencies first.
- **Optimize:** Profile our search route on the agreed device/network. Reduce typing latency and JS cost without changing behaviour; report comparable before/after evidence.
- **Audit:** Check our online-first authenticated PWA. Do not add offline caching. Review update safety, private responses and accessibility.

## What is included
- Concise [SKILL.md](SKILL.md) and focused engineering references.
- Dependency-free read-only configuration audit, component inventory, static manifest/PNG-header validator and gzip build budget tool.
- Unit tests with negative cases, two framework examples and optional Playwright/axe journeys.
- A [component decision record](examples/COMPONENT_DECISION.md), [architecture](docs/ARCHITECTURE.md), [improved creation prompt](docs/IMPROVED_PROMPT.md), [sources](references/sources.md) and [roadmap](docs/ROADMAP.md).

## Tool quick start
```sh
node scripts/pwa-audit.mjs /path/to/app --json
node scripts/inventory.mjs /path/to/app
node scripts/manifest.mjs /path/to/app/public/manifest.webmanifest --root /path/to/app/public
node scripts/budget.mjs /path/to/app/dist --max-js-gzip 200000
```
JSON goes to stdout. Errors go to stderr. Audit exits 1 for error findings; add --strict to fail warnings. Usage/tool failure exits 2. Tools never install packages, execute host code or fix files. See [coverage/limitations](references/verification.md).

## Compatibility
| Environment | Support level | Limitations |
|---|---|---|
| Codex | Official discovery/invocation documentation checked | Independent agent exercise performed; no separate installed Codex CLI session claimed |
| Pi | Official shared discovery and /skill command checked | Pi binary integration not exercised |
| Other Agent Skills agents | Portable SKILL.md and relative resources | Follow host discovery and authorization rules; not individually tested |
| React/Vite | Working example + static tools | No automatic router/service-worker integration |
| Next.js App Router | Working example + framework reference | Static checker cannot evaluate generated metadata/RSC behaviour |
| Vue/Svelte/Angular/plain web | Framework-independent guidance and source scan | No framework-specific runnable example in v1.0 |
| Windows/macOS/Linux | Node built-ins and CI matrix | Actual local tests ran on Linux; CI configuration is not evidence it ran |
| iOS/Android | Documented platform guidance | Physical-device matrix remains required |

## Run examples and checks
```sh
npm ci --ignore-scripts
npm test
npm run validate
npm run build:examples
npx --no-install playwright install chromium webkit
npm run test:browser
npm run dev --workspace examples/react-vite
```
For Next.js use `npm run dev --workspace examples/nextjs`. Examples assume origin-root deployment; coordinate asset/manifest/base URLs before subpath hosting. Examples are online-first, use native dialog, have install metadata and do not register a service worker or persist notes. Do not use them as authentication or offline templates. Browser tests start production servers automatically after builds; no cloud credentials are needed.

## How reuse decisions work
Hard gates precede preferences: required behaviour, accessibility, license and framework fit. Then compare maintenance, integration cost, ownership and measured bundle change. Existing components and browser primitives are first-class candidates. A named library is a research lead, not an instruction to install it. See [decision matrix](references/component-reuse.md).

## Before and after
Before: a page globally blocks zoom and selection to appear native. After: remove those blanket restrictions, give inputs readable computed sizes, keep control-specific touch feedback, then verify zoom, selection and keyboard behaviour. The [audit demonstration](docs/AUDIT_DEMO.md) records actual static before/after results; physical behaviour is separately unverified.

Contributions: [CONTRIBUTING.md](CONTRIBUTING.md). License: [MIT](LICENSE). Dependencies retain their own licenses. Version history: [CHANGELOG.md](CHANGELOG.md).
