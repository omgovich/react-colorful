import React from "react";

import ColorPicker from "../components/ColorPicker";
import { ColorModel, ColorPickerBaseProps, HSV } from "../types";
import { equalColorObjects } from "../utils/compare";

const colorModel: ColorModel<HSV> = {
  defaultColor: { h: 0, s: 0, v: 0 },
  toHsv: (hsv) => hsv,
  fromHsv: (hsv) => hsv,
  equal: equalColorObjects,
};

const HsvColorPicker = (props: Partial<ColorPickerBaseProps<HSV>>): JSX.Element => (
  <ColorPicker {...props} colorModel={colorModel} />
);

export default HsvColorPicker;
