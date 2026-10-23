// SPDX-License-Identifier: AGPL-3.0-only

import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const adrPath = join(
  root,
  "docs",
  "decisions",
  "0008-pk-03-runtime-package-and-boundary-architecture.md",
);
const adr = readFileSync(adrPath, "utf8");

test("PK-03 architecture ADR records accepted review state", () => {
  assert.match(adr, /\*\*Status:\*\* accepted/);
  assert.match(adr, /PR #2 merged this ADR/i);
  assert.match(adr, /before PK-03 implementation/i);
});

test("runtime, package, schema, and test choices are explicit", () => {
  for (const decision of [
    "Node.js 24 or later",
    "ECMAScript modules",
    "npm workspaces",
    "JSON Schema Draft 2020-12",
    "Ajv 8",
    "node:test",
  ]) {
    assert.ok(adr.includes(decision), `missing architecture decision: ${decision}`);
  }
});

test("initial package boundaries and dependency direction are explicit", () => {
  for (const packageName of ["contracts/", "kernel/", "ports/", "testing/"]) {
    assert.ok(adr.includes(packageName), `missing initial package: ${packageName}`);
  }
  for (const edge of [
    "kernel  ---> contracts",
    "ports   ---> contracts",
    "runtime ---> kernel + ports + contracts",
    "adapters ---> ports + contracts",
  ]) {
    assert.ok(adr.includes(edge), `missing dependency edge: ${edge}`);
  }
});

test("security and audit boundaries fail closed", () => {
  for (const invariant of [
    "Unknown actions",
    "cross-workspace scope",
    "revoked or expired grants",
    "self-approval",
    "stale revisions",
    "replay deny by default",
    "Audit delivery failure blocks the protected mutation",
  ]) {
    assert.ok(adr.includes(invariant), `missing invariant: ${invariant}`);
  }
  assert.match(adr, /returns a decision and a mandatory redacted audit event together/);
});

test("deferred infrastructure and external ownership remain explicit", () => {
  for (const boundary of [
    "selects no production persistence engine",
    "Cockpit remains an optional presentation dependency",
    "GC Portal remains a future consumer adapter",
    "no UI, network, cloud account, provider, or AI dependency",
  ]) {
    assert.ok(adr.includes(boundary), `missing deferred boundary: ${boundary}`);
  }
});

test("implementation remains inside the accepted contracts-only boundary", () => {
  assert.deepEqual(readdirSync(join(root, "packages")), ["contracts"]);
  assert.equal(existsSync(join(root, "packages", "kernel")), false);
  assert.equal(existsSync(join(root, "packages", "ports")), false);
  assert.equal(existsSync(join(root, "packages", "testing")), false);
  assert.equal(existsSync(join(root, "src")), false);
});
