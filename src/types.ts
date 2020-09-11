export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface RgbaColor extends RgbColor {
  a: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface HslaColor extends HslColor {
  a: number;
}

export interface HsvColor {
  h: number;
  s: number;
  v: number;
}

export interface HsvaColor extends HsvColor {
  a: number;
}

export type PlainObjectColor = RgbColor | HslColor | HsvColor;

export type AlphaObjectColor = RgbaColor | HslaColor | HsvaColor;

export type ObjectColor = PlainObjectColor | AlphaObjectColor;

export type AnyColor = string | ObjectColor;

export interface ColorModel<T extends AnyColor> {
  defaultColor: T;
  toHsva: (defaultColor: T) => HsvaColor;
  fromHsva: (hsv: HsvaColor) => T;
  equal: (first: T, second: T) => boolean;
}

export interface ColorPickerBaseProps<T extends AnyColor> {
  className: string;
  color: T;
  onChange: (newColor: T) => void;
}
