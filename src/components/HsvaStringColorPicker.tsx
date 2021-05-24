import React from "react";

import { AlphaColorPicker } from "./common/AlphaColorPicker";
import { ColorModel, ColorPickerBaseProps, HsvaStringColor } from "../types";
import { equalColorString } from "../utils/compare";
import { hsvaStringToHsva, hsvaToHsvaString } from "../utils/convert";

const colorModel: ColorModel<HsvaStringColor> = {
  defaultColor: "hsva(0, 0%, 0%, 1)",
  toHsva: hsvaStringToHsva,
  fromHsva: hsvaToHsvaString,
  equal: equalColorString,
};

export const HsvaStringColorPicker = (
  props: Partial<ColorPickerBaseProps<HsvaStringColor>>
): JSX.Element => <AlphaColorPicker {...props} colorModel={colorModel} />;
