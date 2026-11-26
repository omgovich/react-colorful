import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { ColorModel, OklchGamut, OklchPickerProps, OklchState } from "../types";
import { equalColorString } from "../utils/compare";
import { formatOklch, parseOklcha, oklchaToState, stateToOklcha } from "../utils/oklch";

// One color model per gamut. Plain object literals, like every other picker's model: calling a
// function here to build them would keep the OKLCH code in every other picker's bundle
const colorModels: Record<OklchGamut, ColorModel<string, OklchState>> = {
  srgb: {
    defaultColor: "oklch(0 0 0)",
    toInternal: (color) => oklchaToState(Object.assign(parseOklcha(color), { a: 1 }), "srgb"),
    fromInternal: (internal) => formatOklch(stateToOklcha(internal, "srgb")),
    equal: equalColorString,
  },
  p3: {
    defaultColor: "oklch(0 0 0)",
    toInternal: (color) => oklchaToState(Object.assign(parseOklcha(color), { a: 1 }), "p3"),
    fromInternal: (internal) => formatOklch(stateToOklcha(internal, "p3")),
    equal: equalColorString,
  },
};

export const OklchStringColorPicker = ({
  gamut = "srgb",
  ...props
}: OklchPickerProps<string>): React.ReactElement => (
  <OklchPicker {...props} gamut={gamut} colorModel={colorModels[gamut]} />
);
