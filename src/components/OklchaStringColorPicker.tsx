import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { oklchModel } from "./common/oklchModel";
import { ColorModel, OklchGamut, OklchPickerProps, OklchState } from "../types";
import { equalColorString } from "../utils/compare";
import { formatOklcha, parseOklcha } from "../utils/oklch";

const models: Partial<Record<OklchGamut, ColorModel<string, OklchState>>> = {};

export const OklchaStringColorPicker = ({
  gamut = "srgb",
  ...props
}: OklchPickerProps<string>): React.ReactElement => (
  <OklchPicker
    {...props}
    gamut={gamut}
    alpha
    colorModel={oklchModel<string>(
      models,
      gamut,
      "oklch(0 0 0 / 1)",
      parseOklcha,
      formatOklcha,
      equalColorString
    )}
  />
);
