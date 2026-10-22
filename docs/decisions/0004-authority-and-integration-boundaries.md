# ADR-0004: Authority stays with owning systems

**Status:** accepted
**Date:** 2026-10-22

## Decision

Portal Kit will integrate through versioned, least-privilege adapters. It will not absorb the authority of Cockpit, Observatory Core, Sealdex, Governance Commons governance/publishing, or a consumer application.

## Consequences

Discovery is not permission, import is not approval, approval presentation is not authorization, export is not publication, and metadata is not a secret value. Every protected action is re-authorized at the server boundary under the consuming application's policy.
