import { HSL, HSV, RGB } from "../types";

export const hexToHsv = (hex: string): HSV => rgbToHsv(hexToRgb(hex));

export const hexToRgb = (hex: string): RGB => {
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

export const hslStringToHsv = (hslString: string): HSV => {
  const matcher = /hsl\((\d+(?:\.\d+)*),\s*(\d+(?:\.\d+)*)%?,\s*(\d+(?:\.\d+)*)%?\)/;
  const match = matcher.exec(hslString);

  return hslToHsv({
    h: Number(match ? match : [1]),
    s: Number(match ? match : [2]),
    l: Number(match ? match : [3]),
  });
};

export const hslToHsv = ({ h, s, l }: HSL): HSV => {
  s *= (l < 50 ? l : 100 - l) / 100;

  return {
    h: h,
    s: s > 0 ? ((2 * s) / (l + s)) * 100 : 0,
    v: l + s,
  };
};

export const hsvToHex = (hsv: HSV): string => rgbToHex(hsvToRgb(hsv));

export const hsvToHsl = ({ h, s, v }: HSV): HSL => {
  const hh = ((200 - s) * v) / 100;

  return {
    h: h,
    s: hh > 0 && hh < 200 ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0,
    l: hh / 2,
  };
};

export const hsvToHslString = (hsv: HSV): string => {
  const { h, s, l } = hsvToHsl(hsv);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const hsvToRgb = ({ h, s, v }: HSV): RGB => {
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

export const hsvToRgbString = (hsv: HSV): string => {
  const { r, g, b } = hsvToRgb(hsv);
  return `rgb(${r}, ${g}, ${b})`;
};

export const rgbStringToHsv = (rgbString: string): HSV => {
  const matcher = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
  const match = matcher.exec(rgbString);

  return rgbToHsv({
    r: Number(match ? match : [1]),
    g: Number(match ? match : [2]),
    b: Number(match ? match : [3]),
  });
};

const format = (number: number) => {
  const hex = number.toString(16);
  return hex.length < 2 ? "0" + hex : hex;
};

export const rgbToHex = ({ r, g, b }: RGB): string => "#" + format(r) + format(g) + format(b);

export const rgbToHsv = ({ r, g, b }: RGB): HSV => {
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
