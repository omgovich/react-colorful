import React, { useState } from "react";
import { ColorPickerBaseProps, AnyColor } from "../../../src/types";

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
    <div className="preview">
      <div className="preview__title">{title}</div>
      <PickerComponent className="preview__demo" color={color} onChange={handleChange} />
      <div className="preview__output">{JSON.stringify(color)}</div>
    </div>
  );
}
