import { test } from "uvu";
import { equal, is } from "uvu/assert";
import hexToHsv from "../src/utils/hexToHsv.js";
import hsvToHex from "../src/utils/hsvToHex.js";
import equalHex from "../src/utils/equalHex.js";
import equalHsv from "../src/utils/equalHsv.js";
import formatClassName from "../src/utils/formatClassName.js";

test("Converts HEX to HSV", () => {
  equal(hexToHsv("#ffffff"), { h: 0, s: 0, v: 100 });
  equal(hexToHsv("#ffff00"), { h: 60, s: 100, v: 100 });
  equal(hexToHsv("#ff0000"), { h: 0, s: 100, v: 100 });
  equal(hexToHsv("#000000"), { h: 0, s: 0, v: 0 });
  equal(hexToHsv("#c62182"), { h: 325, s: 83, v: 78 });
});

test("Converts shorthand HEX to HSV", () => {
  equal(hexToHsv("#FFF"), { h: 0, s: 0, v: 100 });
  equal(hexToHsv("#FF0"), { h: 60, s: 100, v: 100 });
  equal(hexToHsv("#F00"), { h: 0, s: 100, v: 100 });
  equal(hexToHsv("#ABC"), { h: 210, s: 17, v: 80 });
});

test("Converts HSV to HEX", () => {
  is(hsvToHex({ h: 0, s: 0, v: 100 }), "#ffffff");
  is(hsvToHex({ h: 60, s: 100, v: 100 }), "#ffff00");
  is(hsvToHex({ h: 0, s: 100, v: 100 }), "#ff0000");
  is(hsvToHex({ h: 0, s: 0, v: 0 }), "#000000");
  is(hsvToHex({ h: 284, s: 93, v: 73 }), "#8c0dba");
});

test("Compares two HEX colors", () => {
  is(equalHex("#8c0dba", "#8c0dba"), true);
  is(equalHex("#FFFFFF", "#ffffff"), true);
  is(equalHex("#ABC", "#aabbcc"), true);
  is(equalHex("#abcdef", "#fedcbd"), false);
});

test("Compares two HSV colors", () => {
  is(equalHsv({ h: 0, s: 0, v: 100 }, { h: 0, s: 0, v: 100 }), true);
  is(equalHsv({ h: 100, s: 50, v: 50 }, { h: 100, s: 50, v: 50 }), true);
  is(equalHsv({ h: 50, s: 0, v: 0 }, { h: 100, s: 0, v: 0 }), false);
  is(equalHsv({ h: 1, s: 2, v: 3 }, { h: 4, s: 5, v: 6 }), false);
});

test("Formats a class name", () => {
  is(formatClassName(), "");
  is(formatClassName(["one"]), "one");
  is(formatClassName(["one", "two", "three"]), "one two three");
  is(formatClassName([false, "two", null]), "two");
});

test.run();
