import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { oklchModel } from "./common/oklchModel";
import { ColorModel, OklchGamut, OklchPickerProps, OklchState } from "../types";
import { equalColorString } from "../utils/compare";
import { formatOklch, parseOklcha } from "../utils/oklch";

const models: Partial<Record<OklchGamut, ColorModel<string, OklchState>>> = {};

// A new gamut remounts the picker, so that it keeps the color and moves the pointer instead
export const OklchStringColorPicker = ({
  gamut = "srgb",
  ...props
}: OklchPickerProps<string>): React.ReactElement => (
  <OklchPicker
    key={gamut}
    {...props}
    gamut={gamut}
    colorModel={oklchModel<string>(
      models,
      gamut,
      "oklch(0 0 0)",
      (color) => Object.assign(parseOklcha(color), { a: 1 }),
      formatOklch,
      equalColorString
    )}
  />
);
