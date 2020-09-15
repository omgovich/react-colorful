// HEX
import { hexToHsva, hsvaToHex } from "../src/utils/convert";
import { equalHex } from "../src/utils/compare";
import { validHex } from "../src/utils/validate";
// HSLA
import { hsvaToHsla, hslaToHsva } from "../src/utils/convert";
// HSLA string
import { hslaStringToHsva } from "../src/utils/convert";
// HSL
import { hslaToHsl } from "../src/utils/convert";
// HSL string
import { hsvaToHslString, hslStringToHsva } from "../src/utils/convert";
// RGBA
import { hsvaToRgba, rgbaToHsva } from "../src/utils/convert";
// RGBA string
import { rgbaStringToHsva } from "../src/utils/convert";
// RGB
import { rgbaToRgb } from "../src/utils/convert";
// RGB string
import { hsvaToRgbString, rgbStringToHsva } from "../src/utils/convert";
// HSV
import { hsvaToHsv } from "../src/utils/convert";
// Rest
import { equalColorObjects, equalColorString } from "../src/utils/compare";
import { formatClassName } from "../src/utils/format";

it("Converts HEX to HSVA", () => {
  expect(hexToHsva("#ffffff")).toMatchObject({ h: 0, s: 0, v: 100, a: 1 });
  expect(hexToHsva("#ffff00")).toMatchObject({ h: 60, s: 100, v: 100, a: 1 });
  expect(hexToHsva("#ff0000")).toMatchObject({ h: 0, s: 100, v: 100, a: 1 });
  expect(hexToHsva("#000000")).toMatchObject({ h: 0, s: 0, v: 0, a: 1 });
  expect(hexToHsva("#c62182")).toMatchObject({ h: 325, s: 83, v: 78, a: 1 });
});

it("Converts shorthand HEX to HSVA", () => {
  expect(hexToHsva("#FFF")).toMatchObject({ h: 0, s: 0, v: 100, a: 1 });
  expect(hexToHsva("#FF0")).toMatchObject({ h: 60, s: 100, v: 100, a: 1 });
  expect(hexToHsva("#F00")).toMatchObject({ h: 0, s: 100, v: 100, a: 1 });
  expect(hexToHsva("#ABC")).toMatchObject({ h: 210, s: 17, v: 80, a: 1 });
});

it("Converts HSVA to HEX", () => {
  expect(hsvaToHex({ h: 0, s: 0, v: 100, a: 1 })).toBe("#ffffff");
  expect(hsvaToHex({ h: 60, s: 100, v: 100, a: 1 })).toBe("#ffff00");
  expect(hsvaToHex({ h: 0, s: 100, v: 100, a: 1 })).toBe("#ff0000");
  expect(hsvaToHex({ h: 0, s: 0, v: 0, a: 1 })).toBe("#000000");
  expect(hsvaToHex({ h: 284, s: 93, v: 73, a: 1 })).toBe("#8c0dba");
});

it("Converts HSVA to HSLA", () => {
  let test = (input, output) => expect(hsvaToHsla(input)).toMatchObject(output);

  test({ h: 0, s: 0, v: 100 }, { h: 0, s: 0, l: 100 });
  test({ h: 60, s: 100, v: 100 }, { h: 60, s: 100, l: 50 });
  test({ h: 0, s: 100, v: 100 }, { h: 0, s: 100, l: 50 });
  test({ h: 0, s: 0, v: 0 }, { h: 0, s: 0, l: 0 });
  test({ h: 200, s: 40, v: 40 }, { h: 200, s: 25, l: 32 });
});

it("Converts HSLA to HSVA", () => {
  let test = (input, output) => expect(hslaToHsva(input)).toMatchObject(output);

  test({ h: 0, s: 0, l: 100, a: 1 }, { h: 0, s: 0, v: 100, a: 1 });
  test({ h: 60, s: 100, l: 50, a: 1 }, { h: 60, s: 100, v: 100, a: 1 });
  test({ h: 0, s: 100, l: 50, a: 1 }, { h: 0, s: 100, v: 100, a: 1 });
  test({ h: 0, s: 0, l: 0, a: 1 }, { h: 0, s: 0, v: 0, a: 1 });
  test({ h: 200, s: 25, l: 32, a: 1 }, { h: 200, s: 40, v: 40, a: 1 });
});

it("Converts HSVA to HSL string", () => {
  expect(hsvaToHslString({ h: 200, s: 40, v: 40, a: 1 })).toBe("hsl(200, 25%, 32%)");
  expect(hsvaToHslString({ h: 0, s: 0, v: 0, a: 1 })).toBe("hsl(0, 0%, 0%)");
});

it("Converts HSL string to HSVA", () => {
  expect(hslStringToHsva("hsl(0, 0%, 100%)")).toMatchObject({ h: 0, s: 0, v: 100, a: 1 });
  expect(hslStringToHsva("hsl(0,0,100)")).toMatchObject({ h: 0, s: 0, v: 100, a: 1 });
  expect(hslStringToHsva("hsl(60, 100%, 50%)")).toMatchObject({ h: 60, s: 100, v: 100, a: 1 });
  expect(hslStringToHsva("hsl(0, 100%, 50%)")).toMatchObject({ h: 0, s: 100, v: 100, a: 1 });
});

it("Converts HSLA string to HSVA", () => {
  expect(hslaStringToHsva("hsla(0, 0%, 0%, 0.5)")).toMatchObject({ h: 0, s: 0, v: 0, a: 0.5 });
  expect(hslaStringToHsva("hsla(200, 25%, 32%, 1)")).toMatchObject({ h: 200, s: 40, v: 40, a: 1 });
});

it("Converts HSVA to RGBA", () => {
  let test = (input, output) => expect(hsvaToRgba(input)).toMatchObject(output);

  test({ h: 0, s: 0, v: 100, a: 1 }, { r: 255, g: 255, b: 255, a: 1 });
  test({ h: 0, s: 100, v: 100, a: 0.5 }, { r: 255, g: 0, b: 0, a: 0.5 });
});

it("Converts RGBA to HSVA", () => {
  expect(rgbaToHsva({ r: 255, g: 255, b: 255, a: 1 })).toMatchObject({ h: 0, s: 0, v: 100, a: 1 });
  expect(rgbaToHsva({ r: 255, g: 0, b: 0, a: 1 })).toMatchObject({ h: 0, s: 100, v: 100, a: 1 });
});

it("Converts RGB string to HSVA", () => {
  expect(rgbStringToHsva("rgb(255, 255, 255)")).toMatchObject({ h: 0, s: 0, v: 100, a: 1 });
  expect(rgbStringToHsva("rgb(0,0,0)")).toMatchObject({ h: 0, s: 0, v: 0, a: 1 });
});

it("Converts RGBA string to HSVA", () => {
  expect(rgbaStringToHsva("rgb(61, 88, 102, 0.5)")).toMatchObject({ h: 200, s: 40, v: 40, a: 0.5 });
});

it("Converts HSVA to RGB string", () => {
  expect(hsvaToRgbString({ h: 0, s: 0, v: 100, a: 1 })).toBe("rgb(255, 255, 255)");
  expect(hsvaToRgbString({ h: 200, s: 40, v: 40, a: 1 })).toBe("rgb(61, 88, 102)");
});

it("Trims alpha-channel", () => {
  expect(rgbaToRgb({ r: 0, g: 0, b: 0, a: 1 })).toMatchObject({ r: 0, g: 0, b: 0 });
  expect(hslaToHsl({ h: 0, s: 0, l: 0, a: 1 })).toMatchObject({ h: 0, s: 0, l: 0 });
  expect(hsvaToHsv({ h: 0, s: 0, v: 0, a: 1 })).toMatchObject({ h: 0, s: 0, v: 0 });
});

it("Compares two HEX colors", () => {
  expect(equalHex("#8c0dba", "#8c0dba")).toBe(true);
  expect(equalHex("#FFFFFF", "#ffffff")).toBe(true);
  expect(equalHex("#ABC", "#aabbcc")).toBe(true);
  expect(equalHex("#abcdef", "#fedcbd")).toBe(false);
});

it("Compares two object colors", () => {
  expect(equalColorObjects({ h: 0, s: 0, v: 5, a: 0.5 }, { h: 0, s: 0, v: 5, a: 0.5 })).toBe(true);
  expect(equalColorObjects({ h: 100, s: 50, v: 50 }, { h: 100, s: 50, v: 50 })).toBe(true);
  expect(equalColorObjects({ h: 50, s: 0, v: 0 }, { h: 100, s: 0, v: 0 })).toBe(false);
  expect(equalColorObjects({ h: 1, s: 2, v: 3 }, { h: 4, s: 5, v: 6, a: 0 })).toBe(false);
});

it("Compares two string colors", () => {
  expect(equalColorString("rgb(0,0,0)", "rgb(0, 0, 0)")).toBe(true);
  expect(equalColorString(" hsl(60, 100%, 50%) ", "hsl(60,100%,50%)")).toBe(true);
  expect(equalColorString("rgb(0, 0, 0)", "rgb(1, 1, 1)")).toBe(false);
});

it("Validates HEX colors", () => {
  // valid strings
  expect(validHex("#8c0dba")).toBe(true);
  expect(validHex("aabbcc")).toBe(true);
  expect(validHex("#ABC")).toBe(true);
  expect(validHex("123")).toBe(true);
  // out of [0-F] range
  expect(validHex("#eeffhh")).toBe(false);
  // wrong length
  expect(validHex("#12")).toBe(false);
  expect(validHex("#12345")).toBe(false);
  // empty
  expect(validHex("")).toBe(false);
  expect(validHex(null)).toBe(false);
  expect(validHex()).toBe(false);
});

it("Formats a class name", () => {
  expect(formatClassName(["one"])).toBe("one");
  expect(formatClassName(["one", "two", "three"])).toBe("one two three");
  expect(formatClassName([false, "two", null])).toBe("two");
});
