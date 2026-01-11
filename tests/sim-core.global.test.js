const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync(require.resolve("../sim-core.js"), "utf8");

test("sim-core attaches to global in browser-like context", () => {
  const context = { self: {}, Math };
  vm.runInNewContext(source, context, { filename: "sim-core.js" });
  assert.ok(context.self.SimCore);
  assert.equal(typeof context.self.SimCore.computeHeliocentricPosition, "function");
});
