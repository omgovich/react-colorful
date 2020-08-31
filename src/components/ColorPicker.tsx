import React, { useState, useEffect, useCallback, useRef } from "react";

import Hue from "./Hue";
import Saturation from "./Saturation";

import styles from "../styles.css";
import { ColorModel, HSV, ColorPickerBaseProps, AnyColor } from "../types";
import formatClassName from "../utils/formatClassName";

interface Props<T extends AnyColor> extends Partial<ColorPickerBaseProps<T>> {
  colorModel: ColorModel<T>;
}

const ColorPicker = <T extends AnyColor>({
  className = "",
  colorModel,
  color = colorModel.defaultColor,
  onChange,
}: Props<T>) => {
  // No matter which color model is used (HEX, RGB or HSL),
  // all internal calculations are based on HSV model
  const [hsv, updateHsv] = useState<HSV>(() => colorModel.toHsv(color));

  // By using this ref we're able to prevent extra updates
  // and the effects recursion during the color conversion
  const cache = useRef(color);

  // Update local HSV if `color` property value is changed,
  // but only if that's not the same color that we just sent to the parent
  useEffect(() => {
    if (!colorModel.equal(color, cache.current)) {
      const newHsv = colorModel.toHsv(color);
      cache.current = color;
      updateHsv(newHsv);
    }
  }, [color, colorModel]);

  // Сonvert HSV to the output format, if it is changed send to the parent component
  // and save the new color to the ref to prevent unnecessary updates
  useEffect(() => {
    const newColor = colorModel.fromHsv(hsv);
    if (!colorModel.equal(newColor, cache.current)) {
      cache.current = newColor;
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

export default React.memo(ColorPicker) as typeof ColorPicker;
