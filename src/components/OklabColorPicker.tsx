import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { GamutColorModel, OklchPickerProps, OklabColor } from "../types";
import { equalColorObjects } from "../utils/compare";
import { oklabaToInternal, internalToOklaba } from "../utils/oklab";

const colorModel: GamutColorModel<OklabColor> = {
  defaultColor: { l: 0, a: 0, b: 0 },
  toInternal: (color, gamut, previous) => oklabaToInternal({ ...color, alpha: 1 }, gamut, previous),
  fromInternal: (internal, gamut) => {
    const { l, a, b } = internalToOklaba(internal, gamut);
    return { l, a, b };
  },
  equal: equalColorObjects,
};

// The OKLCH pickers' square and sliders, with colors written as OKLab
export const OklabColorPicker = (props: OklchPickerProps<OklabColor>): React.ReactElement => (
  <OklchPicker {...props} colorModel={colorModel} />
);
