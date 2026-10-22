# Portal Kit product contract

**Status:** accepted for PK-01
**Scope:** product and boundary contract only
**Implementation status:** not started

## Product promise

Portal Kit will be an independent, reusable application platform that organizations can run in infrastructure they control. It will provide modular portal composition without requiring a vendor-hosted control plane, a particular governance domain, or an AI provider.

The first intended consumer is Governance Commons Portal. That consumer is a reference implementation and integration proving ground, not a special case embedded into the platform.

## Required properties

1. **Self-hostable first.** A documented deployment under the operator's control is the primary product path. A managed service is outside the current horizon and may be considered only after the self-hosted product is independently viable.
2. **Modular.** Domain capabilities are supplied as explicit modules or adapters with versioned contracts. The core does not absorb consumer-specific workflows.
3. **Local-first.** A useful single-operator or small-team deployment must not require a Portal Kit cloud account or permanent internet connection. External services may be configured for features that inherently depend on them.
4. **Provider-neutral.** AI, identity, storage, notification, and evidence providers are replaceable integrations. No AI provider is required for core portal operation.
5. **Secure by contract.** Authentication, authorization, approvals, audit, tenancy, and revision binding are server-side responsibilities with deny-by-default behavior.
6. **Upgradable and inspectable.** Configuration, data migrations, compatibility, backup, restore, and rollback must be documented and testable before a release is called production-ready.

## Product layers

| Layer | Portal Kit owns | Consumer owns |
| --- | --- | --- |
| Core runtime | Module lifecycle, routing seams, configuration loading, service boundaries, health and version reporting | Domain services and workflows |
| Identity and access | Authentication interfaces, membership/RBAC enforcement points, session and tenant/workspace boundaries | Identity-provider choice, role vocabulary mapping, membership policy |
| Approval and audit | Revision-bound approval primitives, audit event contract, append-oriented evidence hooks | Which actions require approval, reviewer policy, domain event meanings |
| User experience | Generic application composition contracts and host adapters | Brand, navigation, content, domain views; optional Cockpit UI adapter |
| Integrations | Versioned adapter lifecycle, capability declaration, permission boundaries, failure isolation | Provider selection, credentials, allowlists, data mapping |
| Operations | Deployment interface, configuration schema, migrations, backup/restore/rollback contracts | Infrastructure, secrets custody, monitoring targets, release authorization |

## Extension contract

The eventual extension system must:

- use a versioned manifest and declared compatibility range;
- declare capabilities, permissions, data access, network access, and side effects;
- be denied access not explicitly granted;
- isolate failures so an optional extension cannot make the base portal unavailable;
- expose deterministic install, enable, disable, upgrade, and removal behavior;
- preserve audit and approval requirements across extension boundaries; and
- never turn discovery metadata into execution permission.

The packaging format, runtime isolation mechanism, SDK, registry, and compatibility policy remain design work. PK-01 does not select them.

## Configuration contract

Configuration must be schema-versioned, portable, validated before activation, and separable from secrets. Configuration may contain secret references but not secret values in distributable files, logs, browser state, or audit payloads. Precedence rules and reload/restart behavior must be explicit before implementation.

## Upgrade contract

An upgrade mechanism must identify the current and target versions, check compatibility before mutation, back up state, apply ordered migrations, verify the result, and support a documented recovery or rollback path. A successful build or migration script alone is not upgrade proof.

## Deployment contract

The first supported deployment profile must be self-hosted and reproducible. Supported operating systems, architectures, database choices, reverse proxies, TLS responsibilities, backup destinations, and availability expectations remain pending architecture decisions. There is no managed-service commitment in PK-01.

## Licensing and open-source status

The repository's public visibility is not a license. The open-source license, contribution model, commercial terms, trademark policy, and any future managed-service boundary remain undecided. No code extraction may assume a license-compatible dependency path until ADR-0005 is resolved.

## Non-goals

Portal Kit is not:

- a hosted SaaS or mandatory vendor control plane;
- a Governance Commons rules engine, standards repository, certification authority, editorial authority, or publishing system;
- Cockpit UI or a fork of Cockpit;
- an Observatory evidence producer, verifier, ranking system, or publication authority;
- Sealdex, a secrets manager, a credential broker, or a system of record for secret values;
- the Governance Commons public website or its deployment pipeline;
- an autonomous agent that may approve, publish, mutate, or deploy without explicit authority;
- a promise of multi-tenant production readiness, compliance, zero-trust certification, or a managed service; or
- a place to copy GC Portal code before reusable seams, provenance, and licensing are reviewed.

## PK-01 acceptance criteria

- [x] Independent self-hostable, modular, local-first product is defined.
- [x] Governance Commons Portal is named as first consumer/reference implementation without making it the platform.
- [x] Cockpit UI, Observatory Core, Sealdex, GC governance/publishing, and the public website have explicit boundaries.
- [x] Optional AI integration is provider-neutral and non-authoritative.
- [x] Authentication, RBAC, audit, approvals, tenancy, and revision binding have a minimum security contract.
- [x] Extension, configuration, upgrade, and deployment obligations are named without prematurely selecting an implementation.
- [x] Ownership and integration contracts are recorded.
- [x] Non-goals and staged roadmap are recorded.
- [x] Architecture decisions and pending decisions are visible.
- [x] No implementation code is extracted.
