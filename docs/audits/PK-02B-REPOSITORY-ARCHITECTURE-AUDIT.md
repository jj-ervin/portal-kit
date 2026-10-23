# PK-02B repository audit against approved architecture

**Status:** complete; awaiting architectural review

**Audit date:** 2026-10-22

**Portal Kit revision:** `ffd9e198f64fa270980869e16fb124b9e5881536` plus the uncommitted PK-02 inventory recovered onto the dedicated audit branch

**Source revisions:** GC Portal `85b17af949bb4112131eb1f150a6ab7083abf59e`; Cockpit `3ced7d307d57f30b77866cc41741a0895d249db5`

**PK-03 implementation status:** not started

## Decision summary

PK-01 is verified as a coherent, documentation-level product contract. Portal Kit remains an independent, self-hostable, local-first, provider-neutral platform. GC Portal is its first consumer, Cockpit owns presentation, and the adjacent systems retain their own authority.

The inspected implementations contain useful, tested behavior, but **no source is approved for extraction**. Both source repositories are private and expose no root license grant or package-level license field at the inspected revisions. Common Git authorship is provenance evidence, not redistribution permission.

PK-03 should therefore begin, after architectural approval, with freshly authored domain-neutral contracts and policy logic. The smallest defensible slice is principal/workspace scope, authorization requests and decisions, revision-bound approvals, and redacted audit events. Persistence, identity providers, UI, AI, deployment, and source reuse remain deferred.

## Scope, authority, and recovery limits

The audit used the accepted Portal Kit product, architecture-boundary, security, integration, roadmap, and ADR documents as the authoritative design baseline. They contain the recoverable PK-01 decisions and the architecture criteria attributed to PK-02A.

A project conversation titled `Portal Kit Architecture` was locally discoverable, but its answer was exposed only as an unresolved content reference. No standalone PK-02A artifact or package map was present in the checked repositories. This audit therefore does not invent a hidden framework, runtime, or previously approved package name. The logical package map below is a review proposal derived from the accepted repository contracts, not a claim that an unavailable conversation was reproduced verbatim.

Read-only inspection covered:

- `C:\dev\portal-kit`;
- `C:\Users\Jess\OneDrive\Documents\ChatGPT\governance-commons-portal 2`; and
- `C:\dev\cockpit`.

No GC Portal or Cockpit file was modified, copied, or moved.

## 1. Verified PK-01 status

| PK-01 requirement | Evidence | Result |
| --- | --- | --- |
| Independent self-hostable product | `PRODUCT-CONTRACT.md`; ADR-0001 | Verified at contract level |
| Modular, local-first, no mandatory cloud | Product required properties and extension/configuration contracts | Verified at contract level |
| GC Portal is consumer, not platform definition | Product boundary; ADR-0002 | Verified |
| Cockpit, Observatory, Sealdex, GC publishing, and WWW retain authority | `ARCHITECTURE-BOUNDARIES.md`; ADR-0004 | Verified |
| Optional, provider-neutral, non-authoritative AI | `SECURITY-CONTRACT.md`; ADR-0003 | Verified at contract level |
| Deny-by-default server security | Security invariants | Verified as a requirement; no Portal Kit runtime exists |
| Extension, configuration, upgrade, and deployment obligations visible | Product contract | Verified; implementation choices remain intentionally open |
| License selected | `LICENSE`; ADR-0006; contribution boundary | Verified as `AGPL-3.0-only` |
| No implementation extracted | Repository contains contracts, inventory, ADRs, and audit tests only | Verified |

PK-01 is **spec-complete**, not runtime-complete or release-complete. There is no Portal Kit runtime, package, persistence layer, deployment, SDK, compatibility proof, or production security claim.

## 2. Repository and dependency inventory

### Portal Kit current repository

| Surface | Current state |
| --- | --- |
| Product and boundary docs | Present and accepted for PK-01 |
| License and contribution policy | AGPL-3.0-only; outside copyrightable contributions held pending a rights policy |
| Extraction evidence | Human-readable inventory plus immutable source manifest |
| Runtime source | None |
| Package/workspace manifest | None |
| Runtime dependencies | None |
| CI | None |
| Audit validation | Node built-in test runner; no added framework or third-party dependency |

### Governance Commons Portal

| Component | Implementation and coupling |
| --- | --- |
| Browser portal and mobile preview | Static HTML/CSS/ES modules with GC-owned navigation and content |
| Cockpit boundary | GC-owned dependency-injected adapter; optional `window.AppShell`/`AppShellFactory`; fallback remains presentation-only |
| Authentication | GitHub OAuth, PKCE/state/browser binding, hardened cookies, CSRF/origin guards, invitations, sessions, revocation |
| Trusted identity | SQLite-backed membership and session context keyed to GitHub subject IDs |
| Authorization | Pure GC policy prototype plus service-local role checks; role/action/state names are GC-specific |
| Editorial workflow | SQLite transactions for candidate, revision, review, decision, publication-candidate preparation |
| Audit/revision records | Immutable revision digests and append-oriented event rows |
| Observatory integration | Server-configured HTTPS URLs, independent SHA-256 pins, redirect denial, byte limits, provenance validation |
| Sealdex integration | Metadata-only reference object; no secret values, vault access, CLI, or network access |
| AI boundary | Read-only governed model gateway and OpenAI provider; bounded evidence, advisory output, audit hook |
| Runtime/dependencies | Node.js `>=22`; no declared npm dependencies; built-in HTTP, crypto, filesystem, and experimental `node:sqlite`; external GitHub/OpenAI/HTTPS services are optional integration dependencies |

### Cockpit

| Component | Implementation and coupling |
| --- | --- |
| App Shell | Standalone UMD/CommonJS DOM presentation factory with application definition, panels, badges, lists, and navigation |
| Cockpit application/state | Cockpit-owned identity/navigation adapter and versioned operational UI state |
| Human interaction | Catalog resolver, parameter input, command review, palette flow; review is inert until explicit host invocation |
| Provider contracts | JSON Schemas for provider manifests, attestations, command catalogs, intents, requests, and results |
| Python bridge | Adapter registry plus attested external-provider discovery/invocation; integrity rechecked before spawn |
| Local web host | Express host, Python bridge client, contained file opening, install flow, explicit confirmations |
| Cloud host | Multi-tenant skeleton with GitHub authentication, tenant registry, capabilities, quotas, rate limits, and process isolation; not a proven production Portal Kit backend |
| Desktop host | Electron wrapper and installer-mode window |
| Python dependencies | Python `>=3.11`; `pyyaml>=6.0`, `jsonschema>=4.23`, `time-loc>=1.2.0`; test/package extras use pytest, Playwright, and PyInstaller |
| Node dependencies | Express 4.22.2 resolved in local/cloud/desktop locks; jsdom 30.0.1 for host-web tests; Electron 43.2.0 and electron-builder 26.15.3 for desktop |

## 3. Extract / Generalize / Keep / Defer classification

### Extract

**None.** No GC Portal or Cockpit source, schema, test, prompt, asset, role/action vocabulary, or data model is authorized for transfer into Portal Kit. The missing inbound license grants are a hard gate even where behavior is generic.

### Generalize through fresh authorship

| Invariant or seam | Portal Kit form | Source coupling to avoid |
| --- | --- | --- |
| Principal and workspace scope | Versioned principal/scope envelope with trusted-server provenance | GitHub numeric identities, GC memberships, Cockpit tenant/session shapes |
| Authorization | Domain-neutral request and allow/deny decision with reason codes | GC role/action tables and workflow states |
| Revision-bound approval | Requirement, grant, consumption, expiry, revocation, and exact-revision binding | Editorial/governance/release types and Cockpit review UI |
| Audit | Redacted allowed/denied event envelope and required sink port | GC SQL row shape, Cockpit operation result shape |
| Module/provider boundary | Capability metadata remains distinct from invocation authority | Cockpit provider schemas and host bridge implementation |
| UI host boundary | Presentation port that carries no security authority | Cockpit App Shell source and browser globals |

Fresh authorship is source-informed and must not be described as a legal clean-room process.

### Keep in the owning repository

- All GC entities, roles, actions, editorial/adoption/governance/release workflows, Observatory import mapping, Sealdex types, prompts, public projection, branding, local server, and deployment logic remain in GC Portal.
- App Shell source, Cockpit application/state, provider schemas, bridge, hosts, installers, Electron packaging, command palette, and operator UX remain in Cockpit.
- GC Portal's Cockpit adapter remains consumer-owned because it maps GC identity and navigation to a presentation dependency.
- Governance standards, approval authority, publishing, and public deployment remain outside Portal Kit.

### Defer

- Runtime language and package manager selection;
- authentication providers, OAuth, invitations, sessions, and credential custody;
- persistence engine, migrations, backup/restore, and concurrency;
- module loading, extension packaging, registry, and sandboxing;
- Cockpit distribution consumption pending license and immutable artifact approval;
- provider execution, host bridges, desktop/cloud hosts, and deployment;
- AI providers, retrieval, prompts, and tools;
- Observatory and Sealdex adapter implementations; and
- GC Portal migration/adoption, which belongs to PK-04 after the generic contracts exist.

## 4. Security invariants and coupling analysis

| Invariant | Source evidence | Audit conclusion |
| --- | --- | --- |
| Server-verified principal | GC trusted auth context, sessions, and membership records | Preserve the invariant; defer provider/storage implementation |
| Deny by default | GC authorization rejects unknown action, bad role, revoked/expired grant, and wrong scope | Generalize the decision contract; do not copy the GC table |
| Workspace isolation | GC queries and membership checks; Cockpit cloud tenant roots | Must exist in both service and persistence ports; neither browser filtering nor Cockpit state is sufficient |
| Independent revision-bound approval | GC prototype and editorial transactions; Cockpit review stops before invocation | Generalize requirement/grant/consume contracts; Cockpit review is presentation, not authorization |
| Audit allowed and denied decisions | GC stores accepted workflow events and model outcomes | Portal Kit must require denied-decision audit too; source prototypes do not establish a single universal audit boundary |
| Secret exclusion | PK-01 contract; GC Sealdex reference rejects extra secret-bearing fields | Keep secret values outside contracts; store only approved references and redacted metadata |
| Discovery is not authority | Cockpit catalogs are inert; host invocation is separate | Make capability discovery and authorization separate interfaces |
| Import is not approval/publication | Observatory import creates unverified candidates; publication candidate remains release-unverified | Keep provenance/import and domain approval as separate ports |
| AI is non-authoritative | GC model gateway limits actions and validates citations | Defer implementation; kernel must have no AI dependency |
| Fail closed on unknown versions/fields | Cockpit schemas and Portal Kit integration contract | Require exact schema versions and reject additional/unknown fields in PK-03 fixtures |

### Material coupling findings

1. **GC authorization is domain-coupled.** Roles, actions, states, resource names, and workflow transitions are embedded in policy and storage code. Copying it would make GC semantics a platform default.
2. **GC composition is infrastructure-coupled.** The local server constructs GitHub OAuth, SQLite auth, trusted identity, editorial storage, configured Observatory retrieval, and dashboard behavior directly. It is useful reference behavior, not a reusable composition root.
3. **Security policy is distributed.** Pure authorization prototypes, trusted-auth checks, and transactional store methods each enforce parts of the boundary. PK-03 needs one explicit policy contract and mandatory audit result, not another parallel role table.
4. **Cockpit is a presentation and host ecosystem, not Portal Kit authority.** App Shell is the narrowest generic seam. Command review, confirmation, catalog discovery, and provider integrity do not establish application-level identity or approval authority.
5. **Cockpit's technical surface is much broader than the first slice.** Python adapters, Node hosts, Electron, subprocess providers, and cloud tenancy would force framework and deployment decisions before the Portal Kit kernel exists.
6. **Cross-repository browser coupling is currently global-shape based.** GC Portal accepts a Cockpit browser instance or injected factory, but there is no approved licensed package or immutable release artifact. This is compatibility evidence, not a dependency ready for Portal Kit.

## 5. Proposed logical package architecture versus the repository

The following is a logical dependency map for architectural review. Names describe ownership boundaries; they do not select npm, Python, a monorepo tool, or another framework.

| Logical package | Responsibility | Allowed dependency direction | Current repository |
| --- | --- | --- | --- |
| `contracts` | Versioned envelopes, schemas, reason codes, validation | Depends on standard library only | Requirements exist in docs; no schemas/source |
| `kernel` | Pure authorization, approval, and audit-decision orchestration | Depends on `contracts` | No implementation |
| `ports` | Identity, policy, audit sink, clock, ID, persistence, UI-host, and provider interfaces | Depends on `contracts`; kernel consumes ports | Interface families named only |
| `testing` | Domain-neutral positive/negative fixtures and conformance helpers | Depends on `contracts` and public kernel API | No reusable fixtures |
| `runtime` | Composition, configuration loading, module lifecycle, health/version | Depends inward on contracts/kernel/ports | Deferred beyond the first kernel proof |
| `adapters` | Concrete persistence, identity, UI, evidence, secret-reference, and model adapters | Depends on ports; never the reverse | Deferred; consumer/provider-owned adapters stay in their repositories |
| `example` | Domain-neutral local/no-AI proof consumer | Depends only on public Portal Kit packages | Required before a reuse claim; absent |

Dependency rule:

```text
example/runtime/adapters -> ports -> kernel -> contracts
testing -------------------------------> public contracts/kernel APIs
```

The exact placement of `ports` relative to `kernel` should be resolved in the PK-03 architecture ADR: pure policy functions may receive clocks and audit emission as explicit arguments, while runtime adapters implement those capabilities. No infrastructure package may be imported by `contracts` or pure policy code.

Current-to-target gap is expected, not a defect: Portal Kit is documentation-only by design. The audit rejects creating a workspace scaffold or adopting a framework merely to make the tree resemble the target.

## 6. Prioritized PK-03 plan and acceptance tests

PK-03 starts only after this audit receives architectural review. It must be fresh work and must not modify the source repositories.

### P0 — Architecture and provenance gate

1. Select the language/runtime, package layout, schema mechanism, and test runner in an ADR.
2. Record direct dependencies, licenses, and why the standard library is insufficient.
3. Define the dependency direction and composition boundary before implementation.
4. Establish a provenance record for every new source file and fixture.

Acceptance:

- no new framework without a documented need and comparison;
- every source file has `SPDX-License-Identifier: AGPL-3.0-only`;
- no copied or mechanically translated GC Portal/Cockpit source, schemas, tests, prompts, names, or fixtures;
- `contracts` and pure policy code have no UI, persistence, network, model-provider, or consumer dependency; and
- package graph validation rejects cycles and inward dependencies on infrastructure.

### P1 — Versioned contracts and validation

Define principal/scope, authorization request/decision, approval requirement/grant/consumption, and audit event contracts.

Acceptance:

- valid domain-neutral fixtures pass;
- missing required fields, extra fields, unknown versions, unknown actions, malformed scope, and untrusted principal assertions fail closed;
- secret-like fields and raw credentials are rejected from audit and approval envelopes; and
- contracts use no GC role, action, entity, workflow, or Cockpit command vocabulary.

### P1 — Pure authorization kernel

Implement deterministic evaluation against injected policy and trusted context.

Acceptance:

- unknown action denies;
- unauthenticated or disabled principal denies;
- cross-workspace request denies;
- insufficient, revoked, or expired grant denies;
- exact resource/revision mismatch denies;
- an explicitly allowed, correctly scoped request allows; and
- both allow and deny outcomes carry stable, non-sensitive reason codes.

### P1 — Revision-bound approval kernel

Implement approval eligibility and consumption without persistence or UI.

Acceptance:

- author self-approval denies where independence is required;
- reviewer cannot approve the same revision when separation is required;
- stale revision, expired grant, revoked grant, wrong workspace, and wrong action deny;
- approval is bound to subject, action, resource, scope, and revision;
- replay or second consumption denies; and
- content revision change invalidates the prior approval.

### P1 — Mandatory redacted audit seam

Require a structured audit outcome for each security decision.

Acceptance:

- allowed and denied decisions emit events;
- event includes actor reference, action, target, scope, revision when applicable, time, request/correlation ID, result, and reason;
- credentials, tokens, raw secret values, unrestricted payloads, and model prompts never appear;
- audit-sink failure follows an explicit fail-closed policy for protected mutations; and
- deterministic tests use injected clock/ID providers.

### P2 — Contract proof and boundary tests

Create an in-memory, local-only, no-AI proof and conformance suite. Do not build production persistence, UI, or deployment.

Acceptance:

- proof runs without network access, cloud account, AI provider, browser, Cockpit, GC Portal, Observatory, or Sealdex;
- a domain-neutral example exercises allow, deny, stale revision, independent approval, replay denial, and redacted audit;
- persistence, UI, provider, and consumer policy are replaceable ports;
- failure of an optional adapter cannot make the base contract tests unavailable; and
- compatibility claims name the contract version and executed positive/negative tests.

### Exit condition

PK-03 is ready for review when the architecture ADR, dependency/provenance record, contracts, pure kernel, conformance fixtures, and actual test results are committed. It does not close PK-04, prove GC Portal adoption, authorize Cockpit reuse, or establish deployment/release readiness.

## Validation record

Executed on 2026-10-22 at the pinned source revisions:

| Check | Result |
| --- | --- |
| GC Portal `npm test` | 191 passed, 0 failed; Node emitted the expected experimental SQLite warning |
| Cockpit targeted App Shell/application suite | 21 passed, 0 failed |
| Cockpit complete web suite | 50 passed, 0 failed |
| Cockpit host-web suite | 64 passed, 0 failed; Node emitted one subprocess `shell: true` deprecation/security warning from the real provider integration path |
| Cockpit host-cloud suite | 65 passed, 1 skipped, 0 failed; Windows symlink creation was unavailable for the skipped containment case |
| Cockpit Python suite | 194 passed, 2 skipped, 0 failed |
| Cockpit desktop syntax check | Passed |
| PK-02 source blob, SHA-256, line-count, provenance, PK-01, and Markdown-link audit | See `tests/pk-02b-audit.test.mjs`; passed locally before commit |

These results establish source behavior in the inspected local environments. They do not prove production deployment, Portal Kit compatibility, package publication, redistribution rights, or adoption.

## Blockers and review decisions

Architectural review should decide:

1. whether the logical package boundaries above match the approved PK-02A intent;
2. the PK-03 runtime/package/schema choice;
3. whether audit emission is part of the kernel return value, an injected mandatory port, or both;
4. whether `ports` is a distinct package or a namespace within `contracts`/`kernel`; and
5. whether and how the Cockpit owner will publish a compatible licensed immutable App Shell artifact for later work.

Hard blockers before source reuse are an explicit inbound license/grant, copyright/contributor clearance, AGPL compatibility review, an immutable distribution, integrity metadata, and proportionate compatibility tests. None is required to start the freshly authored PK-03 contract kernel after this audit is approved.
