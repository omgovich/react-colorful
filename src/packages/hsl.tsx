import React from "react";
import ColorPicker from "../components/ColorPicker";

import toHsv from "../utils/hslToHsv";
import fromHsv from "../utils/hsvToHsl";
import equal from "../utils/equalColorObjects";
import { BaseComponentProps, HSL } from "../types";

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
        toHsv,
        fromHsv,
        equal,
      }}
      color={props.color}
      onChange={props.onChange}
    />
  );
};

export default React.memo(Hsl);
