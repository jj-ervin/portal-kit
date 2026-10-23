# Public product roadmap

This roadmap describes product sequence, not release dates or current implementation claims.

## PK-01 — Product contract and boundaries

**Status:** complete at the documentation level

- Define the independent self-hostable platform.
- Separate Portal Kit from its first consumer and adjacent systems.
- Record security, integration, ownership, non-goals, and pending decisions.
- Extract no code.

## PK-02 — Extraction inventory and provenance

**Status:** complete at the documentation level

- Inventory reusable seams in GC Portal and Cockpit at immutable revisions.
- Classify code as platform-generic, consumer-specific, third-party, or unsuitable for extraction.
- Verify licenses, authorship, dependencies, and test coverage.
- Propose the smallest extraction slice; require review before copying code.

Result: [PK-02 inventory](extraction/PK-02-INVENTORY.md), [PK-02B repository architecture audit](audits/PK-02B-REPOSITORY-ARCHITECTURE-AUDIT.md), and [ADR-0007](decisions/0007-first-implementation-slice.md). No code moved. The selected PK-03 starting point is a freshly authored, domain-neutral security-contract kernel; source reuse remains blocked on explicit inbound rights and compatibility review. PK-03 has not started and requires architectural review of the audit first.

## PK-03 — Core contracts and architecture proof

**Status:** in progress at the architecture-review level; implementation not started

- Select runtime, package, persistence, and configuration architecture.
- Define versioned module, identity, authorization, audit, approval, and provider interfaces.
- Build contract fixtures and negative tests without GC-specific semantics.
- Demonstrate no-AI, local-only operation.

Current review artifact: [ADR-0008](decisions/0008-pk-03-runtime-package-and-boundary-architecture.md). Its status is `proposed`; implementation remains gated on acceptance.

## PK-04 — First reusable platform slice

- Implement the reviewed generic slice.
- Adapt GC Portal as the first consumer without moving GC authority into core.
- Prove compatibility through pinned revisions and integration tests.
- Include a domain-neutral example or fixture.

## PK-05 — Self-hosted release candidate

- Provide a reproducible supported deployment profile.
- Prove configuration, upgrade, migration, backup, restore, rollback, and observability.
- Complete security review and operator documentation.
- Implement AGPL source-offer compliance in every network user interface.
- Adopt a reviewed contributor-rights policy before accepting outside code or documentation.
- Verify that every dependency and extracted source is compatible with `AGPL-3.0-only`.

## Later, explicitly out of current scope

- Additional reference consumers and extension ecosystem.
- Broader deployment profiles and support commitments.
- Commercial packaging or services.
- A managed Portal Kit service, only after the self-hosted platform has real operational and adoption evidence.
