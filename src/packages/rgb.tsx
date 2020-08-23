import React from "react";

import ColorPicker from "../components/ColorPicker";
import { BaseComponentProps, RGB } from "../types";
import { rgbToHsv, hsvToRgb } from "../utils/conversions";
import equal from "../utils/equalColorObjects";

interface Props extends BaseComponentProps {
  className: string;
  color: RGB;
  onChange: (newColor: RGB) => void;
}

const Rgb: React.FC<Props> = (props) => {
  return (
    <ColorPicker
      className={props.className}
      colorModel={{
        defaultColor: { r: 0, g: 0, b: 0 },
        toHsv: rgbToHsv,
        fromHsv: hsvToRgb,
        equal,
      }}
      color={props.color}
      onChange={props.onChange}
    />
  );
};

export default React.memo(Rgb);
