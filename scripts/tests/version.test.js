import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isValidVersion,
  updatePackageJson,
  collectWorkspaceNames,
} from "../lib/version.mjs";

// --- isValidVersion ---

test("isValidVersion accepts semver versions", () => {
  assert.ok(isValidVersion("9.4.0"));
  assert.ok(isValidVersion("1.0.0-alpha.1"));
  assert.ok(isValidVersion("0.0.1-rc.2"));
});

test("isValidVersion rejects invalid versions", () => {
  assert.ok(!isValidVersion(""));
  assert.ok(!isValidVersion("abc"));
  assert.ok(!isValidVersion("1.2"));
  assert.ok(!isValidVersion("v1.0.0"));
});

// --- updatePackageJson ---

test("updatePackageJson sets version to new value", () => {
  const raw = JSON.stringify({ name: "@dicebear/core", version: "1.0.0" }, null, "  ") + "\n";
  const result = updatePackageJson(raw, "2.0.0", new Set());
  const pkg = JSON.parse(result);
  assert.strictEqual(pkg.version, "2.0.0");
});

test("updatePackageJson updates internal dependencies", () => {
  const raw = JSON.stringify({
    name: "@dicebear/collection",
    version: "1.0.0",
    dependencies: { "@dicebear/core": "1.0.0", "external-lib": "^3.0.0" },
  }, null, "  ") + "\n";
  const workspaceNames = new Set(["@dicebear/core"]);
  const result = updatePackageJson(raw, "2.0.0", workspaceNames);
  const pkg = JSON.parse(result);
  assert.strictEqual(pkg.dependencies["@dicebear/core"], "2.0.0");
});

test("updatePackageJson updates internal devDependencies", () => {
  const raw = JSON.stringify({
    name: "@dicebear/collection",
    version: "1.0.0",
    devDependencies: { "@dicebear/core": "1.0.0" },
  }, null, "  ") + "\n";
  const workspaceNames = new Set(["@dicebear/core"]);
  const result = updatePackageJson(raw, "2.0.0", workspaceNames);
  const pkg = JSON.parse(result);
  assert.strictEqual(pkg.devDependencies["@dicebear/core"], "2.0.0");
});

test("updatePackageJson leaves wildcard dependencies unchanged", () => {
  const raw = JSON.stringify({
    name: "@dicebear/editor",
    version: "1.0.0",
    dependencies: { "@dicebear/core": "*" },
  }, null, "  ") + "\n";
  const workspaceNames = new Set(["@dicebear/core"]);
  const result = updatePackageJson(raw, "2.0.0", workspaceNames);
  const pkg = JSON.parse(result);
  assert.strictEqual(pkg.dependencies["@dicebear/core"], "*");
});

test("updatePackageJson leaves peerDependencies ranges untouched", () => {
  const raw = JSON.stringify({
    name: "@dicebear/avataaars",
    version: "1.0.0",
    peerDependencies: { "@dicebear/core": ">=1.0.0" },
  }, null, "  ") + "\n";
  const workspaceNames = new Set(["@dicebear/core"]);
  const result = updatePackageJson(raw, "2.0.0", workspaceNames);
  const pkg = JSON.parse(result);
  assert.strictEqual(pkg.peerDependencies["@dicebear/core"], ">=1.0.0");
});

test("updatePackageJson skips root package.json without version field", () => {
  const raw = JSON.stringify({ name: "root", private: true }, null, "  ") + "\n";
  const result = updatePackageJson(raw, "2.0.0", new Set());
  assert.strictEqual(result, null);
});

test("updatePackageJson leaves external dependencies unchanged", () => {
  const raw = JSON.stringify({
    name: "@dicebear/core",
    version: "1.0.0",
    dependencies: { "external-lib": "^3.0.0" },
  }, null, "  ") + "\n";
  const workspaceNames = new Set(["@dicebear/core"]);
  const result = updatePackageJson(raw, "2.0.0", workspaceNames);
  const pkg = JSON.parse(result);
  assert.strictEqual(pkg.dependencies["external-lib"], "^3.0.0");
});

test("updatePackageJson returns null when no change needed", () => {
  const raw = JSON.stringify({
    name: "@dicebear/core",
    version: "2.0.0",
    dependencies: { "external-lib": "^3.0.0" },
  }, null, "  ") + "\n";
  const result = updatePackageJson(raw, "2.0.0", new Set());
  assert.strictEqual(result, null);
});

// --- collectWorkspaceNames ---

test("collectWorkspaceNames collects all name fields", () => {
  const raws = [
    JSON.stringify({ name: "@dicebear/core", version: "1.0.0" }),
    JSON.stringify({ name: "@dicebear/avataaars", version: "1.0.0" }),
    JSON.stringify({ version: "1.0.0" }), // no name — should be ignored
  ];
  const names = collectWorkspaceNames(raws);
  assert.strictEqual(names.size, 2);
  assert.ok(names.has("@dicebear/core"));
  assert.ok(names.has("@dicebear/avataaars"));
});
