# Independent React/Vite example audit

Date: 2026-10-11. Mode: read-only Audit using `native-feel-pwa`. Scope: `/root/.codex/skills/remote-skills/native-feel-pwa/examples/react-vite`, its single reading-page/dialog journey, static manifest, icons and existing build. Node v24.19.0. No example changes or dependency installations were made by this auditor. No applicable AGENTS.md files were found in the checked ancestor chain.

Assumptions: the documented online-first example is served from the origin root, has no sensitive/private content, and intentionally does not save the practice note. Target OS/browser minimums and deployment origin are unspecified. Source declarations: React/react-dom 19.3.0 and Vite 8.3.4; these declarations are not a claim about independently verified upstream availability. References read: interactions, lifecycle, frameworks, verification, platforms, reports and performance.

## Prioritized findings

No confirmed critical, high or medium defects were established within the inspected scope. In particular, absence of a service worker and persistence is intentional and not a finding for this example.

| ID | Severity/status | Location | Evidence and impact | Minimal remedy and verification |
|---|---|---|---|---|
| A1 | Low, conditional deployment limitation; source condition confirmed, deployed failure untested | `index.html:2`, `vite.config.js:2`, `public/manifest.webmanifest:2-6,12-24` | HTML manifest/icon links and manifest id/start/scope/icons are origin-root URLs; Vite has no subpath base configured. This is coherent for origin-root hosting. If copied under a prefix such as `/reader/`, installation may open the origin root and assets/manifest may resolve outside the application. | Document origin-root hosting, or coordinate Vite base and all manifest/HTML URLs when a subpath is actually required. Serve a production build at the intended prefix and exercise load, manifest/icon requests and installed launch. |
| A2 | Low, confirmed verification coverage gap | `tests/browser/examples.spec.mjs:1-36` (skill-level suite) | Existing tests inspect 320px reflow after closing the dialog, but do not separately exercise 200% enlarged text or the modal at 320px. The Tab containment assertion explicitly permits document.body, and only one Tab is sent; Shift-Tab/background inertness are not directly verified. This is a test coverage gap, not proof of an accessibility failure. | Extend the existing journey with enlarged text, narrow modal, repeated forward/backward tabbing and background inertness checks when test changes are authorized. Retain real screen-reader/device checks. |

## Checks actually performed

The following commands use skill-relative scripts and the example path given above. Separate reruns confirmed each static tool's exit status.

| Check | Result |
|---|---|
| `node scripts/pwa-audit.mjs examples/react-vite --strict --json` | PASS, exit 0; 7 files scanned, zero findings; `dist` excluded. Regex coverage only. |
| `node scripts/inventory.mjs examples/react-vite` | PASS, exit 0; React/react-dom and Vite dependency names; zero component-path candidates. Manual inspection did locate the Reader component, so zero candidates does not mean no components. `dist` excluded. |
| `node scripts/manifest.mjs examples/react-vite/public/manifest.webmanifest --root examples/react-vite/public --strict` | PASS, exit 0; zero findings. |
| `node scripts/budget.mjs examples/react-vite/dist --max-js-gzip 200000` | PASS, exit 0; one JS file, 68,329 gzip bytes versus 200,000; no omissions. Measures an existing concurrently produced build, not an independently rebuilt artifact or route/network performance. |
| Pillow full decoding of all four public PNGs | PASS; 192×192, 512×512, 512×512 maskable, 180×180 Apple icon; RGB. |
| Visual inspection of maskable icon | Centered book motif with substantial surrounding background; no obvious unsafe-edge artwork. Actual OS crop untested. |
| Source inspection | Semantic main/heading/label/buttons; native named dialog with explicit close; input minimum 16 CSS px; safe-area padding retains base values; focus style; reduced-motion override; zoom/selection preserved in inspected source. These are source observations, not runtime accessibility certification. |
| Build/browser suite | NOT RUN by this independent auditor. Existing scripts and browser assertions inspected, not credited as passing. |

## Limitations and next actions

No browser, physical-device, deployed HTTP/MIME/redirect, install eligibility, real keyboard, pinch-zoom, 200% text resize, VoiceOver/TalkBack, OS back gesture, storage eviction, stale-tab/new-deploy or network-failure journey was executed by this auditor. No field/lab LCP, INP, CLS, FPS or memory measurements were collected. Root deployment and supported browser versions remain assumptions. The static scanner explicitly excludes build output and cannot establish computed CSS, runtime lifecycle correctness, cache/security safety or WCAG conformance.

Run the existing browser suite against the production example build, then supplement its coverage as described in A2. Verify the actual deployment paths and headers. Finally run the platform checklist on supported iPhone and Android devices in tab and installed modes before making compatibility or production-readiness claims. There is no basis here for adding an offline worker, persistence, new component library or other architectural change.
