import React from "react";

import { AlphaColorPicker } from "./common/AlphaColorPicker";
import { ColorModel, ColorPickerBaseProps, HsvaColor } from "../types";
import { equalColorObjects } from "../utils/compare";
import { roundHsva } from "../utils/convert";

const colorModel: ColorModel<HsvaColor> = {
  defaultColor: { h: 0, s: 0, v: 0, a: 1 },
  toHsva: (hsva) => hsva,
  fromHsva: roundHsva,
  equal: equalColorObjects,
};

export const HsvaColorPicker = (props: Partial<ColorPickerBaseProps<HsvaColor>>): JSX.Element => (
  <AlphaColorPicker {...props} colorModel={colorModel} />
);
