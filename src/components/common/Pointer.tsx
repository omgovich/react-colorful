import React from "react";
import { formatClassName } from "../../utils/format";

interface Props {
  className?: string;
  top?: number;
  left: number;
  color: string;
}

export const Pointer = ({ className, color, left, top = 0.5 }: Props): JSX.Element => {
  const nodeClassName = formatClassName(["react-colorful__pointer", className]);

  const style = {
    top: `${top * 100}%`,
    left: `${left * 100}%`,
  };

  return (
    <div className={nodeClassName} style={style}>
      <div className="react-colorful__pointer-fill" style={{ backgroundColor: color }} />
    </div>
  );
};
