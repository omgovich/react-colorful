import React from "react";

import { ColorPicker } from "./common/ColorPicker";
import { ColorModel, ColorPickerBaseProps, RgbColor } from "../types";
import { equalColorObjects } from "../utils/compare";
import { rgbToHsv, hsvToRgb } from "../utils/convert";

const colorModel: ColorModel<RgbColor> = {
  defaultColor: { r: 0, g: 0, b: 0 },
  toHsv: rgbToHsv,
  fromHsv: hsvToRgb,
  equal: equalColorObjects,
};

export const RgbColorPicker = (props: Partial<ColorPickerBaseProps<RgbColor>>): JSX.Element => (
  <ColorPicker {...props} colorModel={colorModel} />
);
