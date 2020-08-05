import { rgbToHsv, hexToRgb, rgbToHex, hsvToRgb, formatHex } from "color-fns";

export const hexToHsv = (hex) => rgbToHsv(hexToRgb(hex));

export const hsvToHex = (hsv) => formatHex(rgbToHex(hsvToRgb(hsv)));

export const limit = (number, min = 0, max = 1) => Math.min(Math.max(min, number), max);

export const formatClassName = (array = []) => array.filter(Boolean).join(" ");
