import React from "react";

import ColorPicker from "../components/ColorPicker";
import withColorModel from "../hocs/withColorModel";
import { ColorModel, ColorPickerBaseProps } from "../types";
import { equalColorString } from "../utils/compare";
import { rgbStringToHsv, hsvToRgbString } from "../utils/convert";

interface Props extends ColorPickerBaseProps<string> {
  color: string;
}

const colorModel: ColorModel<string> = {
  defaultColor: "rgb(0, 0, 0)",
  toHsv: rgbStringToHsv,
  fromHsv: hsvToRgbString,
  equal: equalColorString,
};

const RgbStringColorPicker: React.FC<Partial<Props>> = withColorModel(ColorPicker, colorModel);

export default RgbStringColorPicker;
