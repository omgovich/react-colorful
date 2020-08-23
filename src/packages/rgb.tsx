import React from "react";

import ColorPicker from "../components/ColorPicker";
import withColorModel from "../hocs/withColorModel";
import { ColorModel, ColorPickerBaseProps, RGB } from "../types";
import { rgbToHsv, hsvToRgb } from "../utils/conversions";
import equal from "../utils/equalColorObjects";

interface Props extends ColorPickerBaseProps {
  color: RGB;
  onChange: (newColor: RGB) => void;
}

const colorModel: ColorModel<RGB> = {
  defaultColor: { r: 0, g: 0, b: 0 },
  toHsv: rgbToHsv,
  fromHsv: hsvToRgb,
  equal,
};

const RgbColorPicker: React.FC<Props> = withColorModel(ColorPicker, colorModel);

export default RgbColorPicker;
