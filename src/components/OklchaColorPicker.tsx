import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { ColorModel, OklchGamut, OklchPickerProps, OklchState, OklchaColor } from "../types";
import { equalColorObjects } from "../utils/compare";
import { oklchaToState, stateToOklcha } from "../utils/oklch";

// Shared by both models: with no `color` prop the picker gets `defaultColor`, and a new object
// on a gamut switch would look like a new color
const defaultColor = { l: 0, c: 0, h: 0, a: 1 };

// One color model per gamut. Plain object literals, like every other picker's model: calling a
// function here to build them would keep the OKLCH code in every other picker's bundle
const colorModels: Record<OklchGamut, ColorModel<OklchaColor, OklchState>> = {
  srgb: {
    defaultColor,
    toInternal: (color) => oklchaToState(color, "srgb"),
    fromInternal: (internal) => stateToOklcha(internal, "srgb"),
    equal: equalColorObjects,
  },
  p3: {
    defaultColor,
    toInternal: (color) => oklchaToState(color, "p3"),
    fromInternal: (internal) => stateToOklcha(internal, "p3"),
    equal: equalColorObjects,
  },
};

export const OklchaColorPicker = ({
  gamut = "srgb",
  ...props
}: OklchPickerProps<OklchaColor>): React.ReactElement => (
  <OklchPicker {...props} gamut={gamut} alpha colorModel={colorModels[gamut]} />
);
