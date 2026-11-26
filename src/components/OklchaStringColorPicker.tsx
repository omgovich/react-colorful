import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { OklchColorModel, OklchPickerProps } from "../types";
import {
  equalOklchString,
  formatOklcha,
  parseOklcha,
  oklchaToState,
  stateToOklcha,
} from "../utils/oklch";

const colorModel: OklchColorModel<string> = {
  defaultColor: "oklch(0 0 0 / 1)",
  toInternal: (color, gamut) => oklchaToState(parseOklcha(color), gamut),
  fromInternal: (internal, gamut) => formatOklcha(stateToOklcha(internal, gamut)),
  equal: equalOklchString,
};

export const OklchaStringColorPicker = (props: OklchPickerProps<string>): React.ReactElement => (
  <OklchPicker {...props} alpha colorModel={colorModel} />
);
