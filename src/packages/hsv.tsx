import React from "react";
import ColorPicker from "../components/ColorPicker";

import equal from "../utils/equalColorObjects";

const HSV = {
  defaultColor: { h: 0, s: 0, v: 0 },
  toHsv: (hsv) => hsv,
  fromHsv: (hsv) => hsv,
  equal,
};

ColorPicker.defaultProps = { colorModel: HSV };

export default React.memo(ColorPicker);
