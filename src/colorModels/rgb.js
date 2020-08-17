import toHsv from "../utils/rgbToHsv";
import fromHsv from "../utils/hsvToRgb";
import equal from "../utils/equalColorObjects";

export default {
  defaultColor: { r: 0, g: 0, b: 0 },
  toHsv,
  fromHsv,
  equal,
};
