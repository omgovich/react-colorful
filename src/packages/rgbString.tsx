import React from "react";

import ColorPicker from "../components/ColorPicker";
import { rgbStringToHsv, hsvToRgbString } from "../utils/conversions";
import equal from "../utils/equalColorObjects";
import { BaseComponentProps } from "../types";

interface Props extends BaseComponentProps {
  className: string;
  color: string;
  onChange: (newColor: string) => void;
}

const RgbString: React.FC<Props> = (props) => {
  return (
    <ColorPicker
      className={props.className}
      colorModel={{
        defaultColor: "rgb(0, 0, 0)",
        toHsv: rgbStringToHsv,
        fromHsv: hsvToRgbString,
        equal,
      }}
      color={props.color}
      onChange={props.onChange}
    />
  );
};

export default React.memo(RgbString);
