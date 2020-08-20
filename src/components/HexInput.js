import React, { useState, useEffect, useCallback } from "react";
import validHex from "../utils/validHex";

const escape = (hex) => hex.replace(/([^0-9A-F]+)/gi, "");

const HexInput = ({ color, onChange, ...rest }) => {
  const [value, setValue] = useState(escape(color));

  const handleChange = useCallback(
    (e) => {
      const inputValue = escape(e.target.value);
      setValue(inputValue);
      if (onChange && validHex(inputValue)) onChange("#" + inputValue);
    },
    [onChange]
  );

  const handleBlur = useCallback(
    (e) => {
      if (!validHex(e.target.value)) setValue(escape(color));
    },
    [color]
  );

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
