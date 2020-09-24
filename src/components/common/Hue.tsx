import React from "react";

import { Interactive, Interaction } from "./Interactive";

import { hsvaToHslaString } from "../../utils/convert";
import { formatClassName } from "../../utils/format";
import { limit } from "../../utils/limit";

import styles from "../../css/styles.css";

interface Props {
  className?: string;
  hue: number;
  onChange: (newHue: { h: number }) => void;
}

const HueBase = ({ className, hue, onChange }: Props) => {
  // Hue measured in degrees of the color circle ranging from 0 to 360
  const handleMove = (interaction: Interaction) => {
    onChange({ h: 360 * interaction.left });
  };

  const handleKey = (offset: Interaction) => {
    onChange({
      h: limit(hue + offset.left * 360, 0, 360),
    });
  };

  const pointerStyle = {
    top: "50%",
    left: `${(hue / 360) * 100}%`,
    color: hsvaToHslaString({ h: hue, s: 100, v: 100, a: 1 }),
  };

  const nodeClassName = formatClassName(["react-colorful__hue", styles.hue, className]);
  const pointerClassName = formatClassName(["react-colorful__hue-pointer", styles.pointer]);

  return (
    <div className={nodeClassName}>
      <Interactive
        onMove={handleMove}
        onKey={handleKey}
        aria-label="Hue"
        aria-valuetext={Math.round(hue)}
      >
        <div className={pointerClassName} style={pointerStyle} />
      </Interactive>
    </div>
  );
};

export const Hue = React.memo(HueBase);
