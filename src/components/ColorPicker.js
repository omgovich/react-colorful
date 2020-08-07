import React, { useState, useEffect, useCallback, useRef } from "react";
import Hue from "./Hue";
import Saturation from "./Saturation";
import formatClassName from "../utils/formatClassName";
import hsvToHex from "../utils/hsvToHex";
import hexToHsv from "../utils/hexToHsv";
import styles from "../styles.css";

const ColorPicker = ({ className, hex, onChange }) => {
  // Input and output formats are HEX (#aabbcc),
  // but all internal calculations are based on HSV model
  const [hsv, updateHsv] = useState(() => hexToHsv(hex));

  // By using this ref we're able to prevent extra updates
  // and the effects recursion during the color conversion
  const sourceHexRef = useRef(hex);

  // Update local HSV if `hex` property value is changed,
  // but only if it's not the same HEX-color that we just sent to the parent
  useEffect(() => {
    if (hex !== sourceHexRef.current) updateHsv(hexToHsv(hex));
  }, [hex]);

  // Convert updated HSV to HEX-format, send it to the parent component
  // and save the new HEX-color to the ref to prevent an unnecessary update
  useEffect(() => {
    const newHex = hsvToHex(hsv);
    sourceHexRef.current = newHex;
    onChange(newHex);
  }, [hsv, onChange]);

  // Merge the current HSV color object with updated params.
  // For example, when a child component sends `hue` or `sat` only
  const handleChange = useCallback((params) => {
    updateHsv((current) => Object.assign({}, current, params));
  }, []);

  const nodeClassName = formatClassName(["react-colorful", styles.container, className]);

  return (
    <div className={nodeClassName}>
      <Saturation hsv={hsv} onChange={handleChange} />
      <Hue hue={hsv.h} onChange={handleChange} />
    </div>
  );
};

ColorPicker.defaultProps = {
  hex: "#000000",
  onChange: () => {},
};

export default React.memo(ColorPicker);
