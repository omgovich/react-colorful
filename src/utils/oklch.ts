import { clamp } from "./clamp";
import { round } from "./round";
import { parseHue } from "./convert";
import { parseColorFunction, percentOf } from "./colorFunction";
import { maxChroma } from "./oklchGamut";
import { OklchaColor, OklchGamut, OklchInternal } from "../types";

// OKLCH pickers. The square shows lightness (top to bottom) against chroma as a share of the
// highest chroma that lightness and hue reach in the gamut (left to right). That keeps the square
// solid at every hue and every point in it inside the gamut, but for a hair past sRGB near 264°
// (see `maxChroma`). The edge itself is in `oklchGamut.ts`, the gradients that draw the square and
// the hue bar in `oklchGradients.ts`.

export const oklchString = (l: number, c: number, h: number, a?: number): string => {
  const alpha = a === undefined ? "" : ` / ${round(a, 3)}`;
  return `oklch(${round(l, 5)} ${round(c, 5)} ${round(h, 3)}${alpha})`;
};

/**
 * Turns a color into the picker's internal color; a color outside the gamut is shown at the edge.
 * What the color can't tell is kept from the `previous` internal color, so the pointers stay where
 * they are on a gamut switch: the chroma share of black and white (the edge is 0 there), and 360°
 * at the right end of the hue slider (written as 0°)
 */
export const oklchaToInternal = (
  color: OklchaColor,
  gamut: OklchGamut,
  previous?: OklchInternal
): OklchInternal => {
  // `|| 0` turns NaN (a broken prop) into 0 instead of letting it into the picker and its styles
  const l = clamp(color.l || 0);
  const hue = parseHue(color.h) || 0;
  const h = previous && previous.h % 360 === hue % 360 ? previous.h : hue;
  // The chroma as a share of the edge
  const edge = maxChroma(l, h, gamut);
  const x = edge ? clamp(color.c / edge || 0) : previous ? previous.x : 0;
  return { l, x, h, a: color.a };
};

/**
 * Turns the picker's internal color into a color. L and H are rounded first, and C is then clamped
 * to the edge for the ROUNDED lightness and hue: the color always reopens at the same spot. (Near
 * 264.2° in sRGB rounding the hue alone can move the edge from a far branch of blue to the near
 * one.) C is rounded to the nearest step, not down: `c → x → c` drifts by float noise, and 0.1
 * must come back as 0.1, not 0.09999. Only a step past the edge is taken back.
 */
export const internalToOklcha = ({ l, x, h, a }: OklchInternal, gamut: OklchGamut): OklchaColor => {
  const lightness = round(l, 4);
  const hue = round(h, 2);
  const edge = maxChroma(lightness, hue, gamut);

  let c = round(Math.min(x * maxChroma(l, h, gamut), edge), 5);
  if (c > edge) c = round(c - 1e-5, 5);

  return {
    l: lightness,
    c,
    // The right end of the hue slider is 360, and rounding can reach it too (359.996). It is
    // written as 0, as colord and most tools do, so a parent that normalizes the hue gets back
    // the same color
    h: hue % 360,
    a: round(a, 2),
  };
};

/**
 * Parses `oklch(L C H)` and `oklch(L C H / A)`: L as a number or a percentage, C as a number or
 * a percentage (100% is 0.4, as in CSS), H with an optional angle unit, A as a number or a
 * percentage
 */
export const parseOklcha = (value: string): OklchaColor => {
  const components = parseColorFunction("oklch", value, ["%", "%", "deg|rad|grad|turn"]);
  if (!components) return { l: 0, c: 0, h: 0, a: 1 };

  const [l, c, h, a] = components;
  return {
    l: clamp(percentOf(l)),
    c: Math.max(0, percentOf(c, 0.4)),
    h: parseHue(h.value, h.unit) || 0,
    a: a ? clamp(percentOf(a)) : 1,
  };
};

/**
 * Whether two OKLCH strings are the same color. Comparing the parsed values, not the text:
 * removing spaces to compare would merge `oklch(0.7 0.1 20)` and `oklch(0.7 0.12 0)`
 */
export const equalOklchString = (first: string, second: string): boolean => {
  const a = parseOklcha(first);
  const b = parseOklcha(second);
  return a.l === b.l && a.c === b.c && a.h === b.h && a.a === b.a;
};

export const formatOklch = ({ l, c, h }: OklchaColor): string => oklchString(l, c, h);

export const formatOklcha = ({ l, c, h, a }: OklchaColor): string => oklchString(l, c, h, a);
