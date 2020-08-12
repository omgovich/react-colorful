import React, { useState, useEffect, useCallback, useRef } from "react";
import Hue from "./Hue";
import Saturation from "./Saturation";
import formatClassName from "../utils/formatClassName";
import equalHsv from "../utils/equalHsv";
import HEX from "../colorModels/hex";
import styles from "../styles.css";

const ColorPicker = ({ className, color, colorModel, onChange }) => {
  // Input and output formats are HEX (#aabbcc),
  // but all internal calculations are based on HSV model
  const [hsv, updateHsv] = useState(() => colorModel.toHsv(color));

  // By using this ref we're able to prevent extra updates
  // and the effects recursion during the color conversion
  const cache = useRef({ color, hsv });

  // Update local HSV if `hex` property value is changed,
  // but only if it's not the same HEX-color that we just sent to the parent
  useEffect(() => {
    if (!colorModel.equal(color, cache.current.color)) {
      const newHsv = colorModel.toHsv(color);
      cache.current = { hsv: newHsv, color };
      updateHsv(newHsv);
    }
  }, [color, colorModel]);

  // If HSV is changed, convert it to the HEX-format, send to the parent component
  // and save the new HEX-color to the ref to prevent unnecessary updates
  useEffect(() => {
    if (!equalHsv(hsv, cache.current.hsv)) {
      const newColor = colorModel.fromHsv(hsv);
      cache.current = { hsv, color: newColor };
      onChange(newColor);
    }
  }, [hsv, colorModel, onChange]);

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
  color: "#ABC",
  colorModel: HEX,
  onChange: () => {},
};

export default React.memo(ColorPicker);
