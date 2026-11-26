import { useState, useEffect, useCallback, useRef } from "react";
import { ColorModel, AnyColor, HsvaColor, ObjectColor, OklchState } from "../types";
import { equalColorObjects } from "../utils/compare";
import { useEventCallback } from "./useEventCallback";

// `S` is the picker's internal state: HSVA for every picker but the OKLCH ones
export function useColorManipulation<
  T extends AnyColor,
  S extends ObjectColor | OklchState = HsvaColor
>(
  colorModel: ColorModel<T, S>,
  color: T,
  onChange?: (color: T) => void,
  onChangeEnd?: (color: T) => void
): [S, (color: Partial<S>) => void, () => void] {
  // Save onChange callback in the ref for avoiding "useCallback hell"
  const onChangeCallback = useEventCallback<T>(onChange);
  const onChangeEndCallback = useEventCallback<T>(onChangeEnd);

  // No matter which color model is used (HEX, RGB(A) or HSL(A)),
  // all internal calculations are based on HSVA model
  const [hsva, updateHsva] = useState<S>(() => colorModel.toHsva(color));

  // By using this ref we're able to prevent extra updates
  // and the effects recursion during the color conversion
  const cache = useRef({ color, hsva, colorModel });
  const isDirty = useRef(false);
  // The internal value as of the user's latest input, which `internal` only reaches on the next render
  const latest = useRef(internal);

  // Update local HSVA-value if `color` property value is changed,
  // but only if that's not the same color that we just sent to the parent.
  // A new color model (the gamut of an OKLCH picker) redraws the color with it
  useEffect(() => {
    if (cache.current.colorModel !== colorModel || !colorModel.equal(color, cache.current.color)) {
      const newHsva = colorModel.toHsva(color);
      cache.current = { hsva: newHsva, color, colorModel };
      updateHsva((latest.current = newHsva));
      isDirty.current = false;
    }
  }, [color, colorModel]);

  // Merge the current internal value with updated params.
  // For example, when a child component sends `h` or `s` only.
  // Trigger `onChange` callback only if an updated color is different from cached one;
  // save the new color to the ref to prevent unnecessary updates.
  // This runs in the event handler rather than in an effect: browsers can deliver the release
  // right after the last move, before React renders it, and `onChangeEnd` must send its color
  const handleChange = useCallback(
    (params: Partial<S>) => {
      const newHsva = (latest.current = Object.assign({}, latest.current, params));
      let newColor;
      updateInternal(newInternal);
      if (
        !equalColorObjects(newHsva as ObjectColor, cache.current.hsva as ObjectColor) &&
        !colorModel.equal((newColor = colorModel.fromHsva(newHsva)), cache.current.color)
      ) {
        cache.current = { hsva: newHsva, color: newColor, colorModel };
        isDirty.current = true;
        onChangeCallback(newColor);
      }
    },
    [colorModel, onChangeCallback]
  );

  const commitChange = useCallback(() => {
    if (isDirty.current) {
      isDirty.current = false;
      onChangeEndCallback(cache.current.color);
    }
  }, [onChangeEndCallback]);

  return [internal, handleChange, commitChange];
}
