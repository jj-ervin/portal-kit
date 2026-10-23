# ADR-0008: PK-03 runtime, package, and boundary architecture

**Status:** accepted
**Date:** 2026-10-22

## Context

PK-01 defines Portal Kit as an independent, self-hostable, local-first, modular platform with no mandatory cloud or AI provider. PK-02B found reusable security behavior in GC Portal and reusable presentation behavior in Cockpit, but approved no source extraction. ADR-0007 therefore limits the first implementation slice to freshly authored, domain-neutral contracts for principal/workspace scope, authorization, revision-bound approval, and redacted audit events.

PK-03 must choose enough architecture to implement and test that slice without prematurely selecting production persistence, authentication, UI, deployment, extension loading, or provider integrations. The package graph must keep policy independent of infrastructure and must not require a new orchestration framework.

## Decision

### Runtime and source language

Use Node.js 24 or later on supported LTS release lines, ECMAScript modules, and modern JavaScript with JSDoc for public type information.

- Declare `node >=24` when the root package manifest is introduced.
- Exercise the supported minimum and current active LTS in CI once executable packages exist.
- Do not add TypeScript or a transpilation/bundling step for the first slice. Reconsider only if public-contract ergonomics or cross-package refactoring demonstrates a concrete need.
- Use the built-in `node:test` runner and `node:assert/strict`; add no test framework for PK-03.

Node 24 is the baseline because this is a new package, the local environment already runs Node 24, Node 24 remains supported through April 2028, and the inspected GC Portal already targets modern Node. Supporting Node 22 would shorten the maintenance horizon without proving a required consumer constraint.

### Repository and package management

Use one repository with npm workspaces and independently bounded packages. Do not add a monorepo orchestrator, application framework, dependency-injection container, build system, or code generator for the first slice.

The initial logical layout is:

```text
packages/
  contracts/   versioned data contracts, JSON Schemas, and validation
  kernel/      pure authorization and approval decisions
  ports/       infrastructure-facing interfaces
  testing/     public conformance fixtures and helpers
```

`runtime`, concrete `adapters`, and a domain-neutral `example` remain named architecture targets, not directories to create in the first contract commit. They are added only when their acceptance criteria become active.

Workspace package names may use the `@portal-kit/*` namespace internally, but packages remain private until registry ownership, public names, exports, provenance, and publication gates are reviewed.

### Contract representation and validation

JSON Schema Draft 2020-12 is the portable wire-contract representation. Schemas are freshly authored from Portal Kit requirements and are the authority for serialized envelope shape.

- Every schema has an immutable versioned `$id` and explicit `schema_version` discriminator.
- Object schemas reject unknown fields with `additionalProperties: false` unless a specific extension point is intentionally declared.
- Unknown schema versions, actions, fields, scopes, and decision values fail closed.
- Schemas contain references and redacted metadata, never credentials or raw secret values.
- JavaScript APIs return frozen values and do not expose mutable internal policy state.

Use Ajv 8 as the only planned third-party runtime dependency for Draft 2020-12 validation. Ajv is MIT-licensed and compatible with Portal Kit's AGPL-3.0-only distribution. Pin the exact version in the lockfile when implementation begins, record it in the dependency/provenance inventory, and do not add plugins unless a contract requires them.

### Dependency direction

The architecture uses dependency inversion without a framework:

```text
kernel  ---> contracts
ports   ---> contracts
runtime ---> kernel + ports + contracts
adapters ---> ports + contracts
testing ---> public contracts and kernel APIs
example ---> public packages only
```

Rules:

1. `contracts` depends only on the JavaScript standard library plus its selected schema validator.
2. `kernel` is deterministic policy code. It imports no filesystem, network, database, browser, clock, random-ID, AI, GC Portal, or Cockpit implementation.
3. `ports` declares small infrastructure-facing interfaces and depends on contracts, not on runtime or adapters.
4. `runtime` will be the composition root. Concrete adapters point inward through ports; contracts and kernel never import adapters.
5. Consumer policy maps consumer-owned roles and actions onto Portal Kit requests outside the kernel. No GC vocabulary becomes a default.
6. Package-boundary tests must reject cycles and forbidden imports before a package graph is called stable.

### Authorization and approval boundary

The kernel receives already-authenticated, server-trusted principal and scope context. It does not authenticate users or accept browser-asserted roles as trusted context.

Authorization and approval evaluation are pure operations. Callers supply explicit current time, request/correlation ID, and exact resource revision as data. The kernel returns a decision and a mandatory redacted audit event together; callers cannot obtain a security decision without its corresponding event.

Approval artifacts bind subject, action, resource, workspace, revision, expiry, and consumption identity. Unknown actions, cross-workspace scope, revoked or expired grants, self-approval, stale revisions, and replay deny by default.

### Audit delivery boundary

The pure kernel creates the audit event but performs no I/O. A future runtime must deliver the event through a required `AuditSink` port before committing a protected mutation.

- Audit delivery failure blocks the protected mutation.
- Read-only decisions may return a failure result when audit delivery is unavailable; silently dropping the event is not allowed.
- Audit payloads use allowlisted fields and stable reason codes. They exclude credentials, tokens, secret values, unrestricted request payloads, and model prompts.
- Persistence may later make mutation and audit atomic, but PK-03 does not choose a database.

### Persistence and configuration

PK-03 defines ports and contracts only; it selects no production persistence engine.

- Repositories are workspace-scoped by contract and must accept scope explicitly on every operation.
- In-memory fakes are permitted only for deterministic contract proof.
- SQLite, another database, migrations, backup, restore, and concurrency proof remain later architecture decisions.
- Configuration is schema-versioned data supplied to a future composition root. It may contain secret references but never secret values.
- Environment variables, files, and secret stores are adapter concerns, not kernel dependencies.

### UI, provider, and AI boundaries

- Cockpit remains an optional presentation dependency. No Cockpit source, browser global, host bridge, provider schema, or application state enters these packages.
- Capability discovery remains separate from invocation authorization.
- GC Portal remains a future consumer adapter and owns its roles, actions, workflows, and publishing authority.
- The first proof runs locally with no UI, network, cloud account, provider, or AI dependency.

## First implementation sequence after acceptance

1. Introduce the root npm workspace and dependency/provenance record.
2. Implement `contracts` schemas and fail-closed validation fixtures.
3. Implement the pure authorization kernel with mandatory audit-event output.
4. Implement revision-bound approval evaluation and replay-consumption contract.
5. Define the minimal audit, clock, ID, and approval-consumption ports.
6. Publish only an internal conformance proof; do not publish packages or claim GC Portal adoption.

Each step requires its own scoped tests and may be committed separately on the PK-03 branch.

## Acceptance gates

- The architecture validation test confirms every decision required by PK-02B is present.
- No implementation package or runtime source is added by this ADR-only change.
- No GC Portal or Cockpit source, schema, test, prompt, fixture, role, action, or data model is copied or mechanically translated.
- The proposed third-party dependency and license are recorded before installation.
- The package graph and audit-delivery rules are explicit and fail closed.
- Architecture review is complete: PR #2 merged this ADR and established its status as `accepted` before PK-03 implementation.

## Consequences

The first slice remains small and testable without a framework, database, browser, or cloud service. JSON Schema provides language-neutral contracts; ESM and the Node test runner minimize tooling. A single planned validator dependency is justified by standards-compliant schema behavior rather than convenience.

The tradeoff is less compile-time guidance than TypeScript and no production runtime, persistence, or UI proof in the first commits. That is intentional: those concerns are isolated until the security contracts and dependency direction are stable.

## Alternatives considered

### TypeScript workspace

Deferred. It provides stronger static types but adds a compiler, generated declarations, source maps, and build/publish decisions before the contract is proven. JSDoc and JSON Schema are sufficient for the first slice.

### Python packages

Rejected for the first slice. Python is viable for adapters, but Node aligns with the first consumer and the browser-adjacent contract ecosystem while keeping one runtime for initial conformance tests.

### Copy or package GC Portal/Cockpit components

Rejected. PK-02B found no approved inbound license grant, and the implementations carry consumer/provider semantics outside the first slice.

### One undivided package

Rejected. It would make later persistence, UI, and provider dependencies easier to leak into policy code and would weaken independent contract testing.

### Microservices or a plugin framework

Rejected. The first slice is a library-level security kernel. Process boundaries, service discovery, sandboxing, and extension distribution are not justified yet.

## References

- [Node.js release schedule](https://github.com/nodejs/Release#release-schedule)
- [Node.js test runner](https://nodejs.org/docs/latest-v24.x/api/test.html)
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12)
- [Ajv license](https://github.com/ajv-validator/ajv/blob/master/LICENSE)
- [PK-02B repository architecture audit](../audits/PK-02B-REPOSITORY-ARCHITECTURE-AUDIT.md)
- [ADR-0007](0007-first-implementation-slice.md)
