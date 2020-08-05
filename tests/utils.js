import { test } from "uvu";
import * as assert from "uvu/assert";
import { hexToHsv, hsvToHex, formatClassName } from "../src/utils.js";

test("Converts HEX to HSV", () => {
  assert.equal(hexToHsv("#ffffff"), { hue: 0, sat: 0, val: 100, alpha: 1 });
  assert.equal(hexToHsv("#ffff00"), { hue: 60, sat: 100, val: 100, alpha: 1 });
  assert.equal(hexToHsv("#ff0000"), { hue: 0, sat: 100, val: 100, alpha: 1 });
  assert.equal(hexToHsv("#000000"), { hue: 0, sat: 0, val: 0, alpha: 1 });
  assert.equal(hexToHsv("#c62182"), { hue: 324, sat: 83, val: 77, alpha: 1 });
});

test("Converts shorthand HEX to HSV", () => {
  assert.equal(hexToHsv("#FFF"), { hue: 0, sat: 0, val: 100, alpha: 1 });
  assert.equal(hexToHsv("#FF0"), { hue: 60, sat: 100, val: 100, alpha: 1 });
  assert.equal(hexToHsv("#F00"), { hue: 0, sat: 100, val: 100, alpha: 1 });
  assert.equal(hexToHsv("#ABC"), { hue: 210, sat: 16, val: 80, alpha: 1 });
});

test("Converts HSV to HEX", () => {
  assert.is(hsvToHex({ hue: 0, sat: 0, val: 100, alpha: 1 }), "#ffffff");
  assert.is(hsvToHex({ hue: 60, sat: 100, val: 100, alpha: 1 }), "#ffff00");
  assert.is(hsvToHex({ hue: 0, sat: 100, val: 100, alpha: 1 }), "#ff0000");
  assert.is(hsvToHex({ hue: 0, sat: 0, val: 0, alpha: 1 }), "#000000");
  assert.is(hsvToHex({ hue: 284, sat: 93, val: 73, alpha: 1 }), "#8b0dba");
});

test("Formats a class name", () => {
  assert.is(formatClassName(), "");
  assert.is(formatClassName(["one"]), "one");
  assert.is(formatClassName(["one", "two", "three"]), "one two three");
  assert.is(formatClassName([false, "two", null]), "two");
});

test.run();
