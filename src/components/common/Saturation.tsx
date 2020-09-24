import React from "react";
import { Interactive, Interaction } from "./Interactive";
import { HsvaColor } from "../../types";
import { hsvaToHslaString } from "../../utils/convert";
import { limit } from "../../utils/limit";
import { formatClassName } from "../../utils/format";
import styles from "../../css/styles.css";

interface Props {
  hsva: HsvaColor;
  onChange: (newColor: { s: number; v: number }) => void;
}

const SaturationBase = ({ hsva, onChange }: Props) => {
  // Saturation and brightness always fit into [0, 100] range
  const handleMove = (interaction: Interaction) => {
    onChange({
      s: interaction.left * 100,
      v: 100 - interaction.top * 100,
    });
  };

  const handleKey = (offset: Interaction) => {
    onChange({
      s: limit(hsva.s + offset.left * 100, 0, 100),
      v: limit(hsva.v - offset.top * 100, 0, 100),
    });
  };

  const containerStyle = {
    backgroundColor: hsvaToHslaString({ h: hsva.h, s: 100, v: 100, a: 1 }),
  };

  const pointerStyle = {
    top: `${100 - hsva.v}%`,
    left: `${hsva.s}%`,
    color: hsvaToHslaString(hsva),
  };

  const nodeClassName = formatClassName(["react-colorful__saturation", styles.saturation]);
  const pointerClassName = formatClassName(["react-colorful__saturation-pointer", styles.pointer]);

  return (
    <div className={nodeClassName} style={containerStyle}>
      <Interactive
        onMove={handleMove}
        onKey={handleKey}
        aria-label="Color"
        aria-valuetext={`Saturation ${Math.round(hsva.s)}%, Brightness ${Math.round(hsva.v)}%`}
      >
        <div className={pointerClassName} style={pointerStyle} />
      </Interactive>
    </div>
  );
};

export const Saturation = React.memo(SaturationBase);
