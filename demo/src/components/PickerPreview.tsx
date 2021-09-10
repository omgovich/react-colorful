/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from "react";
import { HexColorInput, RgbStringColorInput } from "../../../src";
import { ColorPickerBaseProps, AnyColor } from "../../../src/types";
import { PreviewContainer, PreviewDemo, PreviewOutput, PreviewTitle } from "../styles";

interface Props<T extends AnyColor> {
  title: string;
  PickerComponent: React.ComponentType<Partial<ColorPickerBaseProps<T>>>;
  initialColor?: T;
}

export function PickerPreview<T extends AnyColor>({
  title,
  PickerComponent,
  initialColor,
}: Props<T>): JSX.Element {
  const [color, setColor] = useState<T | undefined>(initialColor);

  const handleChange = (color: T) => {
    console.log("🎨", color);
    setColor(color);
  };

  return (
    <PreviewContainer>
      <PreviewTitle>{title}</PreviewTitle>
      <PreviewDemo>
        <PickerComponent color={color} onChange={handleChange} />
        {/* @ts-ignore */}
        {title === "HEX" && <HexColorInput color={color} onChange={handleChange} prefixed alpha />}
        {/* @ts-ignore */}
        {title === "RGB String" && <RgbStringColorInput color={color} onChange={handleChange} />}
        {/* @ts-ignore */}
        {title === "RGBA String" && <RgbStringColorInput color={color} onChange={handleChange} />}
      </PreviewDemo>
      <PreviewOutput>{JSON.stringify(color)}</PreviewOutput>
    </PreviewContainer>
  );
}
