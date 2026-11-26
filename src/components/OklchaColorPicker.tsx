import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { OklchColorModel, OklchPickerProps, OklchaColor } from "../types";
import { equalColorObjects } from "../utils/compare";
import { oklchaToState, stateToOklcha } from "../utils/oklch";

const colorModel: OklchColorModel<OklchaColor> = {
  defaultColor: { l: 0, c: 0, h: 0, a: 1 },
  toInternal: oklchaToState,
  fromInternal: stateToOklcha,
  equal: equalColorObjects,
};

export const OklchaColorPicker = (props: OklchPickerProps<OklchaColor>): React.ReactElement => (
  <OklchPicker {...props} alpha colorModel={colorModel} />
);
