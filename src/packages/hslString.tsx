import React from "react";
import ColorPicker from "../components/ColorPicker";

import toHsv from "../utils/hslStringToHsv";
import fromHsv from "../utils/hsvToHslString";
import equal from "../utils/equalColorObjects";
import { BaseComponentProps } from "../types";

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
        toHsv,
        fromHsv,
        equal,
      }}
      color={props.color}
      onChange={props.onChange}
    />
  );
};

export default React.memo(HslString);
