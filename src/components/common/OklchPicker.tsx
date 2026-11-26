import React, { useMemo, useRef } from "react";

import { OklchSquare } from "./OklchSquare";
import { OklchHue } from "./OklchHue";
import { OklchAlpha } from "./OklchAlpha";

import { AnyColor, ColorModel, OklchColorModel, OklchPickerProps, OklchState } from "../../types";
import { useColorManipulation } from "../../hooks/useColorManipulation";
import { useStyleSheet } from "../../hooks/useStyleSheet";
import { formatClassName } from "../../utils/format";

interface Props<T extends AnyColor> extends OklchPickerProps<T> {
  colorModel: OklchColorModel<T>;
  alpha?: boolean;
}

// The base of every OKLCH picker: the square, the hue slider and, optionally, the alpha one
export const OklchPicker = <T extends AnyColor>({
  className,
  colorModel: model,
  gamut = "srgb",
  alpha,
  color = model.defaultColor,
  onChange,
  onChangeEnd,
  ...rest
}: Props<T>): React.ReactElement => {
  const nodeRef = useRef<HTMLDivElement>(null);
  useStyleSheet(nodeRef);

  // The picker's model bound to its gamut. A new gamut makes a new model, and the hook redraws
  // the current color with it
  const colorModel = useMemo<ColorModel<T, OklchState>>(
    () => ({
      ...model,
      toInternal: (color: T) => model.toInternal(color, gamut),
      fromInternal: (internal: OklchState) => model.fromInternal(internal, gamut),
    }),
    [model, gamut]
  );

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
