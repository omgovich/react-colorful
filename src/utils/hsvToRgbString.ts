import hsvToRgb from "./hsvToRgb";
import { HSV } from "../types";

const hsvToRgbString = (hsv: HSV): string => {
  const { r, g, b } = hsvToRgb(hsv);
  return `rgb(${r}, ${g}, ${b})`;
};

export default hsvToRgbString;
