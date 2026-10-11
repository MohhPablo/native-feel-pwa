# Exercised audit and regression demonstration

A fresh independent agent invoked the skill against the React/Vite example without receiving expected findings. Its [read-only audit](evidence/independent-audit.md) correctly treated absent offline caching as intentional, separated source observations from runtime evidence, and reported subpath assumptions and test gaps. See [resolutions](evidence/review-resolutions.md).

Run `npm run demo:audit`. It copies the example into an OS temporary directory, introduces three regressions, executes the strict CLI, restores the original two files and reruns. It asserts exit codes and cleans up only its temporary directory. This is a seeded demonstration, not an undisclosed defect in a user's application.

| Stage | Actual result | Meaning |
|---|---|---|
| Before | Exit 1; 3 findings | Global user-scalable=no, touch-action:none and user-select:none detected |
| After | Exit 0; 0 findings | Literal risks removed; accessible source defaults retained |

[Raw output](evidence/audit-demo.json) includes locations/severity. This demonstrates static detection, not actual pinch-zoom, WCAG conformance or performance. Both unmodified examples also passed strict static audits.

The [component decision](../examples/COMPONENT_DECISION.md) was recorded before implementation. Native dialog was selected over extra packages for a simple non-draggable modal. No custom focus trap or gesture engine was written.
