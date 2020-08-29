import React, { useCallback } from "react";

import Interactive, { Interaction } from "./Interactive";

import styles from "../styles.css";
import { hsvToHslString } from "../utils/convert";
import formatClassName from "../utils/formatClassName";

interface Props {
  hue: number;
  onChange: (newHue: { h: number }) => void;
}

const Hue = ({ hue, onChange }: Props) => {
  const handleMove = useCallback(
    (interaction: Interaction) => {
      // Hue measured in degrees of the color circle ranging from 0 to 360
      onChange({ h: 360 * interaction.left });
    },
    [onChange]
  );

  const pointerStyle = {
    top: "50%",
    left: `${(hue / 360) * 100}%`,
    backgroundColor: hsvToHslString({ h: hue, s: 100, v: 100 }),
  };

  const nodeClassName = formatClassName(["react-colorful__hue", styles.hue]);
  const pointerClassName = formatClassName(["react-colorful__hue-pointer", styles.pointer]);

  return (
    <div className={nodeClassName}>
      <Interactive onMove={handleMove}>
        <div className={pointerClassName} style={pointerStyle} />
      </Interactive>
    </div>
  );
};

export default React.memo(Hue);
