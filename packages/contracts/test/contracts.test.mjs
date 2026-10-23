// SPDX-License-Identifier: AGPL-3.0-only

import assert from "node:assert/strict";
import test from "node:test";

import { CONTRACT_VERSIONS, getContractSchema, validateContract } from "../src/index.mjs";

const knownActions = ["record.inspect", "record.change"];
const timestamp = "2026-10-23T06:30:00Z";
const target = { resource_type: "record", resource_id: "item-17", revision: "rev-4" };
const context = {
  schema_version: "portal-kit.principal-scope.v1",
  principal: { subject_id: "person-7", status: "active", trust: "server_verified" },
  scope: { workspace_id: "workspace-blue" },
};

const fixtures = {
  principal_scope: context,
  authorization_request: {
    schema_version: "portal-kit.authorization-request.v1",
    request_id: "request-1",
    context,
    action: "record.inspect",
    target,
    requested_at: timestamp,
  },
  authorization_decision: {
    schema_version: "portal-kit.authorization-decision.v1",
    request_id: "request-1",
    action: "record.inspect",
    workspace_id: "workspace-blue",
    target,
    outcome: "allow",
    reason_code: "POLICY_ALLOWED",
    decided_at: timestamp,
  },
  approval_requirement: {
    schema_version: "portal-kit.approval-requirement.v1",
    requirement_id: "requirement-1",
    workspace_id: "workspace-blue",
    action: "record.change",
    target,
    author_subject_id: "person-7",
    independent_reviewer_required: true,
  },
  approval_grant: {
    schema_version: "portal-kit.approval-grant.v1",
    grant_id: "grant-1",
    requirement_id: "requirement-1",
    workspace_id: "workspace-blue",
    action: "record.change",
    target,
    reviewer_subject_id: "person-9",
    status: "active",
    issued_at: timestamp,
    expires_at: "2026-10-24T06:30:00Z",
  },
  approval_consumption: {
    schema_version: "portal-kit.approval-consumption.v1",
    consumption_id: "consume-1",
    grant_id: "grant-1",
    request_id: "request-2",
    workspace_id: "workspace-blue",
    action: "record.change",
    target,
    consumed_at: timestamp,
  },
  audit_event: {
    schema_version: "portal-kit.audit-event.v1",
    event_id: "event-1",
    request_id: "request-1",
    actor_subject_id: "person-7",
    workspace_id: "workspace-blue",
    action: "record.inspect",
    target,
    outcome: "allow",
    reason_code: "POLICY_ALLOWED",
    occurred_at: timestamp,
  },
};

test("all v1 domain-neutral fixtures validate and return frozen copies", () => {
  for (const [name, fixture] of Object.entries(fixtures)) {
    const result = validateContract(name, fixture, { knownActions });
    assert.equal(result.ok, true, `${name}: ${JSON.stringify(result.errors)}`);
    assert.notEqual(result.value, fixture);
    assert.equal(Object.isFrozen(result.value), true);
    assert.equal(Object.isFrozen(result.value.target ?? result.value.scope), true);
  }
});

test("missing fields, extra fields, and unknown versions fail closed", () => {
  for (const mutation of [
    (value) => delete value.request_id,
    (value) => (value.unreviewed = true),
    (value) => (value.schema_version = "portal-kit.authorization-request.v2"),
  ]) {
    const value = structuredClone(fixtures.authorization_request);
    mutation(value);
    assert.equal(validateContract("authorization_request", value, { knownActions }).ok, false);
  }
});

test("unknown contract and unknown action fail closed", () => {
  assert.deepEqual(validateContract("missing_contract", {}), {
    ok: false,
    errors: [{ code: "UNKNOWN_CONTRACT", message: "Unknown contract: missing_contract" }],
  });
  assert.equal(validateContract("authorization_request", fixtures.authorization_request).ok, false);
  const result = validateContract("authorization_request", fixtures.authorization_request, {
    knownActions: ["record.change"],
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].code, "UNKNOWN_ACTION");
});

test("malformed scope and untrusted principal assertions fail closed", () => {
  const malformedScope = structuredClone(fixtures.authorization_request);
  malformedScope.context.scope.workspace_id = "";
  assert.equal(validateContract("authorization_request", malformedScope, { knownActions }).ok, false);

  const untrusted = structuredClone(fixtures.authorization_request);
  untrusted.context.principal.trust = "client_asserted";
  assert.equal(validateContract("authorization_request", untrusted, { knownActions }).ok, false);
});

test("revision-bound approval envelopes require an exact revision", () => {
  for (const name of ["approval_requirement", "approval_grant", "approval_consumption"]) {
    const value = structuredClone(fixtures[name]);
    delete value.target.revision;
    assert.equal(validateContract(name, value, { knownActions }).ok, false, name);
  }
});

test("audit and approval envelopes reject secret-like fields and credential material", () => {
  for (const name of ["audit_event", "approval_grant"]) {
    const withToken = { ...structuredClone(fixtures[name]), access_token: "not-allowed" };
    assert.equal(validateContract(name, withToken, { knownActions }).ok, false, name);

    const withCredential = structuredClone(fixtures[name]);
    if (name === "audit_event") {
      withCredential.actor_subject_id = "ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ123456";
    } else {
      withCredential.reviewer_subject_id = "ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ123456";
    }
    const result = validateContract(name, withCredential, { knownActions });
    assert.equal(result.ok, false, name);
    assert.equal(result.errors[0].code, "SENSITIVE_CONTENT", name);
  }
});

test("schemas expose immutable IDs and exact version discriminators", () => {
  for (const [name, version] of Object.entries(CONTRACT_VERSIONS)) {
    const schema = getContractSchema(name);
    assert.equal(schema.$id.startsWith("urn:portal-kit:contracts:"), true);
    assert.equal(schema.properties.schema_version.const, version);
    assert.equal(Object.isFrozen(schema), true);
  }
  assert.equal(getContractSchema("missing_contract"), null);
});
