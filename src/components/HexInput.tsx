import React, { useState, useEffect, useCallback } from "react";

import { useEventCallback } from "../hooks/useEventCallback";

import { validHex } from "../utils/validate";

// Escapes all non-hexadecimal characters including "#"
const escape = (hex: string) => hex.replace(/([^0-9A-F]+)/gi, "");

interface Props extends HTMLInputElement {
  color: string;
  onChange: (newColor: string) => void;
}

const HexInput = (props: Partial<Props>) => {
  const { color = "", onChange } = props;
  const [value, setValue] = useState(() => escape(color));
  const onChangeCallback = useEventCallback<string>(onChange);

  // Trigger `onChange` handler only if the input value is a valid HEX-color
  const handleChange = useCallback(
    (e) => {
      const inputValue = escape(e.target.value);
      setValue(inputValue);
      if (validHex(inputValue)) onChangeCallback("#" + inputValue);
    },
    [onChangeCallback]
  );

  // Take the color from props if the last typed color (in local state) is not valid
  const handleBlur = useCallback(
    (e) => {
      if (!validHex(e.target.value)) setValue(escape(color));
    },
    [color]
  );

  // Update the local state when `color` property value is changed
  useEffect(() => {
    setValue(escape(color));
  }, [color]);

  // Spread operator replacement to get rid of the polyfill (saves 150 bytes gzipped)
  const inputProps = Object.assign({}, props, {
    color: null, // do not add `color` attr to `input`-tag
    value,
    maxLength: 6,
    spellCheck: "false", // the element should not be checked for spelling errors
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return React.createElement("input", inputProps);
};

export default React.memo(HexInput);
