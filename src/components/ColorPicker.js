import React, { useState, useEffect, useCallback } from "react";
import Hue from "./Hue";
import Saturation from "./Saturation";
import { hsvToHex, hexToHsv, formatClassName } from "../utils";
import styles from "../styles.css";

const ColorPicker = ({ className, hex, onChange }) => {
  // Input and output formats are HEX (#AAAAAA),
  // but all internal calculations are based on HSV model
  const [hsv, updateHsv] = useState(() => hexToHsv(hex));

  // Convert updated HSV to HEX-format and send it to the parent component
  useEffect(() => {
    onChange(hsvToHex(hsv));
  }, [hsv, onChange]);

  // Merge the current HSV color object with updated params.
  // For example, when a child component sends `hue` or `sat` only
  const handleChange = useCallback(
    (params) => updateHsv((current) => Object.assign({}, current, params)),
    []
  );

  const nodeClassName = formatClassName(["react-colorful", styles.container, className]);

  return (
    <div className={nodeClassName}>
      <Saturation hsv={hsv} onChange={handleChange} />
      <Hue hue={hsv.hue} onChange={handleChange} />
    </div>
  );
};

ColorPicker.defaultProps = {
  hex: "#000000",
  onChange: () => {},
};

export default React.memo(ColorPicker);
