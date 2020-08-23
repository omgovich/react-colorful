import React from "react";

import ColorPicker from "../components/ColorPicker";
import { BaseComponentProps, HSL } from "../types";
import { hslToHsv, hsvToHsl } from "../utils/conversions";
import equal from "../utils/equalColorObjects";

interface Props extends BaseComponentProps {
  className: string;
  color: HSL;
  onChange: (newColor: HSL) => void;
}

const Hsl: React.FC<Props> = (props) => {
  return (
    <ColorPicker
      className={props.className}
      colorModel={{
        defaultColor: { h: 0, s: 0, l: 0 },
        toHsv: hslToHsv,
        fromHsv: hsvToHsl,
        equal,
      }}
      color={props.color}
      onChange={props.onChange}
    />
  );
};

export default React.memo(Hsl);
