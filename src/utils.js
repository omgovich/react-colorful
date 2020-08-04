import tinycolor from "tinycolor2";

export const toHsv = (color) => tinycolor(color).toHsv();

export const toHexString = (color) => tinycolor(color).toHexString().toUpperCase();

export const limit = (number, min = 0, max = 1) => Math.min(Math.max(min, number), max);

export const formatClassName = (array) => array.filter(Boolean).join(" ");
