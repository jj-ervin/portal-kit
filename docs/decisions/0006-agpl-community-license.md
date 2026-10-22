# ADR-0006: AGPL community license

**Status:** accepted
**Date:** 2026-10-22

## Context

Portal Kit is intended to be a self-hostable, network-interactive application platform. A permissive license would maximize reuse but would allow modified proprietary hosted versions without a source-sharing obligation. The product may later support paid commercial licensing or a managed service, but neither exists today.

## Decision

License the public Portal Kit repository under the GNU Affero General Public License version 3 only (`AGPL-3.0-only`). Do not add the "or any later version" option.

The copyright owner retains the right to offer the same owner-controlled work under separate commercial terms. This is an option, not a claim that a commercial license is currently available.

Do not accept external code or documentation contributions until a contributor agreement or equivalent rights policy is adopted that preserves the intended licensing options. Issue reports and design proposals do not transfer implementation rights.

## Consequences

- Users may run, study, modify, and redistribute Portal Kit under the AGPL terms.
- A modified version used to interact with users over a network must offer those users its corresponding source as required by AGPL section 13.
- Every future network user interface needs a prominent source-code offer appropriate to the deployed version.
- Dependencies, copied code, generated assets, and extracted GC Portal or Cockpit work require provenance and compatibility review before inclusion.
- Proprietary modules and commercial licensing require legal and architectural review; calling something an extension does not by itself place it outside the copyleft boundary.
- The trademark policy and actual commercial terms remain undecided.

## Alternatives considered

### Apache-2.0

Apache-2.0 provides broad reuse rights and an express patent grant, but it does not require a modified hosted version to publish its source. That tradeoff does not fit the current goal of keeping improvements to the self-hosted network platform available to its users.

### No license

Leaving the public repository unlicensed would prevent normal open-source use and contribution. It would contradict the intended self-hostable community product.

## Review gate

Before accepting outside contributions or selling commercial terms, obtain qualified legal review of copyright ownership, contributor agreements, dependency compatibility, extension boundaries, trademarks, and the commercial license text.
