import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { ColorModel, OklchGamut, OklchPickerProps, OklchState } from "../types";
import { equalColorString } from "../utils/compare";
import { formatOklcha, parseOklcha, oklchaToState, stateToOklcha } from "../utils/oklch";

// One color model per gamut. Plain object literals, like every other picker's model: calling a
// function here to build them would keep the OKLCH code in every other picker's bundle
const colorModels: Record<OklchGamut, ColorModel<string, OklchState>> = {
  srgb: {
    defaultColor: "oklch(0 0 0 / 1)",
    toInternal: (color) => oklchaToState(parseOklcha(color), "srgb"),
    fromInternal: (internal) => formatOklcha(stateToOklcha(internal, "srgb")),
    equal: equalColorString,
  },
  p3: {
    defaultColor: "oklch(0 0 0 / 1)",
    toInternal: (color) => oklchaToState(parseOklcha(color), "p3"),
    fromInternal: (internal) => formatOklcha(stateToOklcha(internal, "p3")),
    equal: equalColorString,
  },
};

export const OklchaStringColorPicker = ({
  gamut = "srgb",
  ...props
}: OklchPickerProps<string>): React.ReactElement => (
  <OklchPicker {...props} gamut={gamut} alpha colorModel={colorModels[gamut]} />
);
