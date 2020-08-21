declare module "react-colorful" {
  import { FC } from 'react';
  const HexColorPicker: FC<{ color: string; onChange: (newColor: string) => void; }>;
  export = HexColorPicker;
}

declare module "react-colorful/rgb" {
  import { FC } from 'react';
  type rgb = { r: number; g: number; b: number };
  const ColorPicker: FC<{ color: rgb; onChange: (newColor: rgb) => void; }>;
  export = ColorPicker;
}

declare module "react-colorful/rgbString" {
  import { FC } from 'react';
  const ColorPicker: FC<{ color: string; onChange: (newColor: string) => void; }>;
  export = ColorPicker;
}

declare module "react-colorful/hsl" {
  import { FC } from 'react';
  type hsl = { h: number; s: number; l: number };
  const ColorPicker: FC<{ color: hsl; onChange: (newColor: hsl) => void; }>;
  export = ColorPicker;
}

declare module "react-colorful/hslString" {
  import { FC } from 'react';
  const ColorPicker: FC<{ color: string; onChange: (newColor: string) => void; }>;
  export = ColorPicker;
}

declare module "react-colorful/hsv" {
  import { FC } from 'react';
  type hsv = { h: number; s: number; v: number };
  const ColorPicker: FC<{ color: hsv; onChange: (newColor: hsv) => void; }>;
  export = ColorPicker;
}
