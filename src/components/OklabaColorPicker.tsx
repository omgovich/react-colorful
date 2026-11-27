import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { GamutColorModel, OklchPickerProps, OklabaColor } from "../types";
import { equalColorObjects } from "../utils/compare";
import { oklabaToInternal, internalToOklaba } from "../utils/oklab";

const colorModel: GamutColorModel<OklabaColor> = {
  defaultColor: { l: 0, a: 0, b: 0, alpha: 1 },
  toInternal: oklabaToInternal,
  fromInternal: internalToOklaba,
  equal: equalColorObjects,
};

// The OKLCH pickers' square and sliders, with colors written as OKLab
export const OklabaColorPicker = (props: OklchPickerProps<OklabaColor>): React.ReactElement => (
  <OklchPicker {...props} alpha colorModel={colorModel} />
);
