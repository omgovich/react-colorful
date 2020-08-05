import { hex2rgb, rgb2hsv, hsv2rgb, rgb2hex } from "@swiftcarrot/color-fns";

console.log(hsv2rgb({ h: 360, s: 50, v: 50 }));

export const hexToHsv = (hex) => {
  const { r, g, b } = hex2rgb(hex);
  return rgb2hsv(r, g, b);
};

export const hsvToHex = ({ h, s, v }) => {
  const { r, g, b } = hsv2rgb(h, s, v);
  return rgb2hex(r, g, b);
};

export const limit = (number, min = 0, max = 1) => Math.min(Math.max(min, number), max);

export const formatClassName = (array = []) => array.filter(Boolean).join(" ");
