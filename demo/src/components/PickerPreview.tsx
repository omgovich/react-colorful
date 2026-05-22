/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from "react";
import Frame from "react-frame-component";
import { HexColorInput } from "../../../src";
import { ColorPickerBaseProps, AnyColor } from "../../../src/types";
import { PreviewContainer, PreviewDemo, PreviewOutput, PreviewTitle } from "../styles";
import { ShadowDom } from "./ShadowDom";

interface Props<T extends AnyColor> {
  title: string;
  frame?: boolean;
  shadow?: boolean;
  PickerComponent: React.ComponentType<Partial<ColorPickerBaseProps<T>>>;
  initialColor?: T;
}

export function PickerPreview<T extends AnyColor>({
  title,
  frame,
  shadow,
  PickerComponent,
  initialColor,
}: Props<T>): JSX.Element {
  const [color, setColor] = useState<T | undefined>(initialColor);

  const handleChange = (color: T) => {
    console.log("🎨", color);
    setColor(color);
  };

  const Wrapper = frame ? Frame : shadow ? ShadowDom : React.Fragment;

  return (
    <PreviewContainer>
      <PreviewTitle>{title}</PreviewTitle>
      <PreviewDemo>
        <Wrapper>
          <PickerComponent color={color} onChange={handleChange} />
        </Wrapper>
        {title.startsWith("HEX") && (
          // @ts-ignore
          <HexColorInput color={color} onChange={handleChange} prefixed alpha />
        )}
      </PreviewDemo>
      <PreviewOutput>{JSON.stringify(color)}</PreviewOutput>
    </PreviewContainer>
  );
}
