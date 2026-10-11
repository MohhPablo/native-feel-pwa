# Architecture

The repository root is the installable Agent Skill. SKILL.md routes four workflows to focused references; scripts are standalone dependency-free Node tools and do not execute target code. Tests use Node's built-in runner. Example applications and optional Playwright/axe tests are developer tooling, outside the skill's automatic context.

The static scanner intentionally reports candidate risks rather than interpreting arbitrary framework code. It avoids symlinks, generated/dependency directories and secret filenames, limits file sizes/count, and never emits source snippets. The manifest checker handles static JSON and local assets; dynamic metadata requires production-route inspection. PNG header dimensions are checked, not visual icon quality. The bundle tool enforces a conservative all-JS gzip ceiling, not actual route transfer.

Online-first examples demonstrate accessible native dialog reuse, safe viewport defaults and install metadata without introducing an unnecessary worker. Lifecycle references cover worker systems; worker rule fixtures exercise hazards. This is an engineering aid, not a runtime library, WCAG certification or native API bridge.

Release contract: deterministic tests plus framework builds and browser journeys where tools permit, independent skill exercise, documented evidence gaps, minimal dependency surface, and no fabricated platform/performance claims.
