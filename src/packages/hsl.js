import React from "react";
import ColorPicker from "../components/ColorPicker";

import toHsv from "../utils/hslToHsv";
import fromHsv from "../utils/hsvToHsl";
import equal from "../utils/equalColorObjects";

const HSL = {
  defaultColor: { h: 0, s: 0, l: 0 },
  toHsv,
  fromHsv,
  equal,
};

ColorPicker.defaultProps = { colorModel: HSL };

export default React.memo(ColorPicker);
