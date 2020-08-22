import { HSL, HSV } from "../types";

const hslToHsv = ({ h, s, l }: HSL): HSV => {
  s *= (l < 50 ? l : 100 - l) / 100;

  return {
    h: h,
    s: s > 0 ? ((2 * s) / (l + s)) * 100 : 0,
    v: l + s,
  };
};

export default hslToHsv;
