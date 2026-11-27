import React, { useMemo, useRef } from "react";

import { OklchSquare } from "./OklchSquare";
import { OklchHue } from "./OklchHue";
import { OklchAlpha } from "./OklchAlpha";

import {
  AnyColor,
  ColorModel,
  GamutColorModel,
  OklchPickerProps,
  OklchInternal,
} from "../../types";
import { useColorManipulation } from "../../hooks/useColorManipulation";
import { useStyleSheet } from "../../hooks/useStyleSheet";
import { formatClassName } from "../../utils/format";

interface Props<T extends AnyColor> extends OklchPickerProps<T> {
  colorModel: GamutColorModel<T>;
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

  // The picker's current internal color, for what a new color can't tell (see `GamutColorModel`)
  const current = useRef<OklchInternal>();

  // The picker's model bound to its gamut. A new gamut makes a new model, and the hook redraws
  // the current color with it
  const colorModel = useMemo<ColorModel<T, OklchInternal>>(
    () => ({
      ...model,
      toInternal: (color: T) => model.toInternal(color, gamut, current.current),
      fromInternal: (internal: OklchInternal) => model.fromInternal(internal, gamut),
    }),
    [model, gamut]
  );

  const [internal, updateInternal, commitChange] = useColorManipulation<T, OklchInternal>(
    colorModel,
    color,
    onChange,
    onChangeEnd
  );
  current.current = internal;

  return (
    <div {...rest} ref={nodeRef} className={formatClassName(["react-colorful", className])}>
      <OklchSquare
        internal={internal}
        gamut={gamut}
        onChange={updateInternal}
        onChangeEnd={commitChange}
      />
      <OklchHue
        hue={internal.h}
        gamut={gamut}
        onChange={updateInternal}
        onChangeEnd={commitChange}
        className={alpha ? undefined : "react-colorful__last-control"}
      />
      {alpha && (
        <OklchAlpha
          internal={internal}
          gamut={gamut}
          onChange={updateInternal}
          onChangeEnd={commitChange}
        />
      )}
    </div>
  );
};
