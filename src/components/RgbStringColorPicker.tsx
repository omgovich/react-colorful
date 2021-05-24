import React from "react";

import { ColorPicker } from "./common/ColorPicker";
import { ColorModel, ColorPickerBaseProps, RgbStringColor } from "../types";
import { equalColorString } from "../utils/compare";
import { rgbStringToHsva, hsvaToRgbString } from "../utils/convert";

const colorModel: ColorModel<RgbStringColor> = {
  defaultColor: "rgb(0, 0, 0)",
  toHsva: rgbStringToHsva,
  fromHsva: hsvaToRgbString,
  equal: equalColorString,
};

export const RgbStringColorPicker = (
  props: Partial<ColorPickerBaseProps<RgbStringColor>>
): JSX.Element => <ColorPicker {...props} colorModel={colorModel} />;
