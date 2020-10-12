import React from "react";
import { formatClassName } from "../../utils/format";

import styles from "../../css/styles.css";

interface Props {
  className?: string;
  top?: number;
  left: number;
  color: string;
}

export const Pointer = ({ className, color, left, top = 0.5 }: Props): JSX.Element => {
  const nodeClassName = formatClassName([className, styles.pointer]);

  const style = {
    top: `${top * 100}%`,
    left: `${left * 100}%`,
  };

  return (
    <div className={nodeClassName} style={style}>
      <div className={styles.pointerFill} style={{ backgroundColor: color }} />
    </div>
  );
};
