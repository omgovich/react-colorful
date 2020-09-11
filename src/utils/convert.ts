import { RgbaColor, RgbColor, HslaColor, HslColor, HsvaColor, HsvColor } from "../types";

export const hexToHsva = (hex: string): HsvaColor => rgbaToHsva(hexToRgba(hex));

export const hexToRgba = (hex: string): RgbaColor => {
  if (hex[0] === "#") hex = hex.substr(1);

  if (hex.length < 6) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
      a: 1,
    };
  }

  return {
    r: parseInt(hex.substr(0, 2), 16),
    g: parseInt(hex.substr(2, 2), 16),
    b: parseInt(hex.substr(4, 2), 16),
    a: 1,
  };
};

export const hslStringToHsva = (hslString: string): HsvaColor => {
  const matcher = /hsl\((\d+(?:\.\d+)*),\s*(\d+(?:\.\d+)*)%?,\s*(\d+(?:\.\d+)*)%?\)/;
  const match = matcher.exec(hslString);

  return hslaToHsva({
    h: Number(match ? match[1] : 0),
    s: Number(match ? match[2] : 0),
    l: Number(match ? match[3] : 0),
    a: 1,
  });
};

export const hslaToHsva = ({ h, s, l, a }: HslaColor): HsvaColor => {
  s *= (l < 50 ? l : 100 - l) / 100;

  return {
    h: h,
    s: s > 0 ? ((2 * s) / (l + s)) * 100 : 0,
    v: l + s,
    a,
  };
};

export const hsvaToHex = (hsva: HsvaColor): string => rgbaToHex(hsvaToRgba(hsva));

export const hsvaToHsla = ({ h, s, v, a }: HsvaColor): HslaColor => {
  const hh = ((200 - s) * v) / 100;

  return {
    h: h,
    s: hh > 0 && hh < 200 ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0,
    l: hh / 2,
    a,
  };
};

export const hsvaToHslString = (hsva: HsvaColor): string => {
  const { h, s, l } = hsvaToHsla(hsva);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const hsvaToRgba = ({ h, s, v, a }: HsvaColor): RgbaColor => {
  h = (h / 360) * 6;
  s = s / 100;
  v = v / 100;

  const hh = Math.floor(h),
    b = v * (1 - s),
    c = v * (1 - (h - hh) * s),
    d = v * (1 - (1 - h + hh) * s),
    module = hh % 6;

  return {
    r: Math.round([v, c, b, b, d, v][module] * 255),
    g: Math.round([d, v, v, c, b, b][module] * 255),
    b: Math.round([b, b, d, v, v, c][module] * 255),
    a,
  };
};

export const hsvaToRgbString = (hsva: HsvaColor): string => {
  const { r, g, b } = hsvaToRgba(hsva);
  return `rgb(${r}, ${g}, ${b})`;
};

export const rgbStringToHsva = (rgbString: string): HsvaColor => {
  const matcher = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
  const match = matcher.exec(rgbString);

  return rgbaToHsva({
    r: Number(match ? match[1] : 0),
    g: Number(match ? match[2] : 0),
    b: Number(match ? match[3] : 0),
    a: 1,
  });
};

const format = (number: number) => {
  const hex = number.toString(16);
  return hex.length < 2 ? "0" + hex : hex;
};

export const rgbaToHex = ({ r, g, b }: RgbaColor): string => {
  return "#" + format(r) + format(g) + format(b);
};

export const rgbaToHsva = ({ r, g, b, a }: RgbaColor): HsvaColor => {
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);

  // prettier-ignore
  const hh = delta
    ? max === r
      ? (g - b) / delta
      : max === g
        ? 2 + (b - r) / delta
        : 4 + (r - g) / delta
    : 0;

  return {
    h: Math.round(60 * (hh < 0 ? hh + 6 : hh)),
    s: Math.round(max ? (delta / max) * 100 : 0),
    v: Math.round((max / 255) * 100),
    a,
  };
};

export const rgbaToRgb = ({ r, g, b }: RgbaColor): RgbColor => ({ r, g, b });

export const hslaToHsl = ({ h, s, l }: HslaColor): HslColor => ({ h, s, l });

export const hsvaToHsv = ({ h, s, v }: HsvaColor): HsvColor => ({ h, s, v });
