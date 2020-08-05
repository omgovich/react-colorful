import React, { useCallback } from "react";
import Interactive from "./Interactive";
import { toHexString, formatClassName } from "../utils";
import styles from "../styles.css";

const Hue = ({ className, hue, onChange }) => {
  const handleMove = useCallback(
    (interaction) => {
      // Hue measured in degrees of the color circle ranging from 0 to 360
      onChange({ hue: 360 * interaction.left });
    },
    [onChange]
  );

  const pointerStyle = {
    top: "50%",
    left: `${(hue / 360) * 100}%`,
    backgroundColor: toHexString({ hue, sat: 100, val: 100 }),
  };

  const nodeClassName = formatClassName(["react-colorful__hue", styles.hue, className]);
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
