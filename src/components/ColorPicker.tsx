import React, { useState, useEffect, useCallback, useRef } from "react";

import Hue from "./Hue";
import Saturation from "./Saturation";

import styles from "../styles.css";
import { ColorModel, AnyColor, HSV } from "../types";
import { equalColorObjects } from "../utils/compare";
import formatClassName from "../utils/formatClassName";

interface Props {
  className: string;
  colorModel: ColorModel<AnyColor>;
  color: AnyColor;
  onChange: (newColor: AnyColor) => void;
}

const ColorPicker: React.FC<Props> = ({
  className,
  colorModel,
  color = colorModel.defaultColor,
  onChange,
}: Props) => {
  // No matter which color model is used (HEX, RGB or HSL),
  // all internal calculations are based on HSV model
  const [hsv, updateHsv] = useState<HSV>(() => colorModel.toHsv(color));

  // By using this ref we're able to prevent extra updates
  // and the effects recursion during the color conversion
  const cache = useRef({ color, hsv });

  // Update local HSV if `color` property value is changed,
  // but only if that's not the same color that we just sent to the parent
  useEffect(() => {
    if (!colorModel.equal(color, cache.current.color)) {
      const newHsv = colorModel.toHsv(color);
      cache.current = { hsv: newHsv, color };
      updateHsv(newHsv);
    }
  }, [color, colorModel]);

  // If HSV is changed, convert it to the output format, send to the parent component
  // and save the new color to the ref to prevent unnecessary updates
  useEffect(() => {
    if (!equalColorObjects(hsv, cache.current.hsv)) {
      const newColor = colorModel.fromHsv(hsv);
      cache.current = { hsv, color: newColor };
      if (onChange) onChange(newColor);
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

export default ColorPicker;
