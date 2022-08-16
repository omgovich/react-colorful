import React, { useCallback } from "react";
import { ColorInputBaseProps } from "../types";

import { validHex } from "../utils/validate";
import { ColorInput } from "./common/ColorInput";

interface HexColorInputProps extends ColorInputBaseProps {
  /** Enables `#` prefix displaying */
  prefixed?: boolean;
  /** Allows `#rgba` and `#rrggbbaa` color formats */
  alpha?: boolean;
}

/** Adds "#" symbol to the beginning of the string */
const prefix = (value: string) => "#" + value;

export const HexColorInput = (props: HexColorInputProps): JSX.Element => {
  const { prefixed, alpha, ...rest } = props;

  /** Escapes all non-hexadecimal characters including "#" */
  const escape = useCallback(
    (value: string) => value.replace(/([^0-9A-F]+)/gi, "").substring(0, alpha ? 8 : 6),
    [alpha]
  );

  /** Validates hexadecimal strings */
  const validate = useCallback((value: string) => validHex(value, alpha), [alpha]);

  return (
    <ColorInput
      {...rest}
      escape={escape}
      format={prefixed ? prefix : undefined}
      process={prefix}
      validate={validate}
    />
  );
};
