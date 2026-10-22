# ADR-0002: GC Portal is the first reference consumer

**Status:** accepted
**Date:** 2026-10-22

## Decision

Governance Commons Portal will be the first consumer and reference implementation of Portal Kit. GC-specific workflows, policy, data, approval semantics, publishing, and branding remain in GC Portal and its owning repositories.

## Consequences

Extraction must begin with an inventory and ownership review. Code moves only when its contract is domain-neutral, provenance and license are known, and tests establish the reusable behavior. PK-01 moves no code.
