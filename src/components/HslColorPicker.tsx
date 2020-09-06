import React from "react";

import { ColorPicker } from "./common/ColorPicker";
import { ColorModel, ColorPickerBaseProps, HslColor } from "../types";
import { equalColorObjects } from "../utils/compare";
import { hslToHsv, hsvToHsl } from "../utils/convert";

const colorModel: ColorModel<HslColor> = {
  defaultColor: { h: 0, s: 0, l: 0 },
  toHsv: hslToHsv,
  fromHsv: hsvToHsl,
  equal: equalColorObjects,
};

export const HslColorPicker = (props: Partial<ColorPickerBaseProps<HslColor>>): JSX.Element => (
  <ColorPicker {...props} colorModel={colorModel} />
);
