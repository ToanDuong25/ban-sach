# Local verification evidence

Date: 2026-11-05. Node.js v22.16.0, Windows. Repository is a new, independent
fixture; no ACVIS application source or production state was changed.

- Login slice: failing missing app import, then passing real HTTP login and SQLi rejection.
- HTML preview slice: HTTP 404 before implementation, then escaped HTML assertion passed.
- Download slice: HTTP 404 before implementation; corrected Express hidden-parent
  directory behavior for `.scratch`; catalog and traversal assertions then passed.
- Order slice: HTTP 404 before implementation, then authenticated ownership assertions passed.
- JWT configuration: token verified against configured random key; invalid config
  and verification with a different key rejected.
- `npm test`: 5 passed, 0 failed on safe baseline.
- `npm run check`: JavaScript syntax checks passed.
- `npm install --ignore-scripts`: 0 dependency audit vulnerabilities reported.
- Known warning: Node 22 built-in SQLite is experimental.

The separate local mutation harness verified every protection test detects its
corresponding mutation. It restored the original source after each experiment,
then all five baseline tests passed again:

| Mutation | Observed protection failure |
| --- | --- |
| CWE-89 | Invalid login changed from 401 to 200 |
| CWE-79 | HTML escaping assertion failed on unescaped markup |
| CWE-22 | Traversal changed from 400 to 200 for synthetic private canary |
| CWE-639 | Another user's order changed from 404 to 200 |
| CWE-798 | Issued JWT failed verification against configured signing key; token forged with the synthetic source key changed from HTTP 401 to 200 while normal order authentication still passed |

Real boundaries: HTTP, Express route mounting, SQLite queries, file reads,
JWT issuance/verification. Configuration is supplied directly to the app factory
in tests. No mocks. XSS evidence is unsafe HTML reflection, not browser JavaScript
execution. Negative mutation runs are expected failures, not baseline failures.

Independent Standards and Spec reviews cleared the staged initial safe baseline
against the empty tree, with zero blocking findings. `git diff --cached --check`
and all five `git apply --check` commands passed. Remote CI has not run at
document preparation time. ACVIS enrollment,
signed delivery, actual Scan Results, exact MongoDB record matches, deployment,
dynamic exploit verification and remediation lifecycle verification remain pending.
