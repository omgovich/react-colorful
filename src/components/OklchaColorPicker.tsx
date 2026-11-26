import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { oklchModel } from "./common/oklchModel";
import { ColorModel, OklchGamut, OklchPickerProps, OklchState, OklchaColor } from "../types";
import { equalColorObjects } from "../utils/compare";

const models: Partial<Record<OklchGamut, ColorModel<OklchaColor, OklchState>>> = {};

export const OklchaColorPicker = ({
  gamut = "srgb",
  ...props
}: OklchPickerProps<OklchaColor>): React.ReactElement => (
  <OklchPicker
    {...props}
    gamut={gamut}
    alpha
    colorModel={oklchModel<OklchaColor>(
      models,
      gamut,
      { l: 0, c: 0, h: 0, a: 1 },
      (color) => color,
      (color) => color,
      equalColorObjects
    )}
  />
);
