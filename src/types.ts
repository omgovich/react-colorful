export interface RGB {
  r: number;
  g: number;
  b: number;
  [key: string]: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
  [key: string]: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
  [key: string]: number;
}

export type AnyColor = string | RGB | HSL | HSV;

export interface ColorModel<T> {
  defaultColor: T;
  toHsv: (defaultColor: T) => HSV;
  fromHsv: (hsv: HSV) => T;
  equal: (first: T, second: T) => boolean;
}

export interface ColorPickerBaseProps<T extends AnyColor = AnyColor> {
  className: string;
  color: T;
  onChange: (newColor: T) => void;
}
