import React from "react";

import ColorPicker from "../components/ColorPicker";
import withColorModel from "../hocs/withColorModel";
import { ColorModel, ColorPickerBaseProps, HSV } from "../types";
import { equalColorObjects } from "../utils/compare";

interface Props extends ColorPickerBaseProps<string> {
  color: string;
}

const colorModel: ColorModel<HSV> = {
  defaultColor: { h: 0, s: 0, v: 0 },
  toHsv: (hsv) => hsv,
  fromHsv: (hsv) => hsv,
  equal: equalColorObjects,
};

const HsvColorPicker: React.FC<Partial<Props>> = withColorModel(ColorPicker, colorModel);

export default HsvColorPicker;
