import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { OklchColorModel, OklchPickerProps } from "../types";
import {
  equalOklchString,
  formatOklch,
  parseOklcha,
  oklchaToState,
  stateToOklcha,
} from "../utils/oklch";

const colorModel: OklchColorModel<string> = {
  defaultColor: "oklch(0 0 0)",
  toInternal: (color, gamut) => oklchaToState({ ...parseOklcha(color), a: 1 }, gamut),
  fromInternal: (internal, gamut) => formatOklch(stateToOklcha(internal, gamut)),
  equal: equalOklchString,
};

export const OklchStringColorPicker = (props: OklchPickerProps<string>): React.ReactElement => (
  <OklchPicker {...props} colorModel={colorModel} />
);
