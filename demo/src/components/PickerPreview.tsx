import React, { useState } from "react";
import { ColorPickerBaseProps, AnyColor } from "../../../src/types";
import { PreviewContainer, PreviewDemo, PreviewOutput, PreviewTitle } from "../styles";

interface Props<T extends AnyColor> {
  title: string;
  PickerComponent: React.ComponentType<Partial<ColorPickerBaseProps<T>>>;
  initialColor: T;
}

export function PickerPreview<T extends AnyColor>({
  title,
  PickerComponent,
  initialColor,
}: Props<T>): JSX.Element {
  const [color, setColor] = useState<T>(initialColor);

  const handleChange = (color: T) => {
    console.log("🎨", color);
    setColor(color);
  };

  return (
    <PreviewContainer>
      <PreviewTitle>{title}</PreviewTitle>
      <PreviewDemo>
        <PickerComponent color={color} onChange={handleChange} />
      </PreviewDemo>
      <PreviewOutput>{JSON.stringify(color)}</PreviewOutput>
    </PreviewContainer>
  );
}
