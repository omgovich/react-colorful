import hsvToHex from "../utils/hsvToHex";
import hexToHsv from "../utils/hexToHsv";
import equalHex from "../utils/equalHex";

export default {
  toHsv: hexToHsv,
  fromHsv: hsvToHex,
  equal: equalHex,
};
