import React from "react";

import ColorPicker from "../components/ColorPicker";
import withColorModel from "../hocs/withColorModel";
import { ColorModel, ColorPickerBaseProps } from "../types";
import { equalColorObjects } from "../utils/compare";
import { hslStringToHsv, hsvToHslString } from "../utils/convert";

interface Props extends ColorPickerBaseProps {
  color: string;
  onChange: (newColor: string) => void;
}

const colorModel: ColorModel<string> = {
  defaultColor: "hsl(0, 0%, 0%)",
  toHsv: hslStringToHsv,
  fromHsv: hsvToHslString,
  equal: equalColorObjects,
};

const HslStringColorPicker: React.FC<Partial<Props>> = withColorModel(ColorPicker, colorModel);

export default HslStringColorPicker;
