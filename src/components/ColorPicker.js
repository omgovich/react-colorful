import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Saturation from "./Saturation";
import Hue from "./Hue";
import { toHexString, toHsv, areSame } from "../utils";
import styles from "../styles.css";

const ColorPicker = ({ hex, onChange }) => {
  // Input and output formats are HEX,
  // but all internal calculations are based on HSV model
  const [hsv, updateHsv] = useState(() => toHsv(hex));

  // Convert updated HSV to HEX-format and send it to the parent component
  useEffect(() => {
    if (!areSame(hsv, hex)) onChange(toHexString(hsv));
  }, [hex, hsv, onChange]);

  // Merge the current HSV color with updated params.
  // For example when a child component sends `h` or `s` only
  const handleChange = useCallback(
    (params) => updateHsv((current) => Object.assign({}, current, params)),
    []
  );

  return (
    <div className={styles.container}>
      <Saturation hsv={hsv} onChange={handleChange} />
      <Hue hue={hsv.h} onChange={handleChange} />
    </div>
  );
};

ColorPicker.propTypes = {
  hex: PropTypes.string,
  onChange: PropTypes.func,
};

ColorPicker.defaultProps = {
  hex: "#000000",
  onChange: () => {},
};

export default React.memo(ColorPicker);
