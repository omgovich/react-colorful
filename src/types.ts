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

export type Everything = string | RGB | HSL | HSV;

export interface ColorModel {
  defaultColor: Everything;
  toHsv: (defaultColor: any) => HSV;
  fromHsv: (hsv: HSV) => Everything;
  equal: (first: any, second: any) => boolean;
}

export interface BaseComponentProps {
  className: string;
  color: any;
  onChange: (newColor: any) => void;
}
