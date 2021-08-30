import React, { useCallback } from "react";
import { ColorInputBaseProps } from "../types";

import { validHex } from "../utils/validate";
import { ColorInput } from "./common/ColorInput";

interface HexColorPickerProps extends ColorInputBaseProps {
  /** Enable "#" prefix displaying */
  prefixed?: boolean;
  /** Enable "#rrggbbaa" and "#rgba" notations */
  alpha?: boolean;
}

/** Adds "#" symbol to the beginning of the string */
const prefix = (value: string) => "#" + value;

export const HexColorInput = (props: HexColorPickerProps): JSX.Element => {
  const { prefixed, alpha, ...rest } = props;

  /** Escapes all non-hexadecimal characters including "#" */
  const escape = useCallback(
    (value: string) => value.replace(/([^0-9A-F]+)/gi, "").substr(0, alpha ? 8 : 6),
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
