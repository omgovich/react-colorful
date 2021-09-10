import React, { useCallback } from "react";
import { ColorInputBaseProps } from "../types";
import { validRgbString } from "../utils/validate";
import { ColorInput } from "./common/ColorInput";

export const RgbStringColorInput = (props: ColorInputBaseProps): JSX.Element => {
  /** Prevents the typing of invalid characters */
  const escape = useCallback((value: string) => value.replace(/([^0-9\-%rgba(),./ ]+)/gi, ""), []);

  return <ColorInput {...props} escape={escape} validate={validRgbString} />;
};
