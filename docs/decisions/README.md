# Architecture decision records

| ADR | Status | Decision |
| --- | --- | --- |
| [0001](0001-self-hostable-platform-first.md) | accepted | Build an independent self-hostable platform before considering a managed service. |
| [0002](0002-gc-portal-reference-consumer.md) | accepted | Treat GC Portal as the first consumer/reference implementation, not as Portal Kit itself. |
| [0003](0003-provider-neutral-optional-ai.md) | accepted | Keep AI optional, provider-neutral, non-authoritative, and compatible with local operation. |
| [0004](0004-authority-and-integration-boundaries.md) | accepted | Keep authority with owning systems and use versioned, least-privilege adapters. |
| [0005](0005-licensing-and-distribution-pending.md) | superseded | Recorded the licensing decision while it was pending. |
| [0006](0006-agpl-community-license.md) | accepted | Use `AGPL-3.0-only` for the public product and preserve the option for separate commercial licenses. |
| [0007](0007-first-implementation-slice.md) | accepted | Start with a new domain-neutral security-contract kernel; copy no GC Portal or Cockpit code. |

Accepted ADRs define the current direction. Proposed ADRs record an unresolved decision and must not be treated as authorization to implement a particular choice. Superseded ADRs remain as decision history.
