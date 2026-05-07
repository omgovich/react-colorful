import { useState, useEffect, useCallback, useRef } from "react";
import { ColorModel, AnyColor, HsvaColor } from "../types";
import { equalColorObjects } from "../utils/compare";
import { useEventCallback } from "./useEventCallback";

export function useColorManipulation<T extends AnyColor>(
  colorModel: ColorModel<T>,
  color: T,
  onChange?: (color: T) => void,
  onChangeEnd?: (color: T) => void
): [HsvaColor, (color: Partial<HsvaColor>) => void, () => void] {
  // Save onChange callback in the ref for avoiding "useCallback hell"
  const onChangeCallback = useEventCallback<T>(onChange);
  const onChangeEndCallback = useEventCallback<T>(onChangeEnd);

  // No matter which color model is used (HEX, RGB(A) or HSL(A)),
  // all internal calculations are based on HSVA model
  const [hsva, updateHsva] = useState<HsvaColor>(() => colorModel.toHsva(color));

  // By using this ref we're able to prevent extra updates
  // and the effects recursion during the color conversion
  const cache = useRef({ color, hsva });
  const isDirty = useRef(false);

  // Update local HSVA-value if `color` property value is changed,
  // but only if that's not the same color that we just sent to the parent
  useEffect(() => {
    if (!colorModel.equal(color, cache.current.color)) {
      const newHsva = colorModel.toHsva(color);
      cache.current = { hsva: newHsva, color };
      updateHsva(newHsva);
      isDirty.current = false;
    }
  }, [color, colorModel]);

  // Trigger `onChange` callback only if an updated color is different from cached one;
  // save the new color to the ref to prevent unnecessary updates
  useEffect(() => {
    let newColor;
    if (
      !equalColorObjects(hsva, cache.current.hsva) &&
      !colorModel.equal((newColor = colorModel.fromHsva(hsva)), cache.current.color)
    ) {
      cache.current = { hsva, color: newColor };
      onChangeCallback(newColor);
      isDirty.current = true;
    }
  }, [hsva, colorModel, onChangeCallback]);

  // Merge the current HSVA color object with updated params.
  // For example, when a child component sends `h` or `s` only
  const handleChange = useCallback((params: Partial<HsvaColor>) => {
    updateHsva((current) => Object.assign({}, current, params));
  }, []);

  const commitChange = useCallback(() => {
    if (isDirty.current) {
      isDirty.current = false;
      onChangeEndCallback(cache.current.color);
    }
  }, [onChangeEndCallback]);

  return [hsva, handleChange, commitChange];
}
