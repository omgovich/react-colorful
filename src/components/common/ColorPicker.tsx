import React from "react";

import { Hue } from "./Hue";
import { Saturation } from "./Saturation";

import styles from "../../css/styles.css";
import { ColorModel, ColorPickerBaseProps, AnyColor } from "../../types";
import { useColorManipulation } from "../../hooks/useColorManipulation";
import { formatClassName } from "../../utils/format";

interface Props<T extends AnyColor> extends Partial<ColorPickerBaseProps<T>> {
  colorModel: ColorModel<T>;
}

const ColorPickerBase = <T extends AnyColor>({
  className = "",
  colorModel,
  color = colorModel.defaultColor,
  onChange,
}: Props<T>) => {
  const [hsva, updateHsva] = useColorManipulation<T>({ color, colorModel, onChange });

  const nodeClassName = formatClassName(["react-colorful", styles.container, className]);

  return (
    <div className={nodeClassName}>
      <Saturation hsva={hsva} onChange={updateHsva} />
      <Hue hue={hsva.h} onChange={updateHsva} />
    </div>
  );
};

export const ColorPicker = React.memo(ColorPickerBase) as typeof ColorPickerBase;
