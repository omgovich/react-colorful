import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { OklchColorModel, OklchPickerProps, OklchColor } from "../types";
import { equalColorObjects } from "../utils/compare";
import { oklchaToState, stateToOklcha } from "../utils/oklch";

const colorModel: OklchColorModel<OklchColor> = {
  defaultColor: { l: 0, c: 0, h: 0 },
  toInternal: (color, gamut) => oklchaToState({ ...color, a: 1 }, gamut),
  fromInternal: (internal, gamut) => {
    const { l, c, h } = stateToOklcha(internal, gamut);
    return { l, c, h };
  },
  equal: equalColorObjects,
};

export const OklchColorPicker = (props: OklchPickerProps<OklchColor>): React.ReactElement => (
  <OklchPicker {...props} colorModel={colorModel} />
);
