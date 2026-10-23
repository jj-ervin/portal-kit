// SPDX-License-Identifier: AGPL-3.0-only

import Ajv2020 from "ajv/dist/2020.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const contractFiles = Object.freeze({
  principal_scope: "principal-scope.v1.schema.json",
  authorization_request: "authorization-request.v1.schema.json",
  authorization_decision: "authorization-decision.v1.schema.json",
  approval_requirement: "approval-requirement.v1.schema.json",
  approval_grant: "approval-grant.v1.schema.json",
  approval_consumption: "approval-consumption.v1.schema.json",
  audit_event: "audit-event.v1.schema.json",
});

const actionContracts = new Set([
  "authorization_request",
  "authorization_decision",
  "approval_requirement",
  "approval_grant",
  "approval_consumption",
  "audit_event",
]);

const forbiddenField = /(?:^|_)(?:authorization|cookie|credential|password|private_key|secret|token)(?:_|$)/i;
const credentialValue = /^(?:Basic|Bearer)\s+\S+|-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----|^(?:gh[oprsu]_|sk-)[A-Za-z0-9_-]+/;

function loadSchema(fileName) {
  return JSON.parse(readFileSync(join(packageRoot, "schemas", fileName), "utf8"));
}

const sharedSchema = loadSchema("shared.v1.schema.json");
const schemas = new Map(
  Object.entries(contractFiles).map(([contractName, fileName]) => [contractName, loadSchema(fileName)]),
);

const ajv = new Ajv2020({ allErrors: true, strict: true });
ajv.addSchema(sharedSchema);
for (const schema of schemas.values()) ajv.addSchema(schema);

const validators = new Map(
  [...schemas].map(([contractName, schema]) => [contractName, ajv.getSchema(schema.$id)]),
);

function freezeDeep(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) freezeDeep(child);
  }
  return value;
}

function findSensitiveContent(value, path = "$") {
  if (typeof value === "string" && credentialValue.test(value)) {
    return `${path} contains credential-like material`;
  }
  if (!value || typeof value !== "object") return null;

  for (const [key, child] of Object.entries(value)) {
    if (forbiddenField.test(key)) return `${path}.${key} is a forbidden secret-bearing field`;
    const nested = findSensitiveContent(child, `${path}.${key}`);
    if (nested) return nested;
  }
  return null;
}

function failure(code, message, details = []) {
  return freezeDeep({
    ok: false,
    errors: [{ code, message }, ...details],
  });
}

/**
 * Validate a versioned Portal Kit envelope and return a frozen copy on success.
 * Action-bearing contracts require an injected allowlist; an absent or empty
 * allowlist therefore fails closed.
 *
 * @param {string} contractName
 * @param {unknown} value
 * @param {{ knownActions?: Iterable<string> }} [options]
 */
export function validateContract(contractName, value, options = {}) {
  const validator = validators.get(contractName);
  if (!validator) return failure("UNKNOWN_CONTRACT", `Unknown contract: ${contractName}`);

  if (!validator(value)) {
    const details = (validator.errors ?? []).map((error) => ({
      code: "SCHEMA_INVALID",
      message: `${error.instancePath || "$"} ${error.message}`,
    }));
    return failure("SCHEMA_INVALID", `${contractName} failed schema validation`, details);
  }

  const sensitiveContent = findSensitiveContent(value);
  if (sensitiveContent) return failure("SENSITIVE_CONTENT", sensitiveContent);

  if (actionContracts.has(contractName)) {
    let knownActions;
    try {
      knownActions = new Set(options.knownActions ?? []);
    } catch {
      return failure("INVALID_ACTION_REGISTRY", "knownActions must be iterable");
    }
    if (!knownActions.has(value.action)) {
      return failure("UNKNOWN_ACTION", `Action is not registered: ${value.action}`);
    }
  }

  return freezeDeep({ ok: true, value: structuredClone(value) });
}

export const CONTRACT_VERSIONS = freezeDeep(
  Object.fromEntries([...schemas].map(([name, schema]) => [name, schema.properties.schema_version.const])),
);

export function getContractSchema(contractName) {
  const schema = schemas.get(contractName);
  return schema ? freezeDeep(structuredClone(schema)) : null;
}
