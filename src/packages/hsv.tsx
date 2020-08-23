import React from "react";

import ColorPicker from "../components/ColorPicker";
import withColorModel from "../hocs/withColorModel";
import { ColorModel, ColorPickerBaseProps, HSV } from "../types";
import equal from "../utils/equalColorObjects";

interface Props extends ColorPickerBaseProps {
  color: string;
  onChange: (newColor: string) => void;
}

const colorModel: ColorModel<HSV> = {
  defaultColor: { h: 0, s: 0, v: 0 },
  toHsv: (hsv) => hsv,
  fromHsv: (hsv) => hsv,
  equal,
};

const HsvColorPicker: React.FC<Props> = withColorModel(ColorPicker, colorModel);

export default HsvColorPicker;
