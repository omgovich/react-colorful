import React, { useCallback } from "react";

import { Interactive, Interaction } from "./Interactive";

import styles from "../../css/styles.css";
import { HsvaColor } from "../../types";
import { hsvaToHslString } from "../../utils/convert";
import { formatClassName } from "../../utils/format";

interface Props {
  hsva: HsvaColor;
  onChange: (newColor: { s: number; v: number }) => void;
}

const SaturationBase = ({ hsva, onChange }: Props) => {
  const handleMove = useCallback(
    (interaction: Interaction) => {
      // Saturation and brightness always fit into [0, 100] range
      onChange({
        s: interaction.left * 100,
        v: 100 - interaction.top * 100,
      });
    },
    [onChange]
  );

  const containerStyle = {
    backgroundColor: hsvaToHslString({ h: hsva.h, s: 100, v: 100, a: 1 }),
  };

  const pointerStyle = {
    top: `${100 - hsva.v}%`,
    left: `${hsva.s}%`,
    backgroundColor: hsvaToHslString(hsva),
  };

  const nodeClassName = formatClassName(["react-colorful__saturation", styles.saturation]);
  const pointerClassName = formatClassName(["react-colorful__saturation-pointer", styles.pointer]);

  return (
    <div className={nodeClassName} style={containerStyle}>
      <Interactive onMove={handleMove}>
        <div className={pointerClassName} style={pointerStyle} />
      </Interactive>
    </div>
  );
};

export const Saturation = React.memo(SaturationBase);
