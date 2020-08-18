import React from "react";
import ColorPicker from "../components/ColorPicker";

import toHsv from "../utils/rgbToHsv";
import fromHsv from "../utils/hsvToRgb";
import equal from "../utils/equalColorObjects";

const RGB = {
  defaultColor: { r: 0, g: 0, b: 0 },
  toHsv,
  fromHsv,
  equal,
};

ColorPicker.defaultProps = { colorModel: RGB };

export default React.memo(ColorPicker);
