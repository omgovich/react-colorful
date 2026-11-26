import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { oklchModel } from "./common/oklchModel";
import { ColorModel, OklchGamut, OklchPickerProps, OklchState, OklchColor } from "../types";
import { equalColorObjects } from "../utils/compare";

const models: Partial<Record<OklchGamut, ColorModel<OklchColor, OklchState>>> = {};

export const OklchColorPicker = ({
  gamut = "srgb",
  ...props
}: OklchPickerProps<OklchColor>): React.ReactElement => (
  <OklchPicker
    {...props}
    gamut={gamut}
    colorModel={oklchModel<OklchColor>(
      models,
      gamut,
      { l: 0, c: 0, h: 0 },
      (color) => Object.assign({ a: 1 }, color),
      ({ l, c, h }) => ({ l, c, h }),
      equalColorObjects
    )}
  />
);
