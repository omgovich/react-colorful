import React from "react";

import { Interactive, Interaction } from "./Interactive";
import { Pointer } from "./Pointer";

import { OklchGamut, OklchState } from "../../types";
import { layerMask, maxChroma, oklchString, squareLayers } from "../../utils/oklch";
import { clamp } from "../../utils/clamp";
import { round } from "../../utils/round";

interface Props {
  state: OklchState;
  gamut: OklchGamut;
  onChange: (newState: { l: number; x: number }) => void;
  onChangeEnd?: () => void;
}

/**
 * Lightness (top to bottom) against chroma as a share of the highest one this lightness and hue
 * reach in the gamut (left to right).
 *
 * A browser can only draw a gradient along one line, and this square changes along both. So it
 * is a stack of vertical gradients, one per chroma share in `LAYERS`, each fading in by a
 * horizontal mask where the previous one ends. No canvas: it renders on the server, scales
 * with CSS and keeps the `.react-colorful__saturation` styles.
 */
// No `React.memo`: a top-level call would stay in the bundle of every other picker
export const OklchSquare = ({ state, gamut, onChange, onChangeEnd }: Props): React.ReactElement => {
  const { l, x, h } = state;

  const handleMove = (interaction: Interaction) => {
    onChange({ x: interaction.left, l: 1 - interaction.top });
  };

  const handleKey = (offset: Interaction) => {
    onChange({ x: clamp(x + offset.left), l: clamp(l - offset.top) });
  };

  const layers = squareLayers(h, gamut);

  return (
    <div className="react-colorful__saturation">
      {layers.map((background, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: "inherit",
            background,
            maskImage: layerMask(i),
            WebkitMaskImage: layerMask(i),
          }}
        />
      ))}
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
