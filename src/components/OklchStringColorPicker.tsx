import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { GamutColorModel, OklchPickerProps } from "../types";
import {
  equalOklchString,
  formatOklch,
  parseOklcha,
  oklchaToState,
  stateToOklcha,
} from "../utils/oklch";

const colorModel: GamutColorModel<string> = {
  defaultColor: "oklch(0 0 0)",
  toInternal: (color, gamut, previous) =>
    oklchaToState({ ...parseOklcha(color), a: 1 }, gamut, previous),
  fromInternal: (internal, gamut) => formatOklch(stateToOklcha(internal, gamut)),
  equal: equalOklchString,
};

export const OklchStringColorPicker = (props: OklchPickerProps<string>): React.ReactElement => (
  <OklchPicker {...props} colorModel={colorModel} />
);
