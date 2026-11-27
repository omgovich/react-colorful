import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { GamutColorModel, OklchPickerProps, OklchColor } from "../types";
import { equalColorObjects } from "../utils/compare";
import { oklchaToInternal, internalToOklcha } from "../utils/oklch";

const colorModel: GamutColorModel<OklchColor> = {
  defaultColor: { l: 0, c: 0, h: 0 },
  toInternal: (color, gamut, previous) => oklchaToInternal({ ...color, a: 1 }, gamut, previous),
  fromInternal: (internal, gamut) => {
    const { l, c, h } = internalToOklcha(internal, gamut);
    return { l, c, h };
  },
  equal: equalColorObjects,
};

export const OklchColorPicker = (props: OklchPickerProps<OklchColor>): React.ReactElement => (
  <OklchPicker {...props} colorModel={colorModel} />
);
