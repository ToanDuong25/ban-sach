# Ban Sach — ACVIS verification lab

A minimal bookstore API with a safe initial baseline. Node.js 22.16+ is required
for built-in SQLite (experimental on Node 22). All users, orders and files are
synthetic. The in-memory database resets on every restart.

## Run locally

```powershell
npm.cmd ci
Copy-Item .env.example .env
node -p "require('node:crypto').randomBytes(48).toString('base64url')"
# Put the generated value in JWT_SECRET in .env.
# Set DEMO_PASSWORD to a fresh demo-only password of at least 12 characters.
npm.cmd start
```

The default address is http://127.0.0.1:3100. Demo usernames are `alice` and `bob`;
both use the configured DEMO_PASSWORD. Passwords are stored as salted scrypt
hashes. JWTs expire after 15 minutes. Send `Authorization: Bearer <token>` for
order requests. Alice owns order 1; Bob owns order 2.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | Readiness |
| POST | `/api/auth/login` | JSON `{ "username": "alice", "password": "<your demo password>" }` |
| GET | `/api/products` | Synthetic book catalog |
| GET | `/preview/echo?message=hello` | HTML preview |
| GET | `/api/files/download?name=catalog.txt` | Catalog download |
| GET | `/api/orders/1` | Authenticated order details |

## Verification

```powershell
npm.cmd test
npm.cmd run check
git diff --check
```

Integration tests call real HTTP endpoints against real Express, SQLite,
filesystem and JWT implementations. No database/provider mocks are used. Tests
use random ephemeral credentials. ACVIS, GitHub webhook delivery, browser script
execution and remote deployments are outside these local tests.

## Staged ACVIS exercise

1. Keep main at the safe baseline and enroll this repository in ACVIS. Select
   `main` as the monitored branch and confirm monitoring is active. Use ACVIS's
   current GitHub App installation flow.
2. Set scan scope to `src/**` (or exclude `test/**`, `docs/**`, `scripts/**`, and
   dependency/lock files). Tests deliberately contain attack inputs; scanning
   tests can create noise even before a vulnerable source change is pushed.
3. Start with static push scanning. For dynamic verification, configure a
   separately deployed, disposable staging URL reachable from ACVIS. Localhost
   is blocked by ACVIS's target URL policy; local execution alone does not prove
   dynamic verification. Remote exposure/deployment has not been performed.
4. Five mutation patches and their runner are prepared separately in the local
   ACVIS workspace. They are intentionally absent from this safe baseline's Git
   history. Wait until monitoring is connected before applying any of them.
5. Apply exactly one patch, review the diff, commit and push. Wait for its Scan
   Job to finish and record evidence before the next push. A production merge
   gate may reject intentional vulnerability commits; use this disposable repo's
   normal authorized test workflow rather than weakening ACVIS protections.
6. Revert the mutation commit and push the remediation. Verify the resulting
   finding lifecycle, then repeat for the next CWE. Never combine the SQLi and
   hardcoded-key patches without rebasing/revalidating their shared auth file.

See [expected record mapping](docs/RULE-MAPPING.md), [accepted specification](docs/SPEC.md)
and [verification evidence](docs/VERIFICATION.md). No ACVISDB records are seeded,
edited, or claimed as matched by this repository.
