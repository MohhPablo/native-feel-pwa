# Verification and tool scope

Node 22.12+ is the repository baseline. Core audit/inventory/manifest/budget commands use built-ins only. The repository structure validator uses the dev-only YAML package; browser tests require Playwright, axe and downloaded browser binaries. Do not install these into an audited host application automatically.

## Commands from repository root
```sh
npm ci --ignore-scripts
npm test
npm run demo:audit
npm run validate
npm run build:examples
npx --no-install playwright install chromium webkit
npm run test:browser
node scripts/pwa-audit.mjs examples/react-vite --strict
node scripts/pwa-audit.mjs examples/nextjs --strict
node scripts/inventory.mjs examples/react-vite
node scripts/manifest.mjs examples/react-vite/public/manifest.webmanifest --root examples/react-vite/public --strict
node scripts/budget.mjs examples/react-vite/dist --max-js-gzip 200000
```
Use the reference package validator: the specification shows `skills-ref validate <skill-directory>`; the installed skills-ref 0.1.1 package exposes `agentskills validate <skill-directory>` instead. Check `--help` for your version. The bundled validator additionally checks relative references/context budget but does not claim full specification coverage. Review package scripts before executing dependency commands; ignore install scripts by default. Some environments require explicitly reviewed native build setup.

## Automated rules
| Tool | Detects | Does not prove |
|---|---|---|
| Audit | Literal zoom locks, low maximum scale, selection/touch restrictions, reload/worker/cache/blur risk patterns; static manifests | Computed CSS, generated metadata, authorization, cache safety or actual lifecycle correctness |
| Manifest | JSON types, name/display/URL relationships, icons, local PNG header dimensions, missing/unsafe assets | Browser install eligibility, full PNG decoding, artwork, deployed HTTP/MIME or auth redirects |
| Inventory | Package dependency names and likely component paths | Component behaviour, unused code, maintenance or exact bundle cost |
| Budget | Sum of per-file gzip JS sizes against explicit ceiling | Initial-route transfer, Brotli, INP, FPS or parse cost |
| Browser tests | Example dialog/viewport/reflow/reduced-motion/axe journeys in Chromium and WebKit | Physical keyboards, pinch zoom, screen readers, OS installation or push |

Scripts are read-only and emit no source snippets. The scan skips symlinks, hidden folders, common build/dependency directories, sensitive filenames, files over 1 MiB and entries after 10,000. Exclusions are in `skipped`. Regular files can still contain sensitive data: do not publish inventory paths without review. Regex checks can match comments and miss computed styles; review candidates before editing. There is no automatic fix mode or arbitrary code execution. Multiple/static nested manifests may need separate `--public-root` invocations. Dynamic Next.js metadata needs runtime inspection.

Exit codes: audit/manifest 0=no configured failure, 1=error finding (warnings too under --strict), 2=tool/input failure. Inventory 0=output, 2=failure. Budget 1=exceeded or incomplete measurement, 2=invalid/empty input. Warnings are never silently equivalent to verified conformance.

## Acceptance gate
Record command, date, tool versions and output for unit tests, official and project skill validation, example production builds, browser tests, static audits and bundle budget. Exercise a real audit and preserve before/after evidence. Run negative fixtures to prove failure paths. Inspect diffs and dependency licenses. Separate PASS/FAIL/NOT RUN; known unmet required gates prevent a production-ready claim. Physical platform matrix remains NOT RUN until actual devices are used.
