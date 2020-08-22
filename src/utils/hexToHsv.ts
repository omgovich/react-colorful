import hexToRgb from "./hexToRgb";
import rgbToHsv from "./rgbToHsv";
import { HSV } from "../types";

const hexToHsv = (hex: string): HSV => rgbToHsv(hexToRgb(hex));

export default hexToHsv;
