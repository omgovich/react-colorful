import React from "react";

import { Interactive, Interaction } from "./Interactive";
import { Pointer } from "./Pointer";

import { OklchGamut, OklchInternal } from "../../types";
import { maxChroma } from "../../utils/oklchGamut";
import { oklchString } from "../../utils/oklch";
import { clamp } from "../../utils/clamp";
import { round } from "../../utils/round";

interface Props {
  internal: OklchInternal;
  gamut: OklchGamut;
  onChange: (newAlpha: { a: number }) => void;
  onChangeEnd?: () => void;
}

// The alpha slider of OKLCH pickers: from transparent to the current color
// No `React.memo`: a top-level call would stay in the bundle of every other picker
export const OklchAlpha = ({
  internal,
  gamut,
  onChange,
  onChangeEnd,
}: Props): React.ReactElement => {
  const { l, x, h, a } = internal;

  const handleMove = (interaction: Interaction) => {
    onChange({ a: interaction.left });
  };

  const handleKey = (offset: Interaction) => {
    onChange({ a: clamp(a + offset.left) });
  };

  const c = x * maxChroma(l, h, gamut);
  const gradient = `linear-gradient(90deg, ${oklchString(l, c, h, 0)}, ${oklchString(l, c, h)})`;

  const ariaValue = round(a * 100);

  return (
    <div className="react-colorful__alpha react-colorful__last-control">
      <div className="react-colorful__alpha-gradient" style={{ backgroundImage: gradient }} />
      <Interactive
        onMove={handleMove}
        onKey={handleKey}
        onEnd={onChangeEnd}
        aria-label="Alpha"
        aria-valuetext={`${ariaValue}%`}
        aria-valuenow={ariaValue}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <Pointer
          className="react-colorful__alpha-pointer"
          left={a}
          color={oklchString(l, c, h, a)}
        />
      </Interactive>
    </div>
  );
};
