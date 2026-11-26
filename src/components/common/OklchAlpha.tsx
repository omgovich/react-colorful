import React from "react";

import { Interactive, Interaction } from "./Interactive";
import { Pointer } from "./Pointer";

import { OklchGamut, OklchState } from "../../types";
import { maxChroma, oklchString } from "../../utils/oklch";
import { clamp } from "../../utils/clamp";
import { round } from "../../utils/round";

interface Props {
  state: OklchState;
  gamut: OklchGamut;
  onChange: (newAlpha: { a: number }) => void;
  onChangeEnd?: () => void;
}

// The alpha slider of OKLCH pickers: from transparent to the current color
export const OklchAlpha = ({ state, gamut, onChange, onChangeEnd }: Props): React.ReactElement => {
  const { l, x, h, a } = state;
  const c = x * maxChroma(l, h, gamut);
  const ariaValue = round(a * 100);

  return (
    <div className="react-colorful__alpha react-colorful__last-control">
      <div
        className="react-colorful__alpha-gradient"
        style={{
          backgroundImage: `linear-gradient(90deg, ${oklchString(l, c, h, 0)}, ${oklchString(
            l,
            c,
            h
          )})`,
        }}
      />
      <Interactive
        onMove={(interaction: Interaction) => onChange({ a: interaction.left })}
        onKey={(offset: Interaction) => onChange({ a: clamp(a + offset.left) })}
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
