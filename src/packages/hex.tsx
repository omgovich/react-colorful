import React from "react";
import ColorPicker from "../components/ColorPicker";

import toHsv from "../utils/hexToHsv";
import fromHsv from "../utils/hsvToHex";
import equal from "../utils/equalHex";

const HEX = {
  defaultColor: "000",
  toHsv,
  fromHsv,
  equal,
};

ColorPicker.defaultProps = { colorModel: HEX };

export default React.memo(ColorPicker);
