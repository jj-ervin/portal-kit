# ADR-0001: Self-hostable platform first

**Status:** accepted
**Date:** 2026-10-22

## Decision

Portal Kit will first become an independently useful self-hostable platform with no mandatory Portal Kit cloud account or vendor control plane. A managed service is deferred until much later and requires a separate decision supported by operational and adoption evidence.

## Consequences

Deployment, upgrades, backup/restore, local administration, and operator-visible failure modes are product responsibilities. Cloud-only assumptions are not allowed in core contracts. This decision does not promise air-gapped support or select a deployment stack.
