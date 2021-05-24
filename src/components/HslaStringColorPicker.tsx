import React from "react";

import { AlphaColorPicker } from "./common/AlphaColorPicker";
import { ColorModel, ColorPickerBaseProps, HslaStringColor } from "../types";
import { equalColorString } from "../utils/compare";
import { hslaStringToHsva, hsvaToHslaString } from "../utils/convert";

const colorModel: ColorModel<HslaStringColor> = {
  defaultColor: "hsla(0, 0%, 0%, 1)",
  toHsva: hslaStringToHsva,
  fromHsva: hsvaToHslaString,
  equal: equalColorString,
};

export const HslaStringColorPicker = (
  props: Partial<ColorPickerBaseProps<HslaStringColor>>
): JSX.Element => <AlphaColorPicker {...props} colorModel={colorModel} />;
