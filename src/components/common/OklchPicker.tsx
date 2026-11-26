import React, { useRef } from "react";

import { OklchSquare } from "./OklchSquare";
import { OklchHue } from "./OklchHue";
import { OklchAlpha } from "./OklchAlpha";

import { AnyColor, ColorModel, OklchGamut, OklchPickerProps, OklchState } from "../../types";
import { useColorManipulation } from "../../hooks/useColorManipulation";
import { useStyleSheet } from "../../hooks/useStyleSheet";
import { formatClassName } from "../../utils/format";

interface Props<T extends AnyColor> extends OklchPickerProps<T> {
  colorModel: ColorModel<T, OklchState>;
  gamut: OklchGamut;
  alpha?: boolean;
}

// The base of every OKLCH picker: the square, the hue slider and, optionally, the alpha one
export const OklchPicker = <T extends AnyColor>({
  className,
  colorModel,
  gamut,
  alpha,
  color = colorModel.defaultColor,
  onChange,
  onChangeEnd,
  ...rest
}: Props<T>): React.ReactElement => {
  const nodeRef = useRef<HTMLDivElement>(null);
  useStyleSheet(nodeRef);

  const [state, updateState, commitChange] = useColorManipulation<T, OklchState>(
    colorModel,
    color,
    onChange,
    onChangeEnd
  );

  return (
    <div {...rest} ref={nodeRef} className={formatClassName(["react-colorful", className])}>
      <OklchSquare state={state} gamut={gamut} onChange={updateState} onChangeEnd={commitChange} />
      <OklchHue
        hue={state.h}
        gamut={gamut}
        onChange={updateState}
        onChangeEnd={commitChange}
        className={alpha ? undefined : "react-colorful__last-control"}
      />
      {alpha && (
        <OklchAlpha state={state} gamut={gamut} onChange={updateState} onChangeEnd={commitChange} />
      )}
    </div>
  );
};
