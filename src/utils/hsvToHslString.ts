import hsvToHsl from "./hsvToHsl";
import { HSV } from "../types";

const hsvToHslString = (hsv: HSV): string => {
  const { h, s, l } = hsvToHsl(hsv);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export default hsvToHslString;
