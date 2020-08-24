import React from "react";

import ColorPicker from "../components/ColorPicker";
import withColorModel from "../hocs/withColorModel";
import { ColorModel, ColorPickerBaseProps } from "../types";
import { equalHex } from "../utils/compare";
import { hexToHsv, hsvToHex } from "../utils/convert";

const colorModel: ColorModel<string> = {
  defaultColor: "000",
  toHsv: hexToHsv,
  fromHsv: hsvToHex,
  equal: equalHex,
};

const HexColorPicker: React.FC<Partial<ColorPickerBaseProps<string>>> = withColorModel(
  ColorPicker,
  colorModel
);

export default HexColorPicker;
