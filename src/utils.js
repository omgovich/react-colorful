import tinycolor from "tinycolor2";

export const isValid = (color) => tinycolor(color).isValid();

export const areSame = (color1, color2) => toHex(color1) === toHex(color2);

export const toHsl = (color) => tinycolor(color).toHsl();

export const toHsv = (color) => tinycolor(color).toHsv();

export const toHex = (color) => tinycolor(color).toHex().toUpperCase();

export const toHexString = (color) => tinycolor(color).toHexString().toUpperCase();

export const limit = (number, min = 0, max = 1) => Math.min(Math.max(min, number), max);
