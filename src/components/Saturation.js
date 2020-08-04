import React, { useCallback } from "react";
import Interactive from "./Interactive";
import { toHexString, formatClassName } from "../utils";
import styles from "../styles.css";

const Saturation = ({ className, hsv, onChange }) => {
  const handleMove = useCallback(
    (interaction) => {
      // Saturation and brightness always fit into [0, 1] range
      const saturation = interaction.left;
      const brightness = 1 - interaction.top;
      onChange({ s: saturation, v: brightness });
    },
    [onChange]
  );

  const containerStyle = {
    backgroundColor: toHexString({ h: hsv.h, s: 1, l: 0.5 }),
  };

  const pointerStyle = {
    top: `${100 - hsv.v * 100}%`,
    left: `${hsv.s * 100}%`,
    backgroundColor: toHexString(hsv),
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
