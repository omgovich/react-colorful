import React from "react";

import ColorPicker from "./components/ColorPicker";
import { ColorModel, ColorPickerBaseProps } from "./types";
import { equalColorString } from "./utils/compare";
import { hslStringToHsv, hsvToHslString } from "./utils/convert";

const colorModel: ColorModel<string> = {
  defaultColor: "hsl(0, 0%, 0%)",
  toHsv: hslStringToHsv,
  fromHsv: hsvToHslString,
  equal: equalColorString,
};

const HslStringColorPicker = (props: Partial<ColorPickerBaseProps<string>>): JSX.Element => (
  <ColorPicker {...props} colorModel={colorModel} />
);

export default HslStringColorPicker;
