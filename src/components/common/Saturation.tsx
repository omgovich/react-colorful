import React from "react";
import { Interactive, Interaction } from "./Interactive";
import { Pointer } from "./Pointer";
import { HsvaColor } from "../../types";
import { hsvaToHslString } from "../../utils/convert";
import { clamp } from "../../utils/clamp";
import { formatClassName } from "../../utils/format";
import styles from "../../css/styles.css";

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

  const nodeClassName = formatClassName(["react-colorful__saturation", styles.saturation]);

  return (
    <div className={nodeClassName} style={containerStyle}>
      <Interactive
        onMove={handleMove}
        onKey={handleKey}
        aria-label="Color"
        aria-valuetext={`Saturation ${Math.round(hsva.s)}%, Brightness ${Math.round(hsva.v)}%`}
      >
        <Pointer
          className="react-colorful__saturation-pointer"
          top={1 - hsva.v / 100}
          left={hsva.s / 100}
          color={hsvaToHslString(hsva)}
        />
      </Interactive>
    </div>
  );
};

export const Saturation = React.memo(SaturationBase);
