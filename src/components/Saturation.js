import React, { useCallback } from "react";
import Interactive from "./Interactive";
import formatClassName from "../utils/formatClassName";
import styles from "../styles.css";
import hsvToHslString from "../utils/hsvToHslString";

const Saturation = ({ hsv, onChange }) => {
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
      <div className={pointerClassName} style={pointerStyle} />
      <Interactive onMove={handleMove} />
    </div>
  );
};

export default React.memo(Saturation);
