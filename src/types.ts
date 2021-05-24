import React from "react";

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export type RgbStringColor = `rgb(${number}, ${number}, ${number})`;

export interface RgbaColor extends RgbColor {
  a: number;
}

export type RgbaStringColor = `rgba(${number}, ${number}, ${number}, ${number})`;

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export type HslStringColor = `hsl(${number}, ${number}%, ${number}%)`;

export interface HslaColor extends HslColor {
  a: number;
}

export type HslaStringColor = `hsla(${number}, ${number}%, ${number}%, ${number})`;

export interface HsvColor {
  h: number;
  s: number;
  v: number;
}

export type HsvStringColor = `hsv(${number}, ${number}%, ${number}%)`;

export interface HsvaColor extends HsvColor {
  a: number;
}

export type HsvaStringColor = `hsva(${number}, ${number}%, ${number}%, ${number})`;

export type ObjectColor = RgbColor | HslColor | HsvColor | RgbaColor | HslaColor | HsvaColor;
export type StringColor =
  | RgbStringColor
  | HslStringColor
  | HsvStringColor
  | RgbaStringColor
  | HslaStringColor
  | HsvaStringColor;

export type AnyColor = string | StringColor | ObjectColor;

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
