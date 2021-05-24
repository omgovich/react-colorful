import React from "react";

import { ColorPicker } from "./common/ColorPicker";
import { ColorModel, ColorPickerBaseProps, HslStringColor } from "../types";
import { equalColorString } from "../utils/compare";
import { hslStringToHsva, hsvaToHslString } from "../utils/convert";

const colorModel: ColorModel<HslStringColor> = {
  defaultColor: "hsl(0, 0%, 0%)",
  toHsva: hslStringToHsva,
  fromHsva: hsvaToHslString,
  equal: equalColorString,
};

export const HslStringColorPicker = (
  props: Partial<ColorPickerBaseProps<HslStringColor>>
): JSX.Element => <ColorPicker {...props} colorModel={colorModel} />;
