import React, { useRef } from "react";

import { Hue } from "./Hue";
import { Saturation } from "./Saturation";

import { ColorModel, ColorPickerBaseProps, AnyColor } from "../../types";
import { useColorManipulation } from "../../hooks/useColorManipulation";
import { useStyleSheet } from "../../hooks/useStyleSheet";
import { formatClassName } from "../../utils/format";

interface Props<T extends AnyColor> extends Partial<ColorPickerBaseProps<T>> {
  colorModel: ColorModel<T>;
}

export const ColorPicker = <T extends AnyColor>({
  className,
  colorModel,
  color = colorModel.defaultColor,
  onChange,
  onChangeEnd,
  ...rest
}: Props<T>): React.ReactElement => {
  const nodeRef = useRef<HTMLDivElement>(null);
  useStyleSheet(nodeRef);

  const [hsva, updateHsva, commitChange] = useColorManipulation<T>(
    colorModel,
    color,
    onChange,
    onChangeEnd
  );

  const nodeClassName = formatClassName(["react-colorful", className]);

  return (
    <div {...rest} ref={nodeRef} className={nodeClassName}>
      <Saturation hsva={hsva} onChange={updateHsva} onChangeEnd={commitChange} />
      <Hue
        hue={hsva.h}
        onChange={updateHsva}
        onChangeEnd={commitChange}
        className="react-colorful__last-control"
      />
    </div>
  );
};
