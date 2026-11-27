import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { GamutColorModel, OklchPickerProps } from "../types";
import {
  equalOklabString,
  formatOklab,
  parseOklaba,
  oklabaToInternal,
  internalToOklaba,
} from "../utils/oklab";

const colorModel: GamutColorModel<string> = {
  defaultColor: "oklab(0 0 0)",
  toInternal: (color, gamut, previous) =>
    oklabaToInternal({ ...parseOklaba(color), alpha: 1 }, gamut, previous),
  fromInternal: (internal, gamut) => formatOklab(internalToOklaba(internal, gamut)),
  equal: equalOklabString,
};

// The OKLCH pickers' square and sliders, with colors written as OKLab
export const OklabStringColorPicker = (props: OklchPickerProps<string>): React.ReactElement => (
  <OklchPicker {...props} colorModel={colorModel} />
);
