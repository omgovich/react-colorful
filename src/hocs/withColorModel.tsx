import React from "react";

import { ColorModel, ColorPickerBaseProps } from "../types";

const withColorModel = (
  Component: React.FC<any>,
  colorModel: ColorModel<any>
): React.NamedExoticComponent<any> => {
  const ColorPicker = (props: ColorPickerBaseProps) => {
    return <Component {...props} colorModel={colorModel} />;
  };

  return React.memo(ColorPicker);
};

export default withColorModel;
