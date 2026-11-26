import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { GamutColorModel, OklchPickerProps } from "../types";
import {
  equalOklabString,
  formatOklaba,
  parseOklaba,
  oklabaToInternal,
  internalToOklaba,
} from "../utils/oklab";

const colorModel: GamutColorModel<string> = {
  defaultColor: "oklab(0 0 0 / 1)",
  toInternal: (color, gamut, previous) => oklabaToInternal(parseOklaba(color), gamut, previous),
  fromInternal: (internal, gamut) => formatOklaba(internalToOklaba(internal, gamut)),
  equal: equalOklabString,
};

// The OKLCH pickers' square and sliders, with colors written as OKLab
export const OklabaStringColorPicker = (props: OklchPickerProps<string>): React.ReactElement => (
  <OklchPicker {...props} alpha colorModel={colorModel} />
);
