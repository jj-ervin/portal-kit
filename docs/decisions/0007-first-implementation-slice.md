# ADR-0007: First implementation slice

**Status:** accepted
**Date:** 2026-10-22

## Context

PK-02 inspected Governance Commons Portal and Cockpit at immutable revisions. GC Portal contains tested authorization, workspace scoping, immutable revision/audit, model-gateway, and integration behavior, but much of it embeds GC roles, actions, records, and workflow semantics. Cockpit contains a tested generic App Shell, but Cockpit owns that surface and its private repository provides no license grant or approved distribution artifact.

The shared Git author identity in the inspected histories is useful provenance evidence. It does not by itself establish legal copyright ownership, employer clearance, permission from every contributor, or an inbound license compatible with Portal Kit's `AGPL-3.0-only` license.

## Decision

The first Portal Kit implementation slice will be a freshly authored, domain-neutral security-contract kernel containing only:

- authenticated principal and workspace/tenant scope envelopes;
- authorization request and allow/deny decision envelopes;
- revision-bound approval requirement and decision envelopes; and
- redacted audit event envelopes for allowed and denied decisions.

The slice will define interfaces, validation, and positive/negative contract fixtures. It will not copy source lines, tests, schemas, prompts, role names, action names, or data models from GC Portal or Cockpit.

This is contract-first reimplementation informed by Portal Kit's own product and security requirements. It is not represented as a legal clean-room process because PK-02 inspected the source repositories.

## Excluded from the first slice

- authentication providers, OAuth, sessions, cookies, and credential storage;
- SQLite or another persistence implementation;
- GC editorial, governance, adoption, Observatory, publishing, or Sealdex behavior;
- AI providers, prompts, retrieval, or model execution;
- Cockpit App Shell source, Cockpit state, host bridges, and provider commands;
- browser UI, deployment, extension loading, migrations, or package publication.

## Integration direction

Cockpit remains the owner of its App Shell. Portal Kit may later consume a versioned Cockpit artifact or adapter after Cockpit has an explicit compatible license, immutable distribution, integrity metadata, and browser compatibility evidence. GC Portal remains the first consumer and will map its roles, actions, revisions, and workflows onto the generic Portal Kit contracts without moving GC authority into core.

## Entry gates for implementation

PK-03 may begin only when its change explicitly:

1. defines domain-neutral field names and schemas from Portal Kit requirements;
2. includes fail-closed tests for unknown actions, cross-workspace scope, revoked or expired grants, self-approval, stale revisions, and denied-event audit;
3. contains no copied source or fixture text from the inspected repositories;
4. includes SPDX identifiers for new source files;
5. records any dependency and its license; and
6. keeps persistence, UI, provider, and consumer policy behind interfaces.

## Consequences

Portal Kit starts with its most important invariant rather than with a visual shell or a copied application. The first slice will not produce a user-facing portal. UI integration and consumer migration follow only after the generic contract is independently testable and source-reuse rights are explicit.
