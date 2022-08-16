import React from "react";

import { AlphaColorPicker } from "./common/AlphaColorPicker";
import { ColorModel, ColorPickerBaseProps } from "../types";
import { equalHex } from "../utils/compare";
import { hexToHsva, hsvaToHex } from "../utils/convert";

const colorModel: ColorModel<string> = {
  defaultColor: "0001",
  toHsva: hexToHsva,
  fromHsva: hsvaToHex,
  equal: equalHex,
};

export const HexAlphaColorPicker = (props: Partial<ColorPickerBaseProps<string>>): JSX.Element => (
  <AlphaColorPicker {...props} colorModel={colorModel} />
);
