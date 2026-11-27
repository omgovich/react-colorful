import { clamp } from "./clamp";
import { round } from "./round";
import { parseColorFunction, percentOf } from "./colorFunction";
import { RAD, maxChroma } from "./oklchGamut";
import { oklchaToInternal } from "./oklch";
import { OklabaColor, OklchGamut, OklchInternal } from "../types";

// OKLab pickers: the OKLCH pickers' square and sliders, with colors written as OKLab, the
// cartesian form of the same space (`a` = c·cos h, `b` = c·sin h)

/**
 * Turns an OKLab color into the picker's internal color; a color outside the gamut is shown at the
 * edge. A grey (a = b = 0) has no hue: it keeps the one of the `previous` internal color, or gets 0°
 */
export const oklabaToInternal = (
  { l, a, b, alpha }: OklabaColor,
  gamut: OklchGamut,
  previous?: OklchInternal
): OklchInternal => {
  // `|| 0` turns NaN into 0
  const labA = a || 0;
  const labB = b || 0;
  const c = Math.hypot(labA, labB);
  const h = c ? Math.atan2(labB, labA) / RAD : previous ? previous.h : 0;
  return oklchaToInternal({ l, c, h, a: alpha }, gamut, previous);
};

/**
 * Turns the picker's internal color into an OKLab color. `a` and `b` are rounded separately, which
 * can move the color a hair past the edge of the square; then the chroma steps back until it fits,
 * so the color always reopens at the same spot
 */
export const internalToOklaba = (
  { l, x, h, a: alpha }: OklchInternal,
  gamut: OklchGamut
): OklabaColor => {
  const lightness = round(l, 4);

  // `a` and `b` of a chroma, rounded as they are written
  const axes = (c: number) => [round(c * Math.cos(h * RAD), 5), round(c * Math.sin(h * RAD), 5)];

  // Whether the rounded color is past the edge
  const outside = ([a, b]: number[]) => {
    const hue = Math.atan2(b, a) / RAD;
    return Math.hypot(a, b) > maxChroma(lightness, hue, gamut);
  };

  let c = Math.min(x * maxChroma(l, h, gamut), maxChroma(lightness, h, gamut));
  while (c > 0 && outside(axes(c))) c -= 1e-5;

  const [a, b] = axes(c);
  // `+ 0` turns -0 into 0
  return { l: lightness, a: a + 0, b: b + 0, alpha: round(alpha, 2) };
};

/**
 * Parses `oklab(L a b)` and `oklab(L a b / A)`: L as a number or a percentage, a and b as
 * numbers or percentages (100% is 0.4, as in CSS), A as a number or a percentage
 */
export const parseOklaba = (value: string): OklabaColor => {
  const components = parseColorFunction("oklab", value, ["%", "%", "%"]);
  if (!components) return { l: 0, a: 0, b: 0, alpha: 1 };

  const [l, a, b, alpha] = components;
  return {
    l: clamp(percentOf(l)),
    a: percentOf(a, 0.4),
    b: percentOf(b, 0.4),
    alpha: alpha ? clamp(percentOf(alpha)) : 1,
  };
};

/** Whether two OKLab strings are the same color: compares the parsed values, not the text */
export const equalOklabString = (first: string, second: string): boolean => {
  const p = parseOklaba(first);
  const q = parseOklaba(second);
  return p.l === q.l && p.a === q.a && p.b === q.b && p.alpha === q.alpha;
};

const oklabString = (l: number, a: number, b: number, alpha?: number): string => {
  const alphaPart = alpha === undefined ? "" : ` / ${round(alpha, 3)}`;
  return `oklab(${round(l, 5)} ${round(a, 5)} ${round(b, 5)}${alphaPart})`;
};

export const formatOklab = ({ l, a, b }: OklabaColor): string => oklabString(l, a, b);

export const formatOklaba = ({ l, a, b, alpha }: OklabaColor): string =>
  oklabString(l, a, b, alpha);
