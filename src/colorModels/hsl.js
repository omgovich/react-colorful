import hslToHsv from "../utils/hslToHsv";
import hsvToHsl from "../utils/hsvToHsl";
import equalColorObjects from "../utils/equalColorObjects";

export default {
  toHsv: hslToHsv,
  fromHsv: hsvToHsl,
  equal: equalColorObjects,
};
