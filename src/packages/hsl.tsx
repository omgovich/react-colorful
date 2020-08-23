import React from "react";

import ColorPicker from "../components/ColorPicker";
import withColorModel from "../hocs/withColorModel";
import { ColorModel, ColorPickerBaseProps, HSL } from "../types";
import { hslToHsv, hsvToHsl } from "../utils/conversions";
import equal from "../utils/equalColorObjects";

interface Props extends ColorPickerBaseProps {
  color: HSL;
  onChange: (newColor: HSL) => void;
}

const colorModel: ColorModel<HSL> = {
  defaultColor: { h: 0, s: 0, l: 0 },
  toHsv: hslToHsv,
  fromHsv: hsvToHsl,
  equal,
};

const HslColorPicker: React.FC<Props> = withColorModel(ColorPicker, colorModel);

export default HslColorPicker;
