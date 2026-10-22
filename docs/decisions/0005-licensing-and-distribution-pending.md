# ADR-0005: Licensing and distribution model pending

**Status:** superseded by ADR-0006
**Date:** 2026-10-22

## Context

The repository is public, but public visibility does not grant a software license. Portal Kit may eventually support community use, commercial services, or both. Code reuse from adjacent repositories also depends on compatible licenses and provenance.

## Decision required

Before implementation code is publicly distributed, choose and document:

- source license and copyright notices;
- contribution and contributor-license policy;
- dependency and extracted-code compatibility;
- trademark and product-name policy;
- package and binary distribution terms; and
- the boundary, if any, between an open self-hosted product and future paid offerings.

PK-01 intentionally selected no option. ADR-0006 later chose `AGPL-3.0-only` for the public product and preserved the copyright owner's ability to offer separate commercial licenses. The contributor-rights and trademark policies remain future decisions.
