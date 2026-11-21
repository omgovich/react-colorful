import React, { useState, useEffect, useCallback } from "react";

import { useEventCallback } from "../../hooks/useEventCallback";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { ColorInputBaseProps } from "../../types";

interface Props extends ColorInputBaseProps {
  /** Blocks typing invalid characters and limits string length */
  escape: (value: string) => string;
  /** Checks that value is valid color string */
  validate: (value: string) => boolean;
  /** Processes value before displaying it in the input */
  format?: (value: string) => string;
  /** Processes value before sending it in `onChange` */
  process?: (value: string) => string;
}

export const ColorInput = (props: Props): React.ReactElement => {
  const { color = "", onChange, onBlur, escape, validate, format, process, ...rest } = props;
  const [value, setValue] = useState(() => escape(color));
  // A fresh tuple forces a render when escaping leaves the value unchanged and avoids stale selections
  const [selection, setSelection] = useState<[HTMLInputElement, number, number] | null>(null);
  const onChangeCallback = useEventCallback<string>(onChange);
  const onBlurCallback = useEventCallback<React.FocusEvent<HTMLInputElement>>(onBlur);

  // Trigger `onChange` handler only if the input value is a valid color
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const inputValue = escape(input.value);
      const { selectionStart, selectionEnd } = input;
      if (selectionStart !== null && selectionEnd !== null) {
        const getPosition = (position: number) => {
          const beforeCursor = escape(input.value.slice(0, position));
          return format ? format(beforeCursor).length : beforeCursor.length;
        };
        setSelection([input, getPosition(selectionStart), getPosition(selectionEnd)]);
      }
      setValue(inputValue);
      if (validate(inputValue)) onChangeCallback(process ? process(inputValue) : inputValue);
    },
    [escape, format, process, validate, onChangeCallback]
  );

  useIsomorphicLayoutEffect(() => {
    if (selection) selection[0].setSelectionRange(selection[1], selection[2]);
  }, [selection]);

  // Take the color from props if the last typed color (in local state) is not valid
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (!validate(e.target.value)) setValue(escape(color));
      onBlurCallback(e);
    },
    [color, escape, validate, onBlurCallback]
  );

  // Update the local state when `color` property value is changed
  useEffect(() => {
    setValue(escape(color));
  }, [color, escape]);

  return (
    <input
      {...rest}
      value={format ? format(value) : value}
      spellCheck="false" // the element should not be checked for spelling errors
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};
