# Integration contracts

## Common adapter envelope

Every integration must declare:

- stable provider and adapter identifiers;
- contract version and compatibility range;
- capabilities and operations;
- read/write and side-effect classification;
- required permissions and approval policy;
- tenant/workspace and data scope;
- input/output schemas and error model;
- network, process, filesystem, and secret-reference needs;
- timeout, retry, idempotency, and failure-isolation behavior; and
- audit, provenance, health, and version metadata.

Unknown providers, versions, capabilities, operations, fields, or scopes fail closed. Provider discovery never grants execution authority.

## Reference integrations

### Governance Commons Portal

GC Portal owns all GC-specific routes, entities, vocabulary, workflows, approval policy, publishing decisions, and branding. It consumes Portal Kit through public platform interfaces. It is the first reference consumer, but Portal Kit acceptance requires at least one domain-neutral example or contract fixture before claiming reusable extraction.

### Cockpit UI

Cockpit may supply app-shell and presentation primitives through a pinned, reviewed dependency or adapter. Portal Kit owns no Cockpit provider execution authority. Server-side Portal Kit services must independently authenticate and authorize every protected operation. Licensing and exact reusable exports must be verified before code reuse.

### Observatory Core

The initial integration is read-only import of an approved, deterministic, checksum-pinned export. Portal Kit verifies bytes and provenance according to the adapter contract, preserves source identity, and queues consumer-owned candidates. Import never implies review, endorsement, conformance, ranking, publication, or permission to mutate Observatory records.

### Sealdex

The initial integration is optional and metadata-only. It may resolve allowlisted non-secret asset, release, deployment, account, or secret-reference metadata through a reviewed read-only provider. It must not accept or return secret values, vault contents, arbitrary SQL, arbitrary shell commands, or cross-workspace data. Portal Kit and consuming applications remain functional when Sealdex is absent or offline.

### Governance Commons publishing and website

Portal Kit may expose a generic, allowlisted export interface. GC-specific projection, human approval, protected CI, release authorization, deployment, correction, and public provenance remain owned by GC repositories. The public website is a downstream consumer of released public artifacts, not a view over Portal Kit's private database.

### AI providers

AI adapters implement a common model interface and declare modalities, tool support, data destinations, retention assumptions, and limits. Local and remote providers are optional peers. AI adapters do not receive implicit access to application data or tools and may be disabled without disabling the base platform.

## Compatibility

Compatibility claims require a named Portal Kit contract version, named provider/consumer versions or immutable revisions, executed positive and negative tests, and recorded limitations. Source similarity, successful compilation, or a synthetic fixture alone is not adoption proof.
