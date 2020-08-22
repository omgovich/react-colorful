import { HSV, RGB } from "../types";

const hsvToRgb = ({ h, s, v }: HSV): RGB => {
  h = (h / 360) * 6;
  s = s / 100;
  v = v / 100;

  const hh = Math.floor(h),
    b = v * (1 - s),
    c = v * (1 - (h - hh) * s),
    d = v * (1 - (1 - h + hh) * s),
    module = hh % 6;

  return {
    r: Math.round([v, c, b, b, d, v][module] * 255),
    g: Math.round([d, v, v, c, b, b][module] * 255),
    b: Math.round([b, b, d, v, v, c][module] * 255),
  };
};

export default hsvToRgb;
