import { test } from "uvu";
import * as assert from "uvu/assert";
import { toHsv, toHexString } from "../src/utils.js";

const colors = {
  white: {
    hexString: "#ffffff",
    shortHexString: "#fff",
    hsv: { hue: 0, sat: 0, val: 100, alpha: 1 },
  },
  black: {
    hexString: "#000000",
    shortHexString: "#000",
    hsv: { hue: 0, sat: 0, val: 0, alpha: 1 },
  },
  yellow: {
    hexString: "#ffff00",
    shortHexString: "#ff0",
    hsv: { hue: 60, sat: 100, val: 100, alpha: 1 },
  },
};

test("HEX to HSV", () => {
  for (let name in colors) {
    let { hexString, hsv } = colors[name];
    assert.equal(toHsv(hexString), hsv);
  }
});

test("Shorthand HEX to HSV", () => {
  for (let name in colors) {
    let { shortHexString, hsv } = colors[name];
    if (shortHexString) assert.equal(toHsv(shortHexString), hsv);
  }
});

test("HSV to HEX", () => {
  for (let name in colors) {
    let { hexString, hsv } = colors[name];
    assert.is(toHexString(hsv), hexString);
  }
});

test.run();
