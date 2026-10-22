# Public product roadmap

This roadmap describes product sequence, not release dates or current implementation claims.

## PK-01 — Product contract and boundaries

**Status:** complete at the documentation level

- Define the independent self-hostable platform.
- Separate Portal Kit from its first consumer and adjacent systems.
- Record security, integration, ownership, non-goals, and pending decisions.
- Extract no code.

## PK-02 — Extraction inventory and provenance

- Inventory reusable seams in GC Portal and Cockpit at immutable revisions.
- Classify code as platform-generic, consumer-specific, third-party, or unsuitable for extraction.
- Verify licenses, authorship, dependencies, and test coverage.
- Propose the smallest extraction slice; require review before copying code.

## PK-03 — Core contracts and architecture proof

- Select runtime, package, persistence, and configuration architecture.
- Define versioned module, identity, authorization, audit, approval, and provider interfaces.
- Build contract fixtures and negative tests without GC-specific semantics.
- Demonstrate no-AI, local-only operation.

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
