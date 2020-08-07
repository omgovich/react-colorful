import { hex2rgb, rgb2hsv, hsv2hex } from "@swiftcarrot/color-fns";

export const hexToHsv = (hex) => {
  const { r, g, b } = hex2rgb(hex);
  return rgb2hsv(r, g, b);
};

export const hsvToHex = ({ h, s, v }) => hsv2hex(h, s, v);

export const limit = (number, min = 0, max = 1) => Math.min(Math.max(min, number), max);

export const formatClassName = (array = []) => array.filter(Boolean).join(" ");
