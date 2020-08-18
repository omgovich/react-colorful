// HEX
import hexToHsv from "../src/utils/hexToHsv";
import hsvToHex from "../src/utils/hsvToHex";
import equalHex from "../src/utils/equalHex";
// HSL
import hsvToHsl from "../src/utils/hsvToHsl";
import hslToHsv from "../src/utils/hslToHsv";
// HSL string
import hsvToHslString from "../src/utils/hsvToHslString";
import hslStringToHsv from "../src/utils/hslStringToHsv";
// RGB
import hsvToRgb from "../src/utils/hsvToRgb";
import rgbToHsv from "../src/utils/rgbToHsv";
// RGB string
import hsvToRgbString from "../src/utils/hsvToRgbString";
import rgbStringToHsv from "../src/utils/rgbStringToHsv";
// Rest
import equalColorObjects from "../src/utils/equalColorObjects";
import formatClassName from "../src/utils/formatClassName";

it("Converts HEX to HSV", () => {
  expect(hexToHsv("#ffffff")).toMatchObject({ h: 0, s: 0, v: 100 });
  expect(hexToHsv("#ffff00")).toMatchObject({ h: 60, s: 100, v: 100 });
  expect(hexToHsv("#ff0000")).toMatchObject({ h: 0, s: 100, v: 100 });
  expect(hexToHsv("#000000")).toMatchObject({ h: 0, s: 0, v: 0 });
  expect(hexToHsv("#c62182")).toMatchObject({ h: 325, s: 83, v: 78 });
});

it("Converts shorthand HEX to HSV", () => {
  expect(hexToHsv("#FFF")).toMatchObject({ h: 0, s: 0, v: 100 });
  expect(hexToHsv("#FF0")).toMatchObject({ h: 60, s: 100, v: 100 });
  expect(hexToHsv("#F00")).toMatchObject({ h: 0, s: 100, v: 100 });
  expect(hexToHsv("#ABC")).toMatchObject({ h: 210, s: 17, v: 80 });
});

it("Converts HSV to HEX", () => {
  expect(hsvToHex({ h: 0, s: 0, v: 100 })).toBe("#ffffff");
  expect(hsvToHex({ h: 60, s: 100, v: 100 })).toBe("#ffff00");
  expect(hsvToHex({ h: 0, s: 100, v: 100 })).toBe("#ff0000");
  expect(hsvToHex({ h: 0, s: 0, v: 0 })).toBe("#000000");
  expect(hsvToHex({ h: 284, s: 93, v: 73 })).toBe("#8c0dba");
});

it("Converts HSV to HSL", () => {
  expect(hsvToHsl({ h: 0, s: 0, v: 100 })).toMatchObject({ h: 0, s: 0, l: 100 });
  expect(hsvToHsl({ h: 60, s: 100, v: 100 })).toMatchObject({ h: 60, s: 100, l: 50 });
  expect(hsvToHsl({ h: 0, s: 100, v: 100 })).toMatchObject({ h: 0, s: 100, l: 50 });
  expect(hsvToHsl({ h: 0, s: 0, v: 0 })).toMatchObject({ h: 0, s: 0, l: 0 });
  expect(hsvToHsl({ h: 200, s: 40, v: 40 })).toMatchObject({ h: 200, s: 25, l: 32 });
});

it("Converts HSL to HSV", () => {
  expect(hslToHsv({ h: 0, s: 0, l: 100 })).toMatchObject({ h: 0, s: 0, v: 100 });
  expect(hslToHsv({ h: 60, s: 100, l: 50 })).toMatchObject({ h: 60, s: 100, v: 100 });
  expect(hslToHsv({ h: 0, s: 100, l: 50 })).toMatchObject({ h: 0, s: 100, v: 100 });
  expect(hslToHsv({ h: 0, s: 0, l: 0 })).toMatchObject({ h: 0, s: 0, v: 0 });
  expect(hslToHsv({ h: 200, s: 25, l: 32 })).toMatchObject({ h: 200, s: 40, v: 40 });
});

it("Converts HSV to HSL string", () => {
  expect(hsvToHslString({ h: 0, s: 0, v: 0 })).toBe("hsl(0, 0%, 0%)");
});

it("Converts HSL string to HSV", () => {
  expect(hslStringToHsv("hsl(0, 0%, 100%)")).toMatchObject({ h: 0, s: 0, v: 100 });
  expect(hslStringToHsv("hsl(0,0,100)")).toMatchObject({ h: 0, s: 0, v: 100 });
  expect(hslStringToHsv("hsl(60, 100%, 50%)")).toMatchObject({ h: 60, s: 100, v: 100 });
  expect(hslStringToHsv("hsl(0, 100%, 50%)")).toMatchObject({ h: 0, s: 100, v: 100 });
  expect(hslStringToHsv("hsl(0, 0%, 0%)")).toMatchObject({ h: 0, s: 0, v: 0 });
  expect(hslStringToHsv("hsl(200, 25%, 32%)")).toMatchObject({ h: 200, s: 40, v: 40 });
});

it("Converts HSV to RGB", () => {
  expect(hsvToRgb({ h: 0, s: 0, v: 100 })).toMatchObject({ r: 255, g: 255, b: 255 });
  expect(hsvToRgb({ h: 0, s: 100, v: 100 })).toMatchObject({ r: 255, g: 0, b: 0 });
});

it("Converts RGB to HSV", () => {
  expect(rgbToHsv({ r: 255, g: 255, b: 255 })).toMatchObject({ h: 0, s: 0, v: 100 });
  expect(rgbToHsv({ r: 255, g: 0, b: 0 })).toMatchObject({ h: 0, s: 100, v: 100 });
});

it("Converts RGB string to HSV", () => {
  expect(rgbStringToHsv("rgb(255, 255, 255)")).toMatchObject({ h: 0, s: 0, v: 100 });
  expect(rgbStringToHsv("rgb(0,0,0)")).toMatchObject({ h: 0, s: 0, v: 0 });
  expect(rgbStringToHsv("rgb(61, 88, 102)")).toMatchObject({ h: 200, s: 40, v: 40 });
});

it("Converts HSV to RGB string", () => {
  expect(hsvToRgbString({ h: 0, s: 0, v: 100 })).toBe("rgb(255, 255, 255)");
  expect(hsvToRgbString({ h: 200, s: 40, v: 40 })).toBe("rgb(61, 88, 102)");
});

it("Converts RGB string to HSV", () => {
  expect(rgbStringToHsv("rgb(255, 255, 255)")).toMatchObject({ h: 0, s: 0, v: 100 });
  expect(rgbStringToHsv("rgb(61, 88, 102)")).toMatchObject({ h: 200, s: 40, v: 40 });
});

it("Compares two HEX colors", () => {
  expect(equalHex("#8c0dba", "#8c0dba")).toBe(true);
  expect(equalHex("#FFFFFF", "#ffffff")).toBe(true);
  expect(equalHex("#ABC", "#aabbcc")).toBe(true);
  expect(equalHex("#abcdef", "#fedcbd")).toBe(false);
});

it("Compares two HSV colors", () => {
  expect(equalColorObjects({ h: 0, s: 0, v: 100 }, { h: 0, s: 0, v: 100 })).toBe(true);
  expect(equalColorObjects({ h: 100, s: 50, v: 50 }, { h: 100, s: 50, v: 50 })).toBe(true);
  expect(equalColorObjects({ h: 50, s: 0, v: 0 }, { h: 100, s: 0, v: 0 })).toBe(false);
  expect(equalColorObjects({ h: 1, s: 2, v: 3 }, { h: 4, s: 5, v: 6 })).toBe(false);
});

it("Formats a class name", () => {
  expect(formatClassName(["one"])).toBe("one");
  expect(formatClassName(["one", "two", "three"])).toBe("one two three");
  expect(formatClassName([false, "two", null])).toBe("two");
});
