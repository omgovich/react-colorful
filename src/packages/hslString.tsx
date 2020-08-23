import React from "react";

import ColorPicker from "../components/ColorPicker";
import { BaseComponentProps } from "../types";
import { hslStringToHsv, hsvToHslString } from "../utils/conversions";
import equal from "../utils/equalColorObjects";

interface Props extends BaseComponentProps {
  className: string;
  color: string;
  onChange: (newColor: string) => void;
}

const HslString: React.FC<Props> = (props) => {
  return (
    <ColorPicker
      className={props.className}
      colorModel={{
        defaultColor: "hsl(0, 0%, 0%)",
        toHsv: hslStringToHsv,
        fromHsv: hsvToHslString,
        equal,
      }}
      color={props.color}
      onChange={props.onChange}
    />
  );
};

export default React.memo(HslString);
