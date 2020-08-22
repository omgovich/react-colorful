import { RGB } from "../types";

const format = (number: number) => {
  const hex = number.toString(16);
  return hex.length < 2 ? "0" + hex : hex;
};

const rgbToHex = ({ r, g, b }: RGB): string => "#" + format(r) + format(g) + format(b);

export default rgbToHex;
