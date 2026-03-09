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

export type ObjectColor = RgbColor | HslColor | HsvColor | RgbaColor | HslaColor | HsvaColor;

export type AnyColor = string | ObjectColor;

export interface ColorModel<T extends AnyColor> {
  defaultColor: T;
  toHsva: (defaultColor: T) => HsvaColor;
  fromHsva: (hsva: HsvaColor) => T;
  equal: (first: T, second: T) => boolean;
}

type ColorPickerHTMLAttributes = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "color" | "onChange" | "onChangeCapture"
>;

export interface ColorPickerBaseProps<T extends AnyColor> extends ColorPickerHTMLAttributes {
  color: T;
  onChange: (newColor: T) => void;
}

type ColorInputHTMLAttributes = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
>;

export interface ColorInputBaseProps extends ColorInputHTMLAttributes {
  color?: string;
  onChange?: (newColor: string) => void;
}

// Type aliases for ColorPicker component props (useful for creating wrappers)
export type HexColorPickerProps = Partial<ColorPickerBaseProps<string>>;
export type HexAlphaColorPickerProps = Partial<ColorPickerBaseProps<string>>;
export type HslColorPickerProps = Partial<ColorPickerBaseProps<HslColor>>;
export type HslStringColorPickerProps = Partial<ColorPickerBaseProps<string>>;
export type HslaColorPickerProps = Partial<ColorPickerBaseProps<HslaColor>>;
export type HslaStringColorPickerProps = Partial<ColorPickerBaseProps<string>>;
export type HsvColorPickerProps = Partial<ColorPickerBaseProps<HsvColor>>;
export type HsvStringColorPickerProps = Partial<ColorPickerBaseProps<string>>;
export type HsvaColorPickerProps = Partial<ColorPickerBaseProps<HsvaColor>>;
export type HsvaStringColorPickerProps = Partial<ColorPickerBaseProps<string>>;
export type RgbColorPickerProps = Partial<ColorPickerBaseProps<RgbColor>>;
export type RgbStringColorPickerProps = Partial<ColorPickerBaseProps<string>>;
export type RgbaColorPickerProps = Partial<ColorPickerBaseProps<RgbaColor>>;
export type RgbaStringColorPickerProps = Partial<ColorPickerBaseProps<string>>;
