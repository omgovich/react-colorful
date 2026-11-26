import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { ColorModel, OklchGamut, OklchPickerProps, OklchState } from "../types";
import {
  equalOklchString,
  formatOklch,
  parseOklcha,
  oklchaToState,
  stateToOklcha,
} from "../utils/oklch";

// Shared by both models: with no `color` prop the picker gets `defaultColor`, and a new object
// on a gamut switch would look like a new color
const defaultColor = "oklch(0 0 0)";

// One color model per gamut. Plain object literals, like every other picker's model: calling a
// function here to build them would keep the OKLCH code in every other picker's bundle
const colorModels: Record<OklchGamut, ColorModel<string, OklchState>> = {
  srgb: {
    defaultColor,
    toInternal: (color) => oklchaToState(Object.assign(parseOklcha(color), { a: 1 }), "srgb"),
    fromInternal: (internal) => formatOklch(stateToOklcha(internal, "srgb")),
    equal: equalOklchString,
  },
  p3: {
    defaultColor,
    toInternal: (color) => oklchaToState(Object.assign(parseOklcha(color), { a: 1 }), "p3"),
    fromInternal: (internal) => formatOklch(stateToOklcha(internal, "p3")),
    equal: equalOklchString,
  },
};

export const OklchStringColorPicker = ({
  gamut = "srgb",
  ...props
}: OklchPickerProps<string>): React.ReactElement => (
  <OklchPicker {...props} gamut={gamut} colorModel={colorModels[gamut]} />
);
