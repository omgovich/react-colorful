import React, { useState, useEffect, useCallback, useRef } from "react";
import Hue from "./Hue";
import Saturation from "./Saturation";
import formatClassName from "../utils/formatClassName";
import hsvToHex from "../utils/hsvToHex";
import hexToHsv from "../utils/hexToHsv";
import equalHex from "../utils/equalHex";
import equalHsv from "../utils/equalHsv";
import styles from "../styles.css";

const ColorPicker = ({ className, hex, onChange }) => {
  // Input and output formats are HEX (#aabbcc),
  // but all internal calculations are based on HSV model
  const [hsv, updateHsv] = useState(() => hexToHsv(hex));

  // By using this ref we're able to prevent extra updates
  // and the effects recursion during the color conversion
  const colorCache = useRef({ hex, hsv });

  // Update local HSV if `hex` property value is changed,
  // but only if it's not the same HEX-color that we just sent to the parent
  useEffect(() => {
    if (!equalHex(hex, colorCache.current.hex)) {
      const newHsv = hexToHsv(hex);
      colorCache.current = { hsv: newHsv, hex };
      updateHsv(newHsv);
    }
  }, [hex]);

  // If HSV is changed, convert it to the HEX-format, send to the parent component
  // and save the new HEX-color to the ref to prevent unnecessary updates
  useEffect(() => {
    if (!equalHsv(hsv, colorCache.current.hsv)) {
      const newHex = hsvToHex(hsv);
      colorCache.current = { hsv, hex: newHex };
      onChange(newHex);
    }
  }, [hsv, onChange]);

  // Merge the current HSV color object with updated params.
  // For example, when a child component sends `h` or `s` only
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
  hex: "#ABC",
  onChange: () => {},
};

export default React.memo(ColorPicker);
