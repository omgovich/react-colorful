import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { GamutColorModel, OklchPickerProps, OklchaColor } from "../types";
import { equalColorObjects } from "../utils/compare";
import { oklchaToInternal, internalToOklcha } from "../utils/oklch";

const colorModel: GamutColorModel<OklchaColor> = {
  defaultColor: { l: 0, c: 0, h: 0, a: 1 },
  toInternal: oklchaToInternal,
  fromInternal: internalToOklcha,
  equal: equalColorObjects,
};

export const OklchaColorPicker = (props: OklchPickerProps<OklchaColor>): React.ReactElement => (
  <OklchPicker {...props} alpha colorModel={colorModel} />
);
