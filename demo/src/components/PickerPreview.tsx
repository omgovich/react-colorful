import React, { useState } from "react";
import { ColorPickerBaseProps, AnyColor } from "../../../src/types";
import styles from "../css/styles.css";

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
    <div className={styles.preview}>
      <div className={styles.previewTitle}>{title}</div>
      <PickerComponent className={styles.previewDemo} color={color} onChange={handleChange} />
      <div className={styles.previewOutput}>{JSON.stringify(color)}</div>
    </div>
  );
}
