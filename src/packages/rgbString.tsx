import React from "react";

import ColorPicker from "../components/ColorPicker";
import withColorModel from "../hocs/withColorModel";
import { ColorModel, ColorPickerBaseProps } from "../types";
import { equalColorObjects } from "../utils/compare";
import { rgbStringToHsv, hsvToRgbString } from "../utils/convert";

interface Props extends ColorPickerBaseProps {
  color: string;
  onChange: (newColor: string) => void;
}

const colorModel: ColorModel<string> = {
  defaultColor: "rgb(0, 0, 0)",
  toHsv: rgbStringToHsv,
  fromHsv: hsvToRgbString,
  equal: equalColorObjects,
};

const RgbStringColorPicker: React.FC<Props> = withColorModel(ColorPicker, colorModel);

export default RgbStringColorPicker;
