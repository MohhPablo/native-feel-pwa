# Contributing

Open an issue with a reproducible problem, environment and expected behaviour. Never submit private content, credentials or production logs. Discuss architectural changes before implementing them. Keep skill instructions compact and put specialised details in focused references.

For a rule change, provide a positive and negative fixture, explain false positives/negatives and document the exit/coverage behaviour. For a capability claim, link official docs plus compatibility evidence and review date. For UI examples, record the component decision before adding dependencies and test accessibility in the integrated result. Retain third-party attribution; no copied implementation without license review.

Run the commands in references/verification.md. Include actual passed/failed/not-run results in the PR. Device claims require device/OS/browser/mode evidence. CI configuration alone is not a run. Avoid tests that only repeat implementation; prefer user-visible regression scenarios and unsafe-input cases.

Versioning: MAJOR for breaking CLI/output/workflow contracts, MINOR for compatible tools/rules/references, PATCH for compatible corrections. New stricter defaults can break CI and deserve a major version or opt-in transition. Update CHANGELOG with migrations and known limitations. JSON schemaVersion changes accompany incompatible output. Record research refresh dates.

Release: clean scoped diff; npm ci, tests, both validators, builds and browser suite; dependency/license review; reproduce audit demo; update evidence; complete required physical gates or explicitly retain release-candidate status; tag vX.Y.Z only after review. Never commit node_modules, credentials or local caches. Publish to GitHub only with repository-owner authorization.
