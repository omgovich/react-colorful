import React from "react";

import { ColorPicker } from "./common/ColorPicker";
import { ColorModel, ColorPickerBaseProps } from "../types";
import { equalColorString } from "../utils/compare";
import { hsvStringToHsva, hsvaToHsvString } from "../utils/convert";

const colorModel: ColorModel<string> = {
  defaultColor: "hsv(0, 0%, 0%)",
  toHsva: hsvStringToHsva,
  fromHsva: hsvaToHsvString,
  equal: equalColorString,
};

export const HsvStringColorPicker = (props: Partial<ColorPickerBaseProps<string>>): JSX.Element => (
  <ColorPicker {...props} colorModel={colorModel} />
);
