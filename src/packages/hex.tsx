import React from "react";

import ColorPicker from "./components/ColorPicker";
import { ColorModel, ColorPickerBaseProps } from "./types";
import { equalHex } from "./utils/compare";
import { hexToHsv, hsvToHex } from "./utils/convert";

const colorModel: ColorModel<string> = {
  defaultColor: "000",
  toHsv: hexToHsv,
  fromHsv: hsvToHex,
  equal: equalHex,
};

const HexColorPicker = (props: Partial<ColorPickerBaseProps<string>>): JSX.Element => (
  <ColorPicker {...props} colorModel={colorModel} />
);

export default HexColorPicker;
