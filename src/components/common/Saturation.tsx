import React, { useCallback } from "react";

import Interactive from "./Interactive";

import styles from "../../css/styles.css";
import { HSV } from "../../types";
import { hsvToHslString } from "../../utils/convert";
import { formatClassName } from "../../utils/format";

interface Props {
  hsv: HSV;
  onChange: (newColor: { s: number; v: number }) => void;
}

const Saturation = ({ hsv, onChange }: Props) => {
  const handleMove = useCallback(
    (interaction) => {
      // Saturation and brightness always fit into [0, 100] range
      onChange({
        s: interaction.left * 100,
        v: 100 - interaction.top * 100,
      });
    },
    [onChange]
  );

  const containerStyle = {
    backgroundColor: hsvToHslString({ h: hsv.h, s: 100, v: 100 }),
  };

  const pointerStyle = {
    top: `${100 - hsv.v}%`,
    left: `${hsv.s}%`,
    backgroundColor: hsvToHslString(hsv),
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

export default React.memo(Saturation);
