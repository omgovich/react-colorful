import React from "react";
import { ColorModel } from "../types";

const withColorModel = (
  Component: React.FC<any>,
  colorModel: ColorModel<any>
): React.MemoExoticComponent<React.FC> => {
  const ColorPicker = (props: any) => {
    return <Component {...props} colorModel={colorModel} />;
  };

  return React.memo(ColorPicker);
};

export default withColorModel;
