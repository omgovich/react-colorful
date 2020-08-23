import React from "react";

import ColorPicker from "../components/ColorPicker";
import withColorModel from "../hocs/withColorModel";
import { ColorModel, ColorPickerBaseProps } from "../types";
import { equalHex } from "../utils/compare";
import { hexToHsv, hsvToHex } from "../utils/convert";

interface Props extends ColorPickerBaseProps {
  color: string;
  onChange: (newColor: string) => void;
}

const colorModel: ColorModel<string> = {
  defaultColor: "000",
  toHsv: hexToHsv,
  fromHsv: hsvToHex,
  equal: equalHex,
};

const HexColorPicker: React.FC<Props> = withColorModel(ColorPicker, colorModel);

export default HexColorPicker;
