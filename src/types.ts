export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface HsvColor {
  h: number;
  s: number;
  v: number;
}

export type ObjectColor = HslColor | HsvColor | RgbColor;

export type AnyColor = string | ObjectColor;

export interface ColorModel<T extends AnyColor> {
  defaultColor: T;
  toHsv: (defaultColor: T) => HsvColor;
  fromHsv: (hsv: HsvColor) => T;
  equal: (first: T, second: T) => boolean;
}

export interface ColorPickerBaseProps<T extends AnyColor> {
  className: string;
  color: T;
  onChange: (newColor: T) => void;
}
