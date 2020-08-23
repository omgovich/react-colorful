import React from "react";

import ColorPicker from "../components/ColorPicker";
import withColorModel from "../hocs/withColorModel";
import { ColorModel, ColorPickerBaseProps } from "../types";
import { hexToHsv, hsvToHex } from "../utils/conversions";
import equal from "../utils/equalHex";

interface Props extends ColorPickerBaseProps {
  color: string;
  onChange: (newColor: string) => void;
}

const colorModel: ColorModel<string> = {
  defaultColor: { h: 0, s: 0, l: 0 },
  toHsv: hexToHsv,
  fromHsv: hsvToHex,
  equal,
};

const HexColorPicker: React.FC<Props> = withColorModel(ColorPicker, colorModel);

export default HexColorPicker;
