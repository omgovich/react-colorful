import React from "react";

import { AlphaColorPicker } from "./common/AlphaColorPicker";
import { ColorModel, ColorPickerBaseProps } from "../types";
import { equalColorString } from "../utils/compare";
import { hsvaStringToHsva, hsvaToHsvaString, updateAlphaFromString } from "../utils/convert";

const colorModel: ColorModel<string> = {
  defaultColor: "hsva(0, 0%, 0%, 1)",
  toHsva: hsvaStringToHsva,
  fromHsva: hsvaToHsvaString,
  equal: equalColorString,
  updateAlpha: updateAlphaFromString,
};

export const HsvaStringColorPicker = (
  props: Partial<ColorPickerBaseProps<string>>
): JSX.Element => <AlphaColorPicker {...props} colorModel={colorModel} />;
