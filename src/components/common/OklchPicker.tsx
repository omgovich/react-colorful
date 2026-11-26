import React, { useRef } from "react";

import { OklchSquare } from "./OklchSquare";
import { OklchHue } from "./OklchHue";
import { Interactive, Interaction } from "./Interactive";
import { Pointer } from "./Pointer";

import { AnyColor, ColorModel, OklchGamut, OklchPickerProps, OklchState } from "../../types";
import { useColorManipulation } from "../../hooks/useColorManipulation";
import { useStyleSheet } from "../../hooks/useStyleSheet";
import { formatClassName } from "../../utils/format";
import { maxChroma, oklchString } from "../../utils/oklch";
import { clamp } from "../../utils/clamp";
import { round } from "../../utils/round";

interface Props<T extends AnyColor> extends OklchPickerProps<T> {
  colorModel: ColorModel<T, OklchState>;
  gamut: OklchGamut;
  alpha?: boolean;
}

interface AlphaProps {
  state: OklchState;
  gamut: OklchGamut;
  onChange: (newAlpha: { a: number }) => void;
  onChangeEnd?: () => void;
}

const OklchAlpha = ({ state, gamut, onChange, onChangeEnd }: AlphaProps) => {
  const { l, x, h, a } = state;
  const c = x * maxChroma(l, h, gamut);
  const ariaValue = round(a * 100);

  return (
    <div className="react-colorful__alpha react-colorful__last-control">
      <div
        className="react-colorful__alpha-gradient"
        style={{
          backgroundImage: `linear-gradient(90deg, ${oklchString(l, c, h, 0)}, ${oklchString(
            l,
            c,
            h
          )})`,
        }}
      />
      <Interactive
        onMove={(interaction: Interaction) => onChange({ a: interaction.left })}
        onKey={(offset: Interaction) => onChange({ a: clamp(a + offset.left) })}
        onEnd={onChangeEnd}
        aria-label="Alpha"
        aria-valuetext={`${ariaValue}%`}
        aria-valuenow={ariaValue}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <Pointer
          className="react-colorful__alpha-pointer"
          left={a}
          color={oklchString(l, c, h, a)}
        />
      </Interactive>
    </div>
  );
};

// The square, the hue slider and, optionally, the alpha one
const OklchPickerBase = <T extends AnyColor>({
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

/**
 * The base of every OKLCH picker. A new gamut remounts the picker, so that it keeps the color
 * and moves the pointer to the color's spot in the new square. The color to rebuild from is
 * the last one the picker saw: a new `color` prop or the last one it sent to `onChange`. So
 * the color survives even when the parent doesn't pass it back (or passes no `color` at all).
 */
export const OklchPicker = <T extends AnyColor>(props: Props<T>): React.ReactElement => {
  const { color = props.colorModel.defaultColor, onChange } = props;
  const prop = useRef(color);
  const last = useRef(color);

  // A new `color` prop wins over the last emitted color
  if (color !== prop.current) prop.current = last.current = color;

  const handleChange = (newColor: T) => {
    last.current = newColor;
    onChange && onChange(newColor);
  };

  return (
    <OklchPickerBase key={props.gamut} {...props} color={last.current} onChange={handleChange} />
  );
};
