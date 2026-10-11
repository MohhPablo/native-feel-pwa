# Independent tool review

2026-10-11; Node v24.19.0 on Linux. Reviewed `scripts/*.mjs` in `/root/.codex/skills/remote-skills/native-feel-pwa`. No skill files modified and no dependencies installed. Reproduction fixtures are under `/workspace/scratch/7df74d17849b/tool-review-fixtures`. Locations below refer to the version inspected; the parent agent is editing concurrently.

## T1 — Medium: omitted build JavaScript can produce a complete passing budget

**Confirmed by execution; parent reports fixed after reproduction (fix not re-reviewed).** `scripts/budget.mjs:6-10`, with `scripts/lib.mjs` traversal exclusions.

The budget invokes `walk` with `skipGenerated:false`, but the walker still skips hidden directories and sensitive filenames. `incomplete` originally recognized only entry-count, size and symlink omissions. A build containing `a.js` (21 gzip bytes), `.assets/large.js` (61 gzip bytes) and `secret.js` (70 gzip bytes) therefore reported total 21, `passed:true`, `incomplete:false`, exit 0 against a 30-byte budget. Actual per-file gzip total is 152 bytes. The omissions appear in `skipped`, but the machine-readable pass and completeness claims contradict them.

Reproduce against the reviewed version:

```sh
node /root/.codex/skills/remote-skills/native-feel-pwa/scripts/budget.mjs /workspace/scratch/7df74d17849b/tool-review-fixtures/budget --max-js-gzip 30
```

Remedy: fail completeness when traversal omits potentially relevant build content, or explicitly scan all permitted output paths. Preserve safety exclusions rather than reading sensitive files merely to obtain a passing measurement. Regression: hidden and sensitive-named JS must not result in `passed:true,incomplete:false`.

## T2 — Low: unrelated JSON filename can abort dependency inventory

**Confirmed by execution.** `scripts/inventory.mjs:7-9`.

`f.rel.endsWith('package.json')` treats `not-package.json` as a package manifest. A directory with an ordinary, valid `package.json` plus unrelated `not-package.json` containing valid JSON `null` exits 2 with `Cannot read properties of null (reading 'dependencies')`; the real package inventory is never returned. An unrelated object JSON file with dependency-like keys is instead reported as a package.

```sh
node /root/.codex/skills/remote-skills/native-feel-pwa/scripts/inventory.mjs /workspace/scratch/7df74d17849b/tool-review-fixtures/inventory
```

Remedy: require an exact basename `package.json`, then validate that actual package manifests have an object shape. Regression: the unrelated JSON file must be ignored, and the legitimate package's React dependency must be returned.

## T3 — Low: valid whitespace around icon purpose is rejected

**Confirmed by execution.** `scripts/manifest.mjs:29-30`.

Starting with the example's valid manifest and icons, changing one icon's purpose from `any` to ` any ` yields `icon-purpose` error, exit 1, even without needing strict-warning behavior. JavaScript `split(/\s+/)` preserves leading/trailing empty tokens; the tool treats those empty strings as invalid purposes. The manifest specification determines purpose using ASCII-whitespace tokenization, so surrounding ASCII whitespace must not invalidate the recognized `any` token. The spec also ignores unrecognized tokens when a recognized purpose remains, whereas this implementation errors on any unrecognized token.

```sh
node /root/.codex/skills/remote-skills/native-feel-pwa/scripts/manifest.mjs /workspace/scratch/7df74d17849b/tool-review-fixtures/purpose-whitespace/manifest.webmanifest --root /workspace/scratch/7df74d17849b/tool-review-fixtures/purpose-whitespace --strict
```

Remedy: follow ASCII-whitespace tokenization, discard empty boundary tokens and determine whether any recognized purpose remains. If the project intentionally warns about unknown tokens, distinguish that lint policy from invalid manifest semantics. Regression: ` any ` passes; recognized plus unknown tokens do not produce an invalid-purpose error; an empty or wholly unrecognized purpose still fails.

Primary specification checked 2026-10-11: [Web Application Manifest, purpose member](https://www.w3.org/TR/appmanifest/#purpose-member). The same specification explicitly defaults non-string purpose to `any`; the observed acceptance of numeric purpose was therefore excluded from this defect report.

Windows execution was unavailable; no Windows-specific defect is asserted. No confirmed traversal escape was found during this focused source review; no claim of security certification is made.
