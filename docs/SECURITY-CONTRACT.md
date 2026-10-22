# Security contract

This is the minimum contract for any Portal Kit implementation. It is not a claim that controls exist today.

## Invariants

- Protected actions require a server-verified authenticated principal.
- Authorization is deny by default and evaluated for tenant/workspace, role, action, resource, and exact revision where relevant.
- Browser state, client-supplied roles, model output, provider metadata, and UI approval state are untrusted inputs.
- High-impact actions require explicit, bound, expiring, single-use approval artifacts when policy calls for approval.
- Approval is separate from authentication and from capability discovery. A subject cannot self-approve where independent review is required.
- Content edits invalidate approvals bound to an earlier revision.
- Allowed and denied security-relevant actions produce redacted audit events with actor, action, target, scope, revision, time, request/correlation identifier, result, and justification where required.
- Tenant/workspace isolation is enforced at service and persistence boundaries, not only in queries or UI filters.
- Credentials and secret values remain server-side or in an external secret store; they never enter browser bundles, model prompts by default, logs, evidence payloads, or extension manifests.
- External retrieval and callbacks require allowlists, origin/redirect validation, CSRF protection where applicable, request limits, timeouts, and SSRF defenses.
- Sessions, invitations, approvals, and delegated provider credentials are revocable and expire.
- Backup confidentiality, restore integrity, migration safety, and audit continuity are release gates.

## AI boundary

AI is optional and non-authoritative. Model providers receive only the minimum explicitly selected context. Provider credentials stay server-side. Model output is untrusted content and cannot grant permissions, approve revisions, change configuration, invoke tools, publish, or deploy without the same deterministic authorization and approval checks applied to non-AI callers.

The platform must expose a provider-neutral model gateway contract with capability declaration, request limits, redaction, audit hooks, failure isolation, and a no-AI mode. Local providers must be possible; cloud providers must be opt-in.

## Extension boundary

Extensions execute with declared least privilege. Installation is not authorization. Enabling a new permission, data scope, network destination, mutation capability, or tool requires a visible review and approval path. Extension identity and version must be included in audit records.

## Security acceptance gate

No implementation is production-ready until threat modeling, authorization and isolation tests, approval replay/revision tests, audit integrity tests, secret-leak checks, backup/restore proof, dependency and artifact review, and an explicit owner release decision are complete for a named version and deployment profile.
