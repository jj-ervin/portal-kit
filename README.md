# Portal Kit

Portal Kit is a planned, independent platform for building modular, self-hostable application portals. It is local-first, has no mandatory cloud dependency, and treats identity, authorization, approvals, audit, integrations, and optional AI as explicit contracts rather than application-specific shortcuts.

The Governance Commons Portal is the first intended consumer and reference implementation. It is not the definition of Portal Kit, and no Governance Commons implementation code has been extracted into this repository.

## Current status

**Contract only. No runtime, package, deployment, extension SDK, or compatibility claim exists yet.**

PK-01 establishes the product boundary before extraction:

- [Product contract](docs/PRODUCT-CONTRACT.md)
- [Architecture and ownership boundaries](docs/ARCHITECTURE-BOUNDARIES.md)
- [Security contract](docs/SECURITY-CONTRACT.md)
- [Integration contracts](docs/INTEGRATION-CONTRACTS.md)
- [Roadmap](docs/ROADMAP.md)
- [Architecture decisions](docs/decisions/README.md)

## Product position

Portal Kit is the reusable application platform. A consuming portal supplies domain modules, policy, branding, and deployment configuration. Portal Kit supplies only the generic platform contracts and, later, their reusable implementation.

Portal Kit is not Cockpit UI, Observatory Core, Sealdex, the Governance Commons Portal, Governance Commons governance/publishing, or the Governance Commons public website. Those systems may integrate through bounded adapters while retaining their own authority.

## Licensing

The repository is public, but no license has been granted yet. The open-source and commercial licensing model is an explicit pending decision; see [ADR-0005](docs/decisions/0005-licensing-and-distribution-pending.md). Until a license is added, normal copyright restrictions apply.
