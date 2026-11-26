import React from "react";

import { OklchPicker } from "./common/OklchPicker";
import { ColorModel, OklchGamut, OklchPickerProps, OklchState, OklchColor } from "../types";
import { equalColorObjects } from "../utils/compare";
import { oklchaToState, stateToOklcha } from "../utils/oklch";

// One color model per gamut. Plain object literals, like every other picker's model: calling a
// function here to build them would keep the OKLCH code in every other picker's bundle
const colorModels: Record<OklchGamut, ColorModel<OklchColor, OklchState>> = {
  srgb: {
    defaultColor: { l: 0, c: 0, h: 0 },
    toInternal: (color) => oklchaToState(Object.assign({ a: 1 }, color), "srgb"),
    fromInternal: (internal) => {
      const { l, c, h } = stateToOklcha(internal, "srgb");
      return { l, c, h };
    },
    equal: equalColorObjects,
  },
  p3: {
    defaultColor: { l: 0, c: 0, h: 0 },
    toInternal: (color) => oklchaToState(Object.assign({ a: 1 }, color), "p3"),
    fromInternal: (internal) => {
      const { l, c, h } = stateToOklcha(internal, "p3");
      return { l, c, h };
    },
    equal: equalColorObjects,
  },
};

export const OklchColorPicker = ({
  gamut = "srgb",
  ...props
}: OklchPickerProps<OklchColor>): React.ReactElement => (
  <OklchPicker {...props} gamut={gamut} colorModel={colorModels[gamut]} />
);
