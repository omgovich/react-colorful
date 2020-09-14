import React, { useCallback } from "react";

import { Interactive, Interaction } from "./Interactive";
import { hsvaToHslaString } from "../../utils/convert";
import { formatClassName } from "../../utils/format";
import { HsvaColor } from "../../types";
import styles from "../../css/styles.css";

interface Props {
  className?: string;
  hsva: HsvaColor;
  onChange: (newAlpha: { a: number }) => void;
}

export const Alpha = ({ className, hsva, onChange }: Props): JSX.Element => {
  const handleMove = useCallback(
    (interaction: Interaction) => {
      // Alpha always fit into [0, 1] range
      onChange({ a: interaction.left });
    },
    [onChange]
  );

  const colorFrom = hsvaToHslaString({ ...hsva, a: 0 });
  const colorTo = hsvaToHslaString({ ...hsva, a: 1 });

  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colorFrom}, ${colorTo}`,
  };

  const pointerStyle = {
    top: "50%",
    left: `${hsva.a * 100}%`,
    color: hsvaToHslaString(hsva),
  };

  const nodeClassName = formatClassName(["react-colorful__alpha", styles.alpha, className]);
  const pointerClassName = formatClassName(["react-colorful__alpha-pointer", styles.pointer]);

  return (
    <div className={nodeClassName}>
      <div className={styles.alphaGradient} style={gradientStyle} />
      <Interactive onMove={handleMove}>
        <div className={pointerClassName} style={pointerStyle} />
      </Interactive>
    </div>
  );
};
