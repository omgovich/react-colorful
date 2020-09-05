import React, { useState, useEffect, useCallback, useRef } from "react";

import { Hue } from "./Hue";
import { Saturation } from "./Saturation";

import styles from "../../css/styles.css";
import { ColorModel, HSV, ColorPickerBaseProps, AnyColor } from "../../types";
import { useEventCallback } from "../../hooks/useEventCallback";
import { equalColorObjects } from "../../utils/compare";
import { formatClassName } from "../../utils/format";

interface Props<T extends AnyColor> extends Partial<ColorPickerBaseProps<T>> {
  colorModel: ColorModel<T>;
}

const ColorPickerBase = <T extends AnyColor>({
  className = "",
  colorModel,
  color = colorModel.defaultColor,
  onChange,
}: Props<T>) => {
  // Save onChange callback in the ref for avoiding "useCallback hell"
  const onChangeCallback = useEventCallback<T>(onChange);

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

  // Trigger `onChange` callback only if an updated color is different from cached one;
  // save the new color to the ref to prevent unnecessary updates
  useEffect(() => {
    let newColor;
    if (
      !equalColorObjects(hsv, cache.current.hsv) &&
      !colorModel.equal((newColor = colorModel.fromHsv(hsv)), cache.current.color)
    ) {
      cache.current = { hsv, color: newColor };
      onChangeCallback(newColor);
    }
  }, [hsv, colorModel, onChangeCallback]);

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

export const ColorPicker = React.memo(ColorPickerBase) as typeof ColorPickerBase;
