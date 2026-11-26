import React from "react";

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

export interface OklchColor {
  /** Lightness, 0..1 */
  l: number;
  /** Chroma, 0..~0.37 (absolute, as in CSS `oklch()`) */
  c: number;
  /** Hue in degrees, 0..360 */
  h: number;
}

export interface OklchaColor extends OklchColor {
  a: number;
}

/** The gamut an OKLCH picker lets the user pick from */
export type OklchGamut = "srgb" | "p3";

/**
 * Internal state of OKLCH pickers. `x` is the chroma as a share (0..1) of the highest chroma
 * this lightness and hue reach in the picker's gamut: the horizontal axis of the square
 */
export interface OklchState {
  l: number;
  x: number;
  h: number;
  a: number;
}

export type ObjectColor =
  | RgbColor
  | HslColor
  | HsvColor
  | RgbaColor
  | HslaColor
  | HsvaColor
  | OklchColor
  | OklchaColor;

export type AnyColor = string | ObjectColor;

/** The ways a picker can represent a color internally: see `ColorModel` */
export type InternalColor = HsvaColor | OklchState;

/**
 * Converts between a picker's color format `T` (a HEX string, an RGB object, …) and the
 * picker's internal representation of the color `I`, HSVA by default
 */
export interface ColorModel<T extends AnyColor, I extends InternalColor = HsvaColor> {
  defaultColor: T;
  toInternal: (color: T) => I;
  fromInternal: (internal: I) => T;
  equal: (first: T, second: T) => boolean;
}

// A color model whose conversions also get the gamut, so one model serves both gamuts
export interface GamutColorModel<T extends AnyColor> {
  defaultColor: T;
  // `previous` is the picker's current state: what a color can't tell (the chroma share of black
  // and white, the hue of a grey written as OKLab) is kept from it
  toInternal: (color: T, gamut: OklchGamut, previous?: OklchState) => OklchState;
  fromInternal: (internal: OklchState, gamut: OklchGamut) => T;
  equal: (first: T, second: T) => boolean;
}

type ColorPickerHTMLAttributes = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "color" | "onChange" | "onChangeCapture"
>;

export interface ColorPickerBaseProps<T extends AnyColor> extends ColorPickerHTMLAttributes {
  color: T;
  onChange: (newColor: T) => void;
  onChangeEnd?: (newColor: T) => void;
}

export interface OklchPickerProps<T extends AnyColor> extends Partial<ColorPickerBaseProps<T>> {
  /**
   * The gamut the picker lets the user pick from: `"srgb"` (default) or `"p3"`.
   * The output stays an OKLCH color either way
   */
  gamut?: OklchGamut;
}

type ColorInputHTMLAttributes = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
>;

export interface ColorInputBaseProps extends ColorInputHTMLAttributes {
  color?: string;
  onChange?: (newColor: string) => void;
}
