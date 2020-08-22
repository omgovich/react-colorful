import React from "react";
import ColorPicker from "../components/ColorPicker";

import equal from "../utils/equalColorObjects";
import { BaseComponentProps, HSV } from "../types";

interface Props extends BaseComponentProps {
  className: string;
  color: HSV;
  onChange: (newColor: HSV) => void;
}

const Hsv: React.FC<Props> = (props) => {
  return (
    <ColorPicker
      className={props.className}
      colorModel={{
        defaultColor: { h: 0, s: 0, v: 0 },
        toHsv: (hsv) => hsv,
        fromHsv: (hsv) => hsv,
        equal,
      }}
      color={props.color}
      onChange={props.onChange}
    />
  );
};

export default React.memo(Hsv);
