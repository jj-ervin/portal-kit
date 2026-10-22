# ADR-0003: Provider-neutral optional AI

**Status:** accepted
**Date:** 2026-10-22

## Decision

Portal Kit core will operate without AI. AI integrations use a provider-neutral server-side gateway, support local providers, require explicit configuration, minimize disclosed data, and remain non-authoritative.

## Consequences

No provider SDK may become an unavoidable core dependency. Model output is untrusted and cannot bypass deterministic authentication, authorization, approval, audit, or publishing controls. Cloud model use is opt-in, not a condition of use.
