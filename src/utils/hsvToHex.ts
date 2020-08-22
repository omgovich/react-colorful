import rgbToHex from "./rgbToHex";
import hsvToRgb from "./hsvToRgb";
import { HSV } from "../types";

const hsvToHex = (hsv: HSV): string => rgbToHex(hsvToRgb(hsv));

export default hsvToHex;
