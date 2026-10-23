# Portal Kit

Portal Kit is a planned, independent platform for building modular, self-hostable application portals. It is local-first, has no mandatory cloud dependency, and treats identity, authorization, approvals, audit, integrations, and optional AI as explicit contracts rather than application-specific shortcuts.

The Governance Commons Portal is the first intended consumer and reference implementation. It is not the definition of Portal Kit, and no Governance Commons implementation code has been extracted into this repository.

## Current status

**Contract, extraction inventory, and proposed PK-03 architecture only. No runtime, package, deployment, extension SDK, or compatibility claim exists yet.**

PK-01 establishes the product boundary before extraction:

- [Product contract](docs/PRODUCT-CONTRACT.md)
- [Architecture and ownership boundaries](docs/ARCHITECTURE-BOUNDARIES.md)
- [Security contract](docs/SECURITY-CONTRACT.md)
- [Integration contracts](docs/INTEGRATION-CONTRACTS.md)
- [Roadmap](docs/ROADMAP.md)
- [Architecture decisions](docs/decisions/README.md)
- [PK-02 extraction inventory](docs/extraction/PK-02-INVENTORY.md)
- [Machine-readable source manifest](docs/extraction/pk-02-source-inventory.json)
- [PK-02B repository architecture audit](docs/audits/PK-02B-REPOSITORY-ARCHITECTURE-AUDIT.md)

## Product position

Portal Kit is the reusable application platform. A consuming portal supplies domain modules, policy, branding, and deployment configuration. Portal Kit supplies only the generic platform contracts and, later, their reusable implementation.

Portal Kit is not Cockpit UI, Observatory Core, Sealdex, the Governance Commons Portal, Governance Commons governance/publishing, or the Governance Commons public website. Those systems may integrate through bounded adapters while retaining their own authority.

## Licensing

Portal Kit is licensed under the [GNU Affero General Public License v3.0 only](LICENSE) (`AGPL-3.0-only`). Modified versions offered to users over a network must offer those users the corresponding source as required by the license.

The copyright owner may offer separate commercial licenses in the future. No commercial license or managed service is offered by this repository today. See [ADR-0006](docs/decisions/0006-agpl-community-license.md) and [CONTRIBUTING.md](CONTRIBUTING.md).
