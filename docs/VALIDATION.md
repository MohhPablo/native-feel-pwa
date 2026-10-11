# Validation report — 2026-10-11

**Status: 1.0.0 release candidate.** Implementation is available; browser/device acceptance is incomplete. Environment: Linux, Node 24.19.0, npm 11.9.0, Python 3.12. Dependencies are pinned in package-lock.json. The checks below were run before GitHub publication; consult GitHub Actions for any subsequent CI results.

| Check | Actual result | Scope |
|---|---|---|
| Dependency installation with --ignore-scripts | PASS | Lockfile generated |
| `node --test tests/*.test.mjs` | PASS: 30, fail 0, skip 0 | Positive/negative inputs, exit codes, traversal and coverage |
| `npm run validate` | PASS | YAML, name/directory, context length and links |
| `agentskills validate <skill-directory>` (skills-ref 0.1.1) | PASS | Reference package; installed entrypoint differs from specification's skills-ref command |
| skill-creator quick_validate.py | PASS | Additional structure check |
| `npm run build:examples` | PASS: both | React 19.3.0, Vite 8.3.4, Next.js 16.4.0 |
| Strict audit on both examples | PASS: no findings | Bounded static rules only |
| Manifest CLI | PASS | JSON and local PNG headers |
| Inventory CLI | PASS | Component paths/dependency names |
| `npm run demo:audit` | PASS | Three findings/exit 1 → zero/exit 0 |
| Bundle tool (200,000-byte ceiling) | PASS | Vite 68,329 bytes; Next static 175,070 bytes, all-JS gzip level 9 |
| Production HTTP smoke | PASS: 8 requests | HTML, manifest and 192/512 icons on both servers; Next main rendered |
| PNG full decoding/visual inspection by independent auditor | PASS | Four example images; OS crop untested |
| Selected direct dependency LICENSE inspection | PASS | React/react-dom/Vite/Next MIT; Playwright Apache-2.0; axe integration MPL-2.0; YAML ISC |
| `npm audit --json` | PASS: zero advisories | Registry snapshot, not security certification |
| Independent skill/tool reviews | COMPLETED | Concrete edge cases fixed with regressions |
| `npm run test:browser` | FAILED AT LAUNCH: 4 tests | Zero browser assertions executed |
| GitHub Actions matrix | NOT RUN | Configuration provided; no remote-run claim |
| Physical iOS/Android and screen readers | NOT RUN | Required before claiming support/accessibility |
| Field Core Web Vitals, frame rate, real-device latency | NOT MEASURED | Builds/bundle size do not prove them |
| Installed Codex/Pi CLI discovery | NOT RUN | Official documentation checked, not harness runtime |

## Browser failure

Chromium and headless-shell downloads returned invalid/truncated ZIPs (`End of central directory record signature not found`). WebKit downloaded via its official fallback mirror, but requires unavailable GTK4/GStreamer and other shared libraries. `playwright install-deps webkit` failed on required system-package permission operations. No privilege bypass was attempted. All four tests failed before assertions. **Axe results, runtime focus behaviour and browser reflow remain unverified.**

On a supported workstation/CI runner: `npm ci --ignore-scripts`, `npm run build:examples`, `npx --no-install playwright install --with-deps chromium webkit`, `npm run test:browser`. Investigate assertion failures before changing expectations. Tests cover dialog dismissal/focus, narrow/enlarged text, reduced motion, manifest response and axe rules; they do not replace physical-device checks.

## Limits

Regex rules may match comments or miss generated expressions. Dynamic manifests, deployed authentication/cache headers, worker updates, push delivery and private-data isolation are not runtime-tested by these intentionally online-first examples. No FPS/native-equivalence or WCAG conformance claim is made. Keep release-candidate status until browser gates and maintainer platform criteria are fulfilled.

Raw results and independent reports are in [evidence](evidence/); historical findings are reconciled in review-resolutions.md. Initial validation caught the not-yet-written source ledger; after completing documentation, both project and reference validation passed. The temporary audit demo initially used the wrong working directory and was rerun successfully from the repository root. No failed run is counted as passing.
