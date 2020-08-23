import React from "react";

import ColorPicker from "../components/ColorPicker";
import withColorModel from "../hocs/withColorModel";
import { ColorModel, ColorPickerBaseProps } from "../types";
import { hslStringToHsv, hsvToHslString } from "../utils/conversions";
import equal from "../utils/equalColorObjects";

interface Props extends ColorPickerBaseProps {
  color: string;
  onChange: (newColor: string) => void;
}

const colorModel: ColorModel<string> = {
  defaultColor: "hsl(0, 0%, 0%)",
  toHsv: hslStringToHsv,
  fromHsv: hsvToHslString,
  equal,
};

const HslStringColorPicker: React.FC<Props> = withColorModel(ColorPicker, colorModel);

export default HslStringColorPicker;
