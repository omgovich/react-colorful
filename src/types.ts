export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export type AnyColor = string | HSL | HSV | RGB;

export interface ColorModel<T extends AnyColor> {
  defaultColor: T;
  toHsv: (defaultColor: T) => HSV;
  fromHsv: (hsv: HSV) => T;
  equal: (first: T, second: T) => boolean;
}

export interface ColorPickerBaseProps<T> {
  className: string;
  color: T;
  onChange: (newColor: T) => void;
}
