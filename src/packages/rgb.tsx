import React from "react";

import ColorPicker from "../components/ColorPicker";
import { ColorModel, ColorPickerBaseProps, RGB } from "../types";
import { equalColorObjects } from "../utils/compare";
import { rgbToHsv, hsvToRgb } from "../utils/convert";

const colorModel: ColorModel<RGB> = {
  defaultColor: { r: 0, g: 0, b: 0 },
  toHsv: rgbToHsv,
  fromHsv: hsvToRgb,
  equal: equalColorObjects,
};

const RgbColorPicker = (props: Partial<ColorPickerBaseProps<RGB>>): JSX.Element => (
  <ColorPicker {...props} colorModel={colorModel} />
);

export default RgbColorPicker;
