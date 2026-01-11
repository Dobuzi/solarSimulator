const test = require("node:test");
const assert = require("node:assert/strict");
const I18n = require("../i18n");

test("detectLanguage selects ko for ko locale", () => {
  assert.equal(I18n.detectLanguage("ko-KR"), "ko");
  assert.equal(I18n.detectLanguage("en-US"), "en");
});

test("t returns translated strings", () => {
  assert.equal(I18n.t("title", "ko"), "태양계 3D");
  assert.equal(I18n.t("title", "en"), "Solar System 3D");
});

test("tPlanet returns translated planet names", () => {
  assert.equal(I18n.tPlanet("Saturn", "ko"), "토성");
  assert.equal(I18n.tPlanet("Saturn", "en"), "Saturn");
});
