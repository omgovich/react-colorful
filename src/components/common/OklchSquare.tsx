import React from "react";

import { Interactive, Interaction } from "./Interactive";
import { Pointer } from "./Pointer";
import { OklchSquareLayers } from "./OklchSquareLayers";

import { OklchGamut, OklchInternal } from "../../types";
import { maxChroma } from "../../utils/oklchGamut";
import { oklchString } from "../../utils/oklch";
import { clamp } from "../../utils/clamp";
import { round } from "../../utils/round";

interface Props {
  internal: OklchInternal;
  gamut: OklchGamut;
  onChange: (newState: { l: number; x: number }) => void;
  onChangeEnd?: () => void;
}

/**
 * Lightness (top to bottom) against chroma as a share of the highest one this lightness and hue
 * reach in the gamut (left to right).
 * Drawn with CSS gradients (`OklchSquareLayers`), no canvas: it renders on the server, scales
 * with CSS and keeps the `.react-colorful__saturation` styles.
 */
// No `React.memo`: a top-level call would stay in the bundle of every other picker
export const OklchSquare = ({
  internal,
  gamut,
  onChange,
  onChangeEnd,
}: Props): React.ReactElement => {
  const { l, x, h } = internal;

  const handleMove = (interaction: Interaction) => {
    onChange({ x: interaction.left, l: 1 - interaction.top });
  };

  const handleKey = (offset: Interaction) => {
    onChange({ x: clamp(x + offset.left), l: clamp(l - offset.top) });
  };

  return (
    // The layers cover the whole square: the HSV gradients of `.react-colorful__saturation` would
    // be painted under them for nothing
    <div className="react-colorful__saturation" style={{ backgroundImage: "none" }}>
      <OklchSquareLayers hue={h} gamut={gamut} />
      <Interactive
        onMove={handleMove}
        onKey={handleKey}
        onEnd={onChangeEnd}
        aria-label="Color"
        aria-valuetext={`Lightness ${round(l * 100)}%, Chroma ${round(x * 100)}% of the maximum`}
        aria-valuenow={round(x * 100)}
      >
        <Pointer
          className="react-colorful__saturation-pointer"
          top={1 - l}
          left={x}
          color={oklchString(l, x * maxChroma(l, h, gamut), h)}
        />
      </Interactive>
    </div>
  );
};
