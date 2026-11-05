# Expected ACVIS rule mapping

The IDs below were supplied by the requester. No connection to ACVISDB was made,
and no database records were read or changed. These are expected references, not
proof that a scanner selected a specific record.

| CWE | MongoDB `_id` | Supplied rule_id | Fixture seam |
| --- | --- | --- | --- |
| CWE-89 | `6a9ad52b011ecda8a0e8e4d4` | `cn_664`; alternate reference `6a990927011ecda8a0e8bc75` / `appointment_00080` (unresolved) | `src/routes/auth.js`, POST `/api/auth/login` |
| CWE-79 | `6a990918011ecda8a0e8bc6c` | `javascript_express_js_refund_00009` | `src/routes/products.js`, GET `/preview/echo?message=...` |
| CWE-22 | `6a99091f011ecda8a0e8bc70` | `javascript_express_js_warehouse_00061` | `src/routes/files.js`, GET `/api/files/download?name=...` |
| CWE-639 | `6a997a82011ecda8a0e8bf71` | `gen_idor_javascript_2896` | `src/routes/orders.js`, GET `/api/orders/:id` |
| CWE-798 | `6a998063011ecda8a0e8cd59` | `gen_secret_javascript_5160` | `src/routes/auth.js`, signing key assignment |

ACVIS code inspection: `AstScanStep.cs` emits internal identifiers such as
`AST-CWE89`; `SecretScanningService.cs` has independent built-in secret detection
and a high-entropy threshold of 4.5. A CWE match does not establish a MongoDB rule
match. Language support, active rule configuration and actual Scan Results must
be inspected in the running ACVIS environment. Fixture routes use `db.query`,
`res.send`, `res.sendFile` and `findOne`, which appear in ACVIS's JavaScript sink
definitions. SQLite backs the query adapter. End-to-end taint analysis and rule
selection still need verification in the running ACVIS environment.

Record for each push: full commit SHA, delivery ID, Scan Job ID, file/line, CWE,
actual rule_id, verification status and expected MongoDB reference. Mark exact
record matching as unverified unless ACVIS exposes evidence linking that record.
