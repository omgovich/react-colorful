import React from "react";

import ColorPicker from "../components/ColorPicker";
import withColorModel from "../hocs/withColorModel";
import { ColorModel, ColorPickerBaseProps, RGB } from "../types";
import { equalColorObjects } from "../utils/compare";
import { rgbToHsv, hsvToRgb } from "../utils/convert";

interface Props extends ColorPickerBaseProps<RGB> {
  color: RGB;
}

const colorModel: ColorModel<RGB> = {
  defaultColor: { r: 0, g: 0, b: 0 },
  toHsv: rgbToHsv,
  fromHsv: hsvToRgb,
  equal: equalColorObjects,
};

const RgbColorPicker: React.FC<Partial<Props>> = withColorModel(ColorPicker, colorModel);

export default RgbColorPicker;
