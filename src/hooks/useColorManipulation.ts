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
  const cache = useRef({ color, internal, colorModel });
  const isDirty = useRef(false);
  // The internal value as of the user's latest input, which `internal` only reaches on the next render
  const latest = useRef(internal);

  // The `color` prop as of the last render: tells a new prop from a new color model
  const prop = useRef(color);

  useEffect(() => {
    if (!colorModel.equal(color, cache.current.color)) {
      const newHsva = colorModel.toHsva(color);
      cache.current = { hsva: newHsva, color };
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
        cache.current = { internal: newInternal, color: newColor, colorModel };
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
