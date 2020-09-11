import { HslColor, HsvColor, RgbColor } from "../types";

export const hexToHsv = (hex: string): HsvColor => rgbToHsv(hexToRgb(hex));

export const hexToRgb = (hex: string): RgbColor => {
  if (hex[0] === "#") hex = hex.substr(1);

  if (hex.length < 6) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
    };
  }

  return {
    r: parseInt(hex.substr(0, 2), 16),
    g: parseInt(hex.substr(2, 2), 16),
    b: parseInt(hex.substr(4, 2), 16),
  };
};

export const hslStringToHsv = (hslString: string): HsvColor => {
  const matcher = /hsl\((\d+(?:\.\d+)*),\s*(\d+(?:\.\d+)*)%?,\s*(\d+(?:\.\d+)*)%?\)/;
  const match = matcher.exec(hslString);

  return hslToHsv({
    h: Number(match ? match[1] : 0),
    s: Number(match ? match[2] : 0),
    l: Number(match ? match[3] : 0),
  });
};

export const hsvStringToHsv = (hsvString: string): HsvColor => {
  const matcher = /hsv\((\d+(?:\.\d+)*),\s*(\d+(?:\.\d+)*)%?,\s*(\d+(?:\.\d+)*)%?\)/;
  const match = matcher.exec(hsvString);

  return {
    h: Number(match ? match[1] : 0),
    s: Number(match ? match[2] : 0),
    v: Number(match ? match[3] : 0),
  };
};

export const hslToHsv = ({ h, s, l }: HslColor): HsvColor => {
  s *= (l < 50 ? l : 100 - l) / 100;

  return {
    h: h,
    s: s > 0 ? ((2 * s) / (l + s)) * 100 : 0,
    v: l + s,
  };
};

export const hsvToHex = (hsv: HsvColor): string => rgbToHex(hsvToRgb(hsv));

export const hsvToHsl = ({ h, s, v }: HsvColor): HslColor => {
  const hh = ((200 - s) * v) / 100;

  return {
    h: h,
    s: hh > 0 && hh < 200 ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0,
    l: hh / 2,
  };
};

export const hsvToHslString = (hsv: HsvColor): string => {
  const { h, s, l } = hsvToHsl(hsv);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const hsvToHsvString = (hsv: HsvColor): string => {
  const { h, s, v } = hsv;
  return `hsv(${h}, ${s}%, ${v}%)`;
};

export const hsvToRgb = ({ h, s, v }: HsvColor): RgbColor => {
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
  };
};

export const hsvToRgbString = (hsv: HsvColor): string => {
  const { r, g, b } = hsvToRgb(hsv);
  return `rgb(${r}, ${g}, ${b})`;
};

export const rgbStringToHsv = (rgbString: string): HsvColor => {
  const matcher = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
  const match = matcher.exec(rgbString);

  return rgbToHsv({
    r: Number(match ? match[1] : 0),
    g: Number(match ? match[2] : 0),
    b: Number(match ? match[3] : 0),
  });
};

const format = (number: number) => {
  const hex = number.toString(16);
  return hex.length < 2 ? "0" + hex : hex;
};

export const rgbToHex = ({ r, g, b }: RgbColor): string => "#" + format(r) + format(g) + format(b);

export const rgbToHsv = ({ r, g, b }: RgbColor): HsvColor => {
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
  };
};
