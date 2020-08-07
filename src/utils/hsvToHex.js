import rgbToHex from "./rgbToHex";
import hsvToRgb from "./hsvToRgb";

const hsvToHex = (hex) => rgbToHex(hsvToRgb(hex));

export default hsvToHex;
