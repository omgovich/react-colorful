import React from "react";
import ColorPicker from "../components/ColorPicker";

import toHsv from "../utils/rgbStringToHsv";
import fromHsv from "../utils/hsvToRgbString";
import equal from "../utils/equalColorObjects";

const HSL_STRING = {
  defaultColor: "rgb(0, 0, 0)",
  toHsv,
  fromHsv,
  equal,
};

ColorPicker.defaultProps = { colorModel: HSL_STRING };

export default React.memo(ColorPicker);
