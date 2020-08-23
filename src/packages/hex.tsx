import React from "react";

import ColorPicker from "../components/ColorPicker";
import { BaseComponentProps } from "../types";
import { hexToHsv, hsvToHex } from "../utils/conversions";
import equal from "../utils/equalHex";

interface Props extends BaseComponentProps {
  className: string;
  color: string;
  onChange: (newColor: string) => void;
}

const Hex: React.FC<Props> = (props) => {
  return (
    <ColorPicker
      className={props.className}
      colorModel={{
        defaultColor: "000",
        toHsv: hexToHsv,
        fromHsv: hsvToHex,
        equal,
      }}
      color={props.color}
      onChange={props.onChange}
    />
  );
};

export default React.memo(Hex);