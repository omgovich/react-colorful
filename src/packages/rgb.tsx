import React from "react";
import ColorPicker from "../components/ColorPicker";

import toHsv from "../utils/rgbToHsv";
import fromHsv from "../utils/hsvToRgb";
import equal from "../utils/equalColorObjects";
import { BaseComponentProps, RGB } from "../types";

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
        toHsv,
        fromHsv,
        equal,
      }}
      color={props.color}
      onChange={props.onChange}
    />
  );
};

export default React.memo(Rgb);
