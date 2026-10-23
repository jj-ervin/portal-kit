# PK-03 dependency and provenance record

**Status:** active
**Date:** 2026-10-22
**Implementation branch:** `pk-03-contracts`

## Scope

This record covers the first implementation step approved by ADR-0008: the root npm workspace and freshly authored `@portal-kit/contracts` package. It does not add the policy kernel, ports, persistence, UI, providers, deployment, AI, or a consumer adapter.

No Governance Commons Portal or Cockpit source, schema, test, prompt, fixture, role, action, or data model was copied or mechanically translated. Those repositories were not modified for this work.

## Runtime and direct dependency

| Component | Pinned version | License | Purpose |
| --- | --- | --- | --- |
| Node.js | `>=24` | MIT | Approved runtime, ESM support, standard test runner, and standard-library APIs |
| Ajv | `8.20.0` | MIT | JSON Schema Draft 2020-12 compilation and validation |

Ajv is the only third-party runtime dependency. The exact package and transitive dependency versions are recorded in `package-lock.json`. The standard library does not provide Draft 2020-12 validation, so the dependency is required by ADR-0008 rather than added for general convenience.

The locked JavaScript dependency inventory, including Ajv's transitive dependencies, is:

| Package | Locked version | License |
| --- | --- | --- |
| `ajv` | `8.20.0` | MIT |
| `fast-deep-equal` | `3.1.3` | MIT |
| `fast-uri` | `3.1.9` | BSD-3-Clause |
| `json-schema-traverse` | `1.0.0` | MIT |
| `require-from-string` | `2.0.2` | MIT |

## Fresh-authorship inventory

The following implementation artifacts were authored for Portal Kit from its public contracts and accepted ADRs:

- root and contracts package manifests;
- versioned shared, principal/scope, authorization request/decision, approval requirement/grant/consumption, and audit-event JSON Schemas;
- the fail-closed contract validation API;
- domain-neutral positive and negative contract fixtures; and
- package-boundary and SPDX validation tests; and
- CI installation and full-suite execution through the lockfile.

All JavaScript source and tests use `SPDX-License-Identifier: AGPL-3.0-only`. JSON Schemas carry the same identifier in `$comment`, because JSON has no comment syntax.

## Deferred boundaries

- `kernel`, `ports`, `testing`, runtime composition, adapters, and example packages;
- authentication and identity-provider implementations;
- production persistence, migrations, backup, restore, and concurrency;
- UI, Cockpit consumption, provider execution, network access, and AI; and
- package publication or a GC Portal adoption claim.
