import React from "react";

import { Interactive, Interaction } from "./Interactive";
import { Pointer } from "./Pointer";

import { OklchGamut } from "../../types";
import { hueColor, hueGradient } from "../../utils/oklchGradients";
import { oklchString } from "../../utils/oklch";
import { formatClassName } from "../../utils/format";
import { clamp } from "../../utils/clamp";
import { round } from "../../utils/round";

interface Props {
  className?: string;
  hue: number;
  gamut: OklchGamut;
  onChange: (newHue: { h: number }) => void;
  onChangeEnd?: () => void;
}

// The hue slider of OKLCH pickers: a vivid color of every OKLCH hue, see `hueColor`
// No `React.memo`: a top-level call would stay in the bundle of every other picker
export const OklchHue = ({
  className,
  hue,
  gamut,
  onChange,
  onChangeEnd,
}: Props): React.ReactElement => {
  const handleMove = (interaction: Interaction) => {
    onChange({ h: 360 * interaction.left });
  };

  const handleKey = (offset: Interaction) => {
    onChange({ h: clamp(hue + offset.left * 360, 0, 360) });
  };

  const [l, c] = hueColor(hue, gamut);

  return (
    <div
      className={formatClassName(["react-colorful__hue", className])}
      style={{ background: hueGradient(gamut) }}
    >
      <Interactive
        onMove={handleMove}
        onKey={handleKey}
        onEnd={onChangeEnd}
        aria-label="Hue"
        aria-valuenow={round(hue)}
        aria-valuemax="360"
        aria-valuemin="0"
      >
        <Pointer
          className="react-colorful__hue-pointer"
          left={hue / 360}
          color={oklchString(l, c, hue)}
        />
      </Interactive>
    </div>
  );
};
