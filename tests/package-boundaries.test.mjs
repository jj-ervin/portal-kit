// SPDX-License-Identifier: AGPL-3.0-only

import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const packagesRoot = join(root, "packages");
const allowedDependencies = new Map([["@portal-kit/contracts", new Set(["ajv"])]]);
const provenance = readFileSync(
  join(root, "docs", "implementation", "PK-03-DEPENDENCIES-AND-PROVENANCE.md"),
  "utf8",
);

test("workspace package dependency direction remains inward", () => {
  const names = new Set();
  const manifests = [];
  for (const entry of readdirSync(packagesRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const manifest = JSON.parse(readFileSync(join(packagesRoot, entry.name, "package.json"), "utf8"));
    names.add(manifest.name);
    manifests.push(manifest);
  }

  assert.deepEqual([...names], ["@portal-kit/contracts"]);
  for (const manifest of manifests) {
    const dependencies = Object.keys(manifest.dependencies ?? {});
    assert.deepEqual(dependencies, [...(allowedDependencies.get(manifest.name) ?? [])]);
    assert.equal(
      dependencies.some((dependency) => names.has(dependency)),
      false,
      `${manifest.name} must not introduce a package cycle`,
    );
  }
});

test("new implementation files carry AGPL-3.0-only identifiers", () => {
  const failures = [];
  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.isFile() && /\.(?:mjs|json)$/.test(entry.name) && entry.name !== "package.json") {
        const content = readFileSync(path, "utf8");
        if (!content.includes("SPDX-License-Identifier: AGPL-3.0-only")) failures.push(path);
      }
    }
  }
  walk(packagesRoot);
  assert.deepEqual(failures, []);
});

test("locked third-party dependency versions and licenses are recorded", () => {
  const lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));
  const dependencies = Object.entries(lock.packages)
    .filter(([path, value]) => path.startsWith("node_modules/") && !value.link)
    .map(([path, value]) => ({ name: path.slice("node_modules/".length), ...value }));

  for (const dependency of dependencies) {
    const row = `| \`${dependency.name}\` | \`${dependency.version}\` | ${dependency.license} |`;
    assert.ok(provenance.includes(row), `missing dependency record: ${row}`);
  }
});
