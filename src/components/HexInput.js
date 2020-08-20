import React, { useState, useEffect, useCallback } from "react";
import validHex from "../utils/validHex";

// Escapes all non-hexadecimal characters including "#"
const escape = (hex) => hex.replace(/([^0-9A-F]+)/gi, "");

const HexInput = ({ color, onChange, ...rest }) => {
  const [value, setValue] = useState(escape(color));

  // Trigger `onChange` handler only if the input value is a valid HEX-color
  const handleChange = useCallback(
    (e) => {
      const inputValue = escape(e.target.value);
      setValue(inputValue);
      if (onChange && validHex(inputValue)) onChange("#" + inputValue);
    },
    [onChange]
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

  return (
    <input
      {...rest}
      value={value}
      maxLength={6}
      spellCheck="false"
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

HexInput.defaultProps = {
  color: "",
};

export default React.memo(HexInput);
