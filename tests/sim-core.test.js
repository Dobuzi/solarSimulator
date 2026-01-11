const test = require("node:test");
const assert = require("node:assert/strict");
const SimCore = require("../sim-core");

test("normalizeRadians wraps into [-pi, pi]", () => {
  const value = SimCore.normalizeRadians(3 * Math.PI);
  assert.ok(value <= Math.PI && value >= -Math.PI);
  assert.ok(Math.abs(value - Math.PI) < 1e-10);
});

test("solveKepler returns M when eccentricity is zero", () => {
  const M = 1.2345;
  const E = SimCore.solveKepler(M, 0);
  assert.ok(Math.abs(E - M) < 1e-10);
});

test("computeElements converts degrees to radians and applies rates", () => {
  const planet = {
    elements: {
      a0: 1,
      aDot: 0.1,
      e0: 0.1,
      eDot: 0.01,
      I0: 10,
      IDot: 1,
      L0: 20,
      LDot: 2,
      peri0: 30,
      periDot: 3,
      node0: 40,
      nodeDot: 4,
      b: 0.5,
      c: 0.6,
      s: 0.7,
      f: 0.8,
    },
  };
  const centuries = 2;
  const elements = SimCore.computeElements(planet, centuries);

  assert.ok(Math.abs(elements.a - 1.2) < 1e-10);
  assert.ok(Math.abs(elements.e - 0.12) < 1e-10);
  assert.ok(Math.abs(elements.I - (12 * SimCore.DEG_TO_RAD)) < 1e-10);
  assert.ok(Math.abs(elements.L - (24 * SimCore.DEG_TO_RAD)) < 1e-10);
  assert.ok(Math.abs(elements.peri - (36 * SimCore.DEG_TO_RAD)) < 1e-10);
  assert.ok(Math.abs(elements.node - (48 * SimCore.DEG_TO_RAD)) < 1e-10);
});

test("computeHeliocentricPosition returns scaled vector for circular orbit", () => {
  const planet = {
    elements: {
      a0: 1,
      aDot: 0,
      e0: 0,
      eDot: 0,
      I0: 0,
      IDot: 0,
      L0: 0,
      LDot: 0,
      peri0: 0,
      periDot: 0,
      node0: 0,
      nodeDot: 0,
      b: 0,
      c: 0,
      s: 0,
      f: 0,
    },
  };

  const position = SimCore.computeHeliocentricPosition(planet, 0);
  assert.ok(Math.abs(position.x - SimCore.ORBIT_SCALE) < 1e-10);
  assert.ok(Math.abs(position.y) < 1e-10);
  assert.ok(Math.abs(position.z) < 1e-10);
});
