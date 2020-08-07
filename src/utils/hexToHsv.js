import hexToRgb from "./hexToRgb";
import rgbToHsv from "./rgbToHsv";

const hexToHsv = (hex) => rgbToHsv(hexToRgb(hex));

export default hexToHsv;
