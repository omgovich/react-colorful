import React from "react";

import { ColorPicker } from "./common/ColorPicker";
import { ColorModel, ColorPickerBaseProps } from "../types";
import { equalColorString } from "../utils/compare";
import { rgbStringToHsva, hsvaToRgbString } from "../utils/convert";

const colorModel: ColorModel<string> = {
  defaultColor: "rgb(0, 0, 0)",
  toHsva: rgbStringToHsva,
  fromHsva: hsvaToRgbString,
  equal: equalColorString,
};

export const RgbStringColorPicker = (props: Partial<ColorPickerBaseProps<string>>): JSX.Element => (
  <ColorPicker {...props} colorModel={colorModel} />
);
