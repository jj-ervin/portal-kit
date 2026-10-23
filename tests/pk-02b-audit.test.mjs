// SPDX-License-Identifier: AGPL-3.0-only

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "docs", "extraction", "pk-02-source-inventory.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const auditPath = join(root, "docs", "audits", "PK-02B-REPOSITORY-ARCHITECTURE-AUDIT.md");

const sourceRoots = new Map([
  [
    "governance-commons-portal",
    process.env.PORTAL_KIT_GC_PORTAL ||
      "C:\\Users\\Jess\\OneDrive\\Documents\\ChatGPT\\governance-commons-portal 2",
  ],
  ["cockpit", process.env.PORTAL_KIT_COCKPIT || "C:\\dev\\cockpit"],
]);

function git(cwd, args, encoding = "utf8") {
  return execFileSync("git", ["-C", cwd, ...args], {
    encoding,
    windowsHide: true,
  });
}

function blobBytes(cwd, revision, path) {
  const blob = git(cwd, ["rev-parse", `${revision}:${path}`]).trim();
  return {
    blob,
    bytes: git(cwd, ["cat-file", "blob", blob], null),
  };
}

function lineCount(bytes) {
  if (bytes.length === 0) return 0;
  const text = bytes.toString("utf8");
  const lines = text.split(/\r?\n/);
  return lines.at(-1) === "" ? lines.length - 1 : lines.length;
}

test("PK-01 accepted contracts remain present and internally complete", () => {
  const required = [
    "docs/PRODUCT-CONTRACT.md",
    "docs/ARCHITECTURE-BOUNDARIES.md",
    "docs/SECURITY-CONTRACT.md",
    "docs/INTEGRATION-CONTRACTS.md",
    "docs/ROADMAP.md",
    "docs/decisions/0001-self-hostable-platform-first.md",
    "docs/decisions/0002-gc-portal-reference-consumer.md",
    "docs/decisions/0003-provider-neutral-optional-ai.md",
    "docs/decisions/0004-authority-and-integration-boundaries.md",
    "docs/decisions/0006-agpl-community-license.md",
  ];
  for (const path of required) {
    assert.ok(existsSync(join(root, path)), `missing ${path}`);
  }

  const product = readFileSync(join(root, "docs", "PRODUCT-CONTRACT.md"), "utf8");
  assert.match(product, /\*\*Implementation status:\*\* not started/);
  assert.doesNotMatch(product, /- \[ \]/, "PK-01 acceptance checklist is incomplete");
  assert.match(readFileSync(join(root, "LICENSE"), "utf8"), /GNU AFFERO GENERAL PUBLIC LICENSE/);
});

test("PK-02B report covers the requested audit and stops before PK-03", () => {
  const audit = readFileSync(auditPath, "utf8");
  for (const heading of [
    "## 1. Verified PK-01 status",
    "## 2. Repository and dependency inventory",
    "## 3. Extract / Generalize / Keep / Defer classification",
    "## 4. Security invariants and coupling analysis",
    "## 5. Proposed logical package architecture versus the repository",
    "## 6. Prioritized PK-03 plan and acceptance tests",
  ]) {
    assert.ok(audit.includes(heading), `missing audit section: ${heading}`);
  }
  assert.match(audit, /\*\*PK-03 implementation status:\*\* not started/);
  assert.match(audit, /### Extract\s+\n\*\*None\.\*\*/);
});

test("source inventory has the selected fresh-authorship slice", () => {
  assert.equal(manifest.schema_version, "portal-kit.pk-02-source-inventory.v1");
  assert.equal(manifest.outcome, "inventory_only_no_source_moved");
  assert.deepEqual(
    manifest.repositories.map((repository) => repository.name),
    ["governance-commons-portal", "cockpit"],
  );
  assert.equal(
    manifest.selected_first_slice.implementation,
    "fresh_authorship_no_source_copy",
  );
  assert.deepEqual(manifest.selected_first_slice.contracts, [
    "principal_scope",
    "authorization_request_and_decision",
    "revision_bound_approval",
    "redacted_audit_event",
  ]);
});

for (const repository of manifest.repositories) {
  const sourceRoot = sourceRoots.get(repository.name);
  test(
    `${repository.name} immutable source evidence matches the manifest`,
    { skip: !sourceRoot || !existsSync(sourceRoot) ? `source checkout unavailable: ${sourceRoot}` : false },
    () => {
      assert.equal(git(sourceRoot, ["remote", "get-url", "origin"]).trim(), repository.remote);
      assert.doesNotThrow(() => git(sourceRoot, ["cat-file", "-e", `${repository.revision}^{commit}`]));

      for (const candidate of repository.candidates) {
        const { blob, bytes } = blobBytes(sourceRoot, repository.revision, candidate.path);
        assert.equal(blob, candidate.git_blob, `${candidate.path} Git blob mismatch`);
        assert.equal(
          createHash("sha256").update(bytes).digest("hex"),
          candidate.sha256,
          `${candidate.path} SHA-256 mismatch`,
        );
        assert.equal(lineCount(bytes), candidate.lines, `${candidate.path} line-count mismatch`);
      }

      const rootNames = git(sourceRoot, ["ls-tree", "--name-only", repository.revision])
        .split(/\r?\n/)
        .filter(Boolean);
      assert.equal(
        rootNames.some((name) => /^(license|copying|notice)(\.|$)/i.test(name)),
        false,
        `${repository.name} now exposes a root license file; review the audit conclusion`,
      );

      const packageManifests = git(sourceRoot, ["ls-tree", "-r", "--name-only", repository.revision])
        .split(/\r?\n/)
        .filter((name) => name === "package.json" || name.endsWith("/package.json"));
      for (const path of packageManifests) {
        const packageJson = JSON.parse(git(sourceRoot, ["show", `${repository.revision}:${path}`]));
        assert.equal(
          Object.hasOwn(packageJson, "license"),
          false,
          `${repository.name}:${path} now declares a license; review the audit conclusion`,
        );
      }
    },
  );
}

test("local Markdown links in Portal Kit documentation resolve", () => {
  const docs = [];
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.isFile() && entry.name.endsWith(".md")) docs.push(path);
    }
  }
  for (const name of ["README.md", "CONTRIBUTING.md"]) docs.push(join(root, name));
  walk(join(root, "docs"));

  const failures = [];
  const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;
  for (const document of docs) {
    const markdown = readFileSync(document, "utf8");
    for (const match of markdown.matchAll(linkPattern)) {
      const target = match[1].trim().replace(/^<|>$/g, "").split("#", 1)[0];
      if (!target || /^(https?:|mailto:|#)/i.test(target) || isAbsolute(target)) continue;
      const decoded = decodeURIComponent(target);
      if (!existsSync(resolve(dirname(document), decoded))) {
        failures.push(`${document.slice(root.length + 1)} -> ${target}`);
      }
    }
  }
  assert.deepEqual(failures, []);
});
