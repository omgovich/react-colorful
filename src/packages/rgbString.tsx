import React from "react";
import ColorPicker from "../components/ColorPicker";

import toHsv from "../utils/rgbStringToHsv";
import fromHsv from "../utils/hsvToRgbString";
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
        toHsv,
        fromHsv,
        equal,
      }}
      color={props.color}
      onChange={props.onChange}
    />
  );
};

export default React.memo(RgbString);
