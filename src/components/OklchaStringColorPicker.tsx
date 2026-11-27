import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { GamutColorModel, OklchPickerProps } from "../types";
import {
  equalOklchString,
  formatOklcha,
  parseOklcha,
  oklchaToInternal,
  internalToOklcha,
} from "../utils/oklch";

const colorModel: GamutColorModel<string> = {
  defaultColor: "oklch(0 0 0 / 1)",
  toInternal: (color, gamut, previous) => oklchaToInternal(parseOklcha(color), gamut, previous),
  fromInternal: (internal, gamut) => formatOklcha(internalToOklcha(internal, gamut)),
  equal: equalOklchString,
};

export const OklchaStringColorPicker = (props: OklchPickerProps<string>): React.ReactElement => (
  <OklchPicker {...props} alpha colorModel={colorModel} />
);
