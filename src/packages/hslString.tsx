import React from "react";

import ColorPicker from "../components/ColorPicker";
import withColorModel from "../hocs/withColorModel";
import { ColorModel, ColorPickerBaseProps } from "../types";
import { equalColorString } from "../utils/compare";
import { hslStringToHsv, hsvToHslString } from "../utils/convert";

const colorModel: ColorModel<string> = {
  defaultColor: "hsl(0, 0%, 0%)",
  toHsv: hslStringToHsv,
  fromHsv: hsvToHslString,
  equal: equalColorString,
};

const HslStringColorPicker: React.FC<Partial<ColorPickerBaseProps<string>>> = withColorModel(
  ColorPicker,
  colorModel
);

export default HslStringColorPicker;
