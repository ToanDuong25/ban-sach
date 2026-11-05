# ACVIS bookstore test specification

User approved: initialize the empty ToanDuong25/ban-sach repository with a safe
Node.js/Express bookstore baseline on main. Prepare five local changes, then wait
for ACVIS enrollment before pushing vulnerabilities, one commit at a time.

Acceptance criteria:
- POST /api/auth/login rejects SQL injection and issues signed JWTs for demo users.
- GET /preview/echo renders escaped input in an HTML response.
- GET /api/files/download?name=catalog.txt serves only files inside the download directory.
- GET /api/orders/:id requires a valid JWT and enforces ownership.
- JWT signing material comes from environment configuration, never source code.
- Five local patches each introduce exactly one target vulnerability. They do not
  ship in baseline source, tests, comments, or public Git history.
- HTTP integration checks prove the baseline protections and each mutation's effect.
- Only synthetic data is used. No ACVIS code, production configuration, or database
  rule records are changed. Exact MongoDB rule matching remains unverified.

This is a separate disposable fixture, not an ACVIS feature change. ACVIS's .NET,
Python and Vue checks are not the checks for this Node.js repository. Its checks
are npm test, npm run check and git diff --check. The source repository is empty,
so the initial safe main commit bootstraps trunk; no origin/main exists to rebase.
