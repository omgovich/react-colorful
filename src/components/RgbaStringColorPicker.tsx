import React from "react";

import { AlphaColorPicker } from "./common/AlphaColorPicker";
import { ColorModel, ColorPickerBaseProps } from "../types";
import { equalColorString } from "../utils/compare";
import { rgbaStringToHsva, hsvaToRgbaString } from "../utils/convert";

const colorModel: ColorModel<string> = {
  defaultColor: "rgba(0, 0, 0, 1)",
  toHsva: rgbaStringToHsva,
  fromHsva: hsvaToRgbaString,
  equal: equalColorString,
};

export const RgbaStringColorPicker = (
  props: Partial<ColorPickerBaseProps<string>>
): JSX.Element => <AlphaColorPicker {...props} colorModel={colorModel} />;
