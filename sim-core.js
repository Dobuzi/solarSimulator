(function (root, factory) {
  const core = factory();
  root.SimCore = core;
  if (typeof module === "object" && module.exports) {
    module.exports = core;
  }
})(typeof self !== "undefined" ? self : this, function () {
  const ORBIT_SCALE = 9.5;
  const DEG_TO_RAD = Math.PI / 180;
  const INCLINATION_SCALE = 5;

  function normalizeRadians(angle) {
    const twoPi = Math.PI * 2;
    let result = angle % twoPi;
    if (result > Math.PI) result -= twoPi;
    if (result < -Math.PI) result += twoPi;
    return result;
  }

  function solveKepler(M, e) {
    let E = M;
    for (let i = 0; i < 8; i += 1) {
      const delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E -= delta;
      if (Math.abs(delta) < 1e-6) break;
    }
    return E;
  }

  function computeElements(planet, centuries) {
    const base = planet.elements;
    return {
      a: base.a0 + base.aDot * centuries,
      e: base.e0 + base.eDot * centuries,
      I: (base.I0 + base.IDot * centuries) * DEG_TO_RAD,
      L: (base.L0 + base.LDot * centuries) * DEG_TO_RAD,
      peri: (base.peri0 + base.periDot * centuries) * DEG_TO_RAD,
      node: (base.node0 + base.nodeDot * centuries) * DEG_TO_RAD,
      b: (base.b || 0) * DEG_TO_RAD,
      c: (base.c || 0) * DEG_TO_RAD,
      s: (base.s || 0) * DEG_TO_RAD,
      f: (base.f || 0) * DEG_TO_RAD,
    };
  }

  function computeHeliocentricPosition(planet, timeDays) {
    const centuries = timeDays / 36525;
    const elements = computeElements(planet, centuries);
    const omega = elements.peri - elements.node;
    const meanAnomaly =
      elements.L -
      elements.peri +
      elements.b * centuries * centuries +
      elements.c * Math.cos(elements.f * centuries) +
      elements.s * Math.sin(elements.f * centuries);
    const M = normalizeRadians(meanAnomaly);
    const E = solveKepler(M, elements.e);

    const xPrime = elements.a * (Math.cos(E) - elements.e);
    const yPrime = elements.a * Math.sqrt(1 - elements.e * elements.e) * Math.sin(E);

    const cosO = Math.cos(elements.node);
    const sinO = Math.sin(elements.node);
    const cosI = Math.cos(elements.I);
    const sinI = Math.sin(elements.I);
    const cosW = Math.cos(omega);
    const sinW = Math.sin(omega);

    const xEcl = (cosW * cosO - sinW * sinO * cosI) * xPrime + (-sinW * cosO - cosW * sinO * cosI) * yPrime;
    const yEcl = (cosW * sinO + sinW * cosO * cosI) * xPrime + (-sinW * sinO + cosW * cosO * cosI) * yPrime;
    const zEcl = sinW * sinI * xPrime + cosW * sinI * yPrime;

    return {
      x: xEcl * ORBIT_SCALE,
      y: zEcl * ORBIT_SCALE * INCLINATION_SCALE,
      z: yEcl * ORBIT_SCALE,
    };
  }

  function computeMinCameraDistance(radius, vFovRad, aspect, fillRatio) {
    const safeAspect = aspect || 1;
    const safeFill = Math.max(0.1, Math.min(1, fillRatio || 0.8));
    const hFov = 2 * Math.atan(Math.tan(vFovRad / 2) * safeAspect);
    return radius / ((safeFill / 2) * Math.tan(hFov / 2));
  }

  function computeOrbitOpacity(distance, nearDist, farDist, baseOpacity, maxOpacity) {
    const safeNear = Math.max(1, nearDist || 1);
    const safeFar = Math.max(safeNear + 1, farDist || safeNear + 1);
    const minOpacity = Math.max(0, Math.min(1, baseOpacity || 0));
    const maxSafe = Math.max(minOpacity, Math.min(1, maxOpacity || minOpacity));
    const t = Math.max(0, Math.min(1, (distance - safeNear) / (safeFar - safeNear)));
    return minOpacity + (maxSafe - minOpacity) * t;
  }

  function mixColor(hexA, hexB, ratio) {
    const safeRatio = Math.max(0, Math.min(1, ratio || 0));
    const a = hexA >>> 0;
    const b = hexB >>> 0;
    const ar = (a >> 16) & 0xff;
    const ag = (a >> 8) & 0xff;
    const ab = a & 0xff;
    const br = (b >> 16) & 0xff;
    const bg = (b >> 8) & 0xff;
    const bb = b & 0xff;
    const rr = Math.round(ar + (br - ar) * safeRatio);
    const rg = Math.round(ag + (bg - ag) * safeRatio);
    const rb = Math.round(ab + (bb - ab) * safeRatio);
    return (rr << 16) | (rg << 8) | rb;
  }

  function computeOrbitColor(baseColor) {
    const base = baseColor >>> 0;
    const br = (base >> 16) & 0xff;
    const bg = (base >> 8) & 0xff;
    const bb = base & 0xff;
    const boost = (channel) => Math.min(255, Math.round(channel * 1.35 + 50));
    const boosted =
      (boost(br) << 16) |
      (boost(bg) << 8) |
      boost(bb);
    return mixColor(base, boosted, 0.7);
  }

  return {
    ORBIT_SCALE,
    DEG_TO_RAD,
    INCLINATION_SCALE,
    normalizeRadians,
    solveKepler,
    computeElements,
    computeHeliocentricPosition,
    computeMinCameraDistance,
    computeOrbitOpacity,
    mixColor,
    computeOrbitColor,
  };
});
