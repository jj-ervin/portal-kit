# PK-02 extraction inventory and provenance

**Status:** complete at the documentation level
**Inspection date:** 2026-10-22
**Scope:** read-only source, history, license, and targeted behavior inspection
**Outcome:** first implementation slice selected; no source copied or moved

The machine-readable evidence companion is [pk-02-source-inventory.json](pk-02-source-inventory.json). Git blob IDs and SHA-256 values identify the exact canonical Git blob bytes, independent of checkout line-ending conversion; they are evidence references, not approved dependencies.

## Pinned sources

| Repository | Inspected revision | State | Repository license evidence |
| --- | --- | --- | --- |
| `governancecommons/governance-commons-portal` | `85b17af949bb4112131eb1f150a6ab7083abf59e` | Clean `main`, equal to `origin/main`; private | No GitHub-detected license, root license file, or package license field |
| `jj-ervin/cockpit` | `3ced7d307d57f30b77866cc41741a0895d249db5` | Clean `main`, equal to `origin/main`; private | No GitHub-detected license, root license file, or package license field |

The absence of a repository license grant means PK-02 does not authorize copying or redistribution into Portal Kit. Git history attributes the inspected candidate files to the `jj-ervin` Git identity, but Git attribution is not sufficient proof of exclusive legal ownership or relicensing authority. Portal Kit's outbound AGPL license does not cure missing inbound rights.

## Behavioral evidence

- GC Portal: `npm test` at the pinned revision passed 191 of 191 tests. Node reported its SQLite API as experimental. This establishes source behavior for that environment, not deployment, production security, or Portal Kit compatibility.
- Cockpit: 21 of 21 targeted App Shell, candidate preparation/verification, distribution-shape, and Cockpit application-adapter tests passed. These are source/candidate tests, not an approved release, real-browser proof, or license grant.
- No test wrote to Portal Kit and no source file was copied.

## Candidate classification

### Governance Commons Portal

| Candidate | Reusable signal | Classification and disposition |
| --- | --- | --- |
| `src/auth/authorize.mjs` | Deny-by-default authorization, scoped grants, expiry/revocation, independent review, revision/state binding | **Contract reference.** GC action/role vocabulary and workflow state are consumer-owned. Define new generic Portal Kit envelopes and injected policy; do not port this table or function. |
| `src/auth/workspace-identity.mjs` | Trusted server membership, unique scoped actor, cross-workspace denial | **Contract reference.** GitHub numeric identity and GC role set are consumer-specific. Retain the invariant, not the implementation. |
| `src/storage/records.mjs` and immutable schema guards | Revision digest and structured audit identity | **Contract reference.** Fresh audit/revision envelopes belong in the first slice; UUID shape, storage rows, JSON encoding, and SQLite guards remain implementation decisions. |
| `src/auth/*` OAuth/session/store modules | Useful fail-closed OAuth, cookie, transaction, and session behavior | **Defer.** GitHub OAuth, loopback pilot assumptions, Node SQLite, and local key custody are deployment/provider choices, not the first platform contract. |
| `src/workflows/approval-inbox.mjs` and `src/storage/editorial-store.mjs` | Revision-aware review and approval behavior | **GC consumer-owned.** Editorial/governance/release types, roles, and transitions do not belong in core. Only generic approval binding informs Portal Kit. |
| `src/cockpit-adapter.mjs` | Fail-closed presentation-only App Shell seam | **GC consumer-owned adapter.** It correctly carries GC application identity and must remain with the consumer. It is evidence for a future Portal Kit UI-host interface, not extraction material. |
| `src/agent/model-gateway.mjs` and providers | Provider seam, bounded input/output, timeout, audit, advisory result | **Defer and redesign.** GC actions and prompts are embedded; AI is optional and outside the first slice. Later work should define a provider-neutral interface without copying prompts or provider code. |
| `src/intelligence/configured-release.mjs` and Observatory import | HTTPS allowlist, byte limits, hash pins, redirect denial, provenance | **GC integration-owned.** Useful secure-import patterns, but Observatory semantics and editorial storage stay outside core. A generic evidence-import contract can be considered later. |
| `src/integrations/sealdex-reference.mjs` | Metadata-only, allowlisted, failure-isolated reference | **GC integration-owned.** Portal Kit may later define a generic metadata-reference adapter, but Sealdex types and availability remain provider/consumer concerns. |
| Public projection, dashboard, mobile shell, local server, and GC portal definition | Working reference consumer | **Do not extract.** These are GC product, brand, deployment, and publishing surfaces. |

### Cockpit

| Candidate | Reusable signal | Classification and disposition |
| --- | --- | --- |
| `web/appShell.js` | Generic DOM presentation factory/instance with injected application/navigation data | **External UI dependency candidate.** Cockpit owns it. Do not copy or fork it. Consume only after an explicit compatible license and approved immutable artifact exist. |
| `web/cockpitApplication.js` | Separates Cockpit identity/navigation from generic shell | **Cockpit consumer-owned adapter.** Pattern supports the ownership boundary; implementation stays in Cockpit. |
| `web/cockpitState.js` | Enforces owned operational-state fields | **Cockpit-owned state contract.** Portal Kit needs its own module/state ownership contract later, not Cockpit's operational model. |
| Command review, parameter interaction, catalogs, schemas, host bridges, and provider runtime | Typed discovery and human interaction patterns | **External integration surface.** Cockpit retains provider and operator-UI ownership. Discovery is not authority; Portal Kit should integrate by versioned adapter rather than absorb the stack. |
| Local/web/cloud/desktop hosts | Useful environment proofs | **Not a Portal Kit backend.** Existing Cockpit guidance explicitly separates presentation from provider/domain authority, and the GC Portal already rejects the local host as a production multi-tenant backend. |

## Selected first slice

[ADR-0007](../decisions/0007-first-implementation-slice.md) selects a freshly authored security-contract kernel:

1. principal and workspace/tenant scope;
2. authorization request and decision;
3. revision-bound approval requirement and decision; and
4. redacted audit events for allowed and denied decisions.

This slice is smaller than extracting authentication, persistence, UI, workflows, providers, or deployment. It is independently valuable to every future consumer and preserves the rule that client state, provider metadata, and presentation do not grant authority.

## Gates before any source reuse

1. Confirm the legal copyright owner and any employer/contributor claims for every source candidate.
2. Add an explicit license or written inbound grant in the owning repository; private visibility and common authorship are not grants.
3. Verify compatibility with `AGPL-3.0-only` and any future commercial-license plan.
4. Prefer dependency/adapters over copying when another project owns the capability.
5. Pin an immutable revision or release and record exact artifact hashes.
6. Re-run positive, negative, browser, security, and integration tests proportional to the adopted surface.
7. Keep GC semantics and Cockpit authority in their owning repositories.

## PK-02 acceptance record

- [x] Actual repositories, branches, remotes, cleanliness, and upstream equality verified.
- [x] Source revisions and candidate byte identities recorded.
- [x] Repository/license evidence inspected.
- [x] Relevant implementation, architecture authority, history, and tests inspected.
- [x] Generic, consumer-owned, integration-owned, deferred, and excluded surfaces classified.
- [x] Smallest first implementation slice selected with entry gates.
- [x] No implementation code, schema, test, prompt, or asset copied.
