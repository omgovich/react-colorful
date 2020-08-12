import rgbToHsv from "../utils/rgbToHsv";
import hsvToRgb from "../utils/hsvToRgb";
import equalColorObjects from "../utils/equalColorObjects";

export default {
  toHsv: rgbToHsv,
  fromHsv: hsvToRgb,
  equal: equalColorObjects,
};
