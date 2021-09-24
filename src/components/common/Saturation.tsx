import React from "react";
import { Interactive, Interaction } from "./Interactive";
import { Pointer } from "./Pointer";
import { HsvaColor } from "../../types";
import { hsvaToHslString } from "../../utils/convert";
import { clamp } from "../../utils/clamp";
import { round } from "../../utils/round";

interface Props {
  hsva: HsvaColor;
  onChange: (newColor: { s: number; v: number }) => void;
}

const SaturationBase = ({ hsva, onChange }: Props) => {
  const handleMove = (interaction: Interaction) => {
    onChange({
      s: interaction.left * 100,
      v: 100 - interaction.top * 100,
    });
  };

  const handleKey = (offset: Interaction) => {
    // Saturation and brightness always fit into [0, 100] range
    onChange({
      s: clamp(hsva.s + offset.left * 100, 0, 100),
      v: clamp(hsva.v - offset.top * 100, 0, 100),
    });
  };

  const containerStyle = {
    backgroundColor: hsvaToHslString({ h: hsva.h, s: 100, v: 100, a: 1 }),
  };

  return (
    <div className="react-colorful__saturation" style={containerStyle}>
      <div role="grid" aria-rowcount={100} aria-label="Saturation and Brightness">
        <div role="row" aria-rowindex={round(hsva.v)} aria-label={`Brightness ${round(hsva.v)}%`}>
          <Interactive
            onMove={handleMove}
            onKey={handleKey}
            role="gridcell"
            aria-colcount={100}
            aria-colindex={round(hsva.s)}
            aria-label={`Saturation ${round(hsva.s)}%`}
          >
            <Pointer
              className="react-colorful__saturation-pointer"
              top={1 - hsva.v / 100}
              left={hsva.s / 100}
              color={hsvaToHslString(hsva)}
            />
          </Interactive>
        </div>
      </div>
    </div>
  );
};

export const Saturation = React.memo(SaturationBase);
