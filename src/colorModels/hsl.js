import toHsv from "../utils/hslToHsv";
import fromHsv from "../utils/hsvToHsl";
import equal from "../utils/equalColorObjects";

export default {
  defaultColor: { h: 0, s: 0, l: 0 },
  toHsv,
  fromHsv,
  equal,
};
