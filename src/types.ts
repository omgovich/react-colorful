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

export type Color = string | RGB | HSL | HSV;

export interface ColorModel<T> {
  defaultColor: Color;
  toHsv: (defaultColor: T) => HSV;
  fromHsv: (hsv: HSV) => T;
  equal: (first: any, second: any) => boolean;
}

export interface ColorPickerBaseProps {
  className: string;
  color: Color;
  onChange: (newColor: any) => void;
}
