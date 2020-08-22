import React from "react";
import ColorPicker from "../components/ColorPicker";

import toHsv from "../utils/hexToHsv";
import fromHsv from "../utils/hsvToHex";
import equal from "../utils/equalHex";
import { BaseComponentProps } from "../types";

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
        toHsv,
        fromHsv,
        equal,
      }}
      color={props.color}
      onChange={props.onChange}
    />
  );
};

export default React.memo(Hex);
