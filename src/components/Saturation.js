import React, { useCallback } from "react";
import Interactive from "./Interactive";
import hsvToHex from "../utils/hsvToHex";
import formatClassName from "../utils/formatClassName";
import styles from "../styles.css";

const Saturation = ({ className, hsv, onChange }) => {
  const handleMove = useCallback(
    (interaction) => {
      // Saturation and brightness always fit into [0, 100] range
      const saturation = interaction.left * 100;
      const brightness = 100 - interaction.top * 100;
      onChange({ s: saturation, v: brightness });
    },
    [onChange]
  );

  const containerStyle = {
    backgroundColor: hsvToHex({ h: hsv.h, s: 100, v: 100 }),
  };

  const pointerStyle = {
    top: `${100 - hsv.v}%`,
    left: `${hsv.s}%`,
    backgroundColor: hsvToHex(hsv),
  };

  const nodeClassName = formatClassName([
    "react-colorful__saturation",
    styles.saturation,
    className,
  ]);
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
