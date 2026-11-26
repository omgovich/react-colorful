import { useState, useEffect, useCallback, useRef } from "react";
import { ColorModel, AnyColor, HsvaColor, InternalColor } from "../types";
import { equalColorObjects } from "../utils/compare";
import { useEventCallback } from "./useEventCallback";

// `I` is the picker's internal representation of the color, HSVA by default
export function useColorManipulation<T extends AnyColor, I extends InternalColor = HsvaColor>(
  colorModel: ColorModel<T, I>,
  color: T,
  onChange?: (color: T) => void,
  onChangeEnd?: (color: T) => void
): [I, (color: Partial<I>) => void, () => void] {
  // Save onChange callback in the ref for avoiding "useCallback hell"
  const onChangeCallback = useEventCallback<T>(onChange);
  const onChangeEndCallback = useEventCallback<T>(onChangeEnd);

  // No matter which color format the picker takes (HEX, RGB(A), HSL(A), …),
  // all internal calculations work on its internal representation (HSVA by default)
  const [internal, updateInternal] = useState<I>(() => colorModel.toInternal(color));

  // By using this ref we're able to prevent extra updates
  // and the effects recursion during the color conversion
  const cache = useRef({ color, internal, colorModel });
  const isDirty = useRef(false);
  // The internal value as of the user's latest input, which `internal` only reaches on the next render
  const latest = useRef(internal);

  // Update the internal value if `color` property value is changed,
  // but only if that's not the same color that we just sent to the parent.
  // A new color model redraws the color with it
  useEffect(() => {
    if (cache.current.colorModel !== colorModel || !colorModel.equal(color, cache.current.color)) {
      const newInternal = colorModel.toInternal(color);
      cache.current = { internal: newInternal, color, colorModel };
      updateInternal((latest.current = newInternal));
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
    (params: Partial<I>) => {
      const newInternal = (latest.current = Object.assign({}, latest.current, params));
      let newColor;
      updateInternal(newInternal);
      if (
        !equalColorObjects(newInternal, cache.current.internal) &&
        !colorModel.equal((newColor = colorModel.fromInternal(newInternal)), cache.current.color)
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
