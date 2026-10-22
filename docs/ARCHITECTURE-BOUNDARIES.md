# Architecture and ownership boundaries

## Dependency rule

Portal Kit must remain useful without Governance Commons, Cockpit, Observatory Core, Sealdex, an AI provider, or the Governance Commons website. Integrations point from a consumer-owned adapter toward a versioned Portal Kit interface; they do not move external authority into Portal Kit.

## System boundaries

| System | Owns | Portal Kit relationship | Must not happen |
| --- | --- | --- | --- |
| Portal Kit | Generic portal runtime and cross-cutting platform contracts | Platform | Embed consumer-specific governance or publishing rules in core |
| GC Portal | Private GC discovery, editorial, adoption, review, and release-approval workflows; its data and policy | First consumer and reference implementation | Treat GC workflow behavior as a universal default or extract it without review |
| Cockpit UI | Generic operator presentation, app-shell primitives, host-neutral messages, and provider presentation contracts | Optional UI adapter/dependency | Treat browser state or approval presentation as authorization; deploy Cockpit's local host as Portal Kit's production backend |
| Observatory Core | Evidence contracts and approved, checksum-pinned publication exports | Optional read-only evidence/import provider | Let import imply verification, approval, drafting, ranking, or publication |
| Sealdex | Local operational metadata and non-secret references; external vault remains secret authority | Optional metadata-only adapter | Store secrets, expose a personal database, traverse vaults, or make Portal Kit availability depend on Sealdex |
| GC governance and publishing | Standards, normative decisions, editorial authority, protected releases, and public-projection rules | Consumer-owned domain modules and external workflows | Let Portal Kit redefine standards, approve content, or publish autonomously |
| governancecommons.org | Public static website and its independent release/deployment pipeline | Separate downstream public surface | Bundle private portal records or couple website deployment to Portal Kit runtime |

## Ownership rules

1. **Core changes** belong in Portal Kit only when at least one non-GC consumer could use them without importing GC terminology or policy.
2. **Domain changes** belong in the consumer when they define business objects, workflows, approval policy, publication semantics, or brand experience.
3. **UI primitives** stay owned by Cockpit when they are genuinely generic. Portal Kit may depend on a pinned, license-compatible release or implement an adapter; it must not silently fork the UI contract.
4. **Provider capabilities** remain owned by their provider. Portal Kit discovers and invokes only declared interfaces under explicit authorization.
5. **Normative governance** remains in Governance Commons. Portal Kit can carry evidence and enforcement hooks but cannot create GC authority.
6. **Public delivery** remains owned by each public surface's release process. Portal Kit may prepare a bounded export but cannot equate export with publication.

## Core interface families

The initial architecture must define versioned interfaces for:

- identity and authenticated principal context;
- workspace/tenant membership and RBAC decisions;
- revision-bound approval requests and decisions;
- audit event emission and retrieval;
- module discovery, lifecycle, health, and compatibility;
- configuration validation and secret-reference resolution;
- provider invocation and structured results;
- evidence/import adapters with provenance and checksums;
- backup, restore, migration, and operational health; and
- optional model inference and tool mediation.

Descriptions are not permission. Capability discovery does not authorize invocation, and a successful adapter call does not authorize a domain action.

## Data ownership

Portal Kit may define generic storage interfaces and migrations. Each record type must still name its owning module, tenant/workspace scope, retention rules, export classification, and deletion authority. Consumer-private records may not enter public bundles by default. Secrets must stay in an external secret store; Portal Kit stores only approved references and redacted metadata.
