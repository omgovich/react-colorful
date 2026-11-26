import { clamp } from "./clamp";
import { OklchGamut } from "../types";

// Where the sRGB and Display P3 gamuts end in OKLCH: the right edge of the OKLCH pickers' square.
// Math: https://bottosson.github.io/posts/oklab/

// π / 180 as a literal: a top-level `Math.PI / 180` would stay in every picker's bundle
export const RAD = 0.017453292519943295;

// OKLab → LMS (cube roots) and LMS → linear sRGB, at full precision: derived from the CSS Color 4
// matrices (https://www.w3.org/TR/css-color-4/#color-conversion-code), as in colord. The 10-digit
// tables from the original OKLab post differ by ~1e-7, enough to move the gamut edge of some blues
const LAB_TO_LMS = [
  [0.3963377773761749, 0.2158037573099136],
  [-0.1055613458156586, -0.0638541728258133],
  [-0.0894841775298119, -1.2914855480194092],
];
const LMS_TO_RGB = [
  [4.0767416360759583, -3.3077115392580616, 0.2309699031821043],
  [-1.2684379732850317, 2.6097573492876887, -0.3413193760026573],
  [-0.0041960761386756, -0.7034186179359363, 1.7076146940746117],
];
// Linear sRGB → linear Display P3, derived from both primaries and the shared D65 white point
// so that white maps to white exactly (rounded tables put it at 1.0000001, outside the gamut)
const RGB_TO_P3 = [
  [0.8224619687143625, 0.17753803128563805, 0],
  [0.03319419885096158, 0.9668058011490385, 0],
  [0.017082630721120033, 0.07239744066396339, 0.9105199286149165],
];

// Beyond the chroma of any P3 color; also the end of the search for the gamut edge
const MAX_CHROMA = 0.5;

// The coefficients `[c⁰, c¹, c², c³]` of a cubic polynomial
type Cubic = number[];

const evaluate = ([a, b, c, d]: Cubic, x: number): number => a + x * (b + x * (c + x * d));

// Applies a 3×3 matrix to three cubics
const mix = (matrix: number[][], [x, y, z]: Cubic[]): Cubic[] =>
  matrix.map(([u, v, w]) => x.map((_, i) => u * x[i] + v * y[i] + w * z[i]));

/**
 * At a fixed lightness and hue every linear RGB channel is a cubic in chroma.
 * Returns the cubics of the three channels in the given gamut.
 */
const channels = (l: number, h: number, gamut: OklchGamut): Cubic[] => {
  const cos = Math.cos(h * RAD);
  const sin = Math.sin(h * RAD);

  // Each LMS component is (l + k·C)³
  const lms = LAB_TO_LMS.map(([u, v]) => {
    const k = u * cos + v * sin;
    return [l * l * l, 3 * l * l * k, 3 * l * k * k, k * k * k];
  });

  const rgb = mix(LMS_TO_RGB, lms);
  return gamut === "p3" ? mix(RGB_TO_P3, rgb) : rgb;
};

// How far a color is from the gamut: 0 inside, else how far its worst channel is past 0 or 1.
// Anything up to 1e-9 is float noise: white comes out as 1.0000000000000002
const violation = (rgb: Cubic[], c: number): number => {
  let worst = 0;
  for (const channel of rgb) {
    const value = evaluate(channel, c);
    worst = Math.max(worst, -value, value - 1);
  }
  return worst > 1e-9 ? worst : 0;
};

/**
 * Whether an OKLCH color fits the gamut. `tolerance` is how far a linear RGB channel may go past
 * 0 or 1: the square's edge bridges a few shallow gaps in the sRGB gamut (see `maxChroma`)
 */
export const inGamut = (
  l: number,
  c: number,
  h: number,
  gamut: OklchGamut,
  tolerance = 0
): boolean => violation(channels(l, h, gamut), c) <= tolerance;

// Where a cubic turns: the roots of its derivative b + 2c·x + 3d·x², in ascending order
const turningPoints = ([, b, c, d]: Cubic): number[] => {
  // Nearly a parabola: one turning point, or none for a straight line
  if (Math.abs(d) < 1e-12) return Math.abs(c) < 1e-12 ? [] : [-b / (2 * c)];

  const discriminant = c * c - 3 * b * d;
  if (discriminant <= 0) return [];

  const root = Math.sqrt(discriminant);
  return [(-c - root) / (3 * d), (-c + root) / (3 * d)].sort((x, y) => x - y);
};

// Bisection: where `outside` turns true on `[inside, outside]`, from the inside
const bisect = (outside: (x: number) => boolean, lo: number, hi: number): number => {
  for (let step = 0; step < 40; step++) {
    const mid = (lo + hi) / 2;
    if (outside(mid)) hi = mid;
    else lo = mid;
  }
  return lo;
};

/**
 * The chroma, from `from` on, where the color first leaves the gamut. Each channel's cubic is
 * split at its turning points into monotonic pieces, and the earliest piece that crosses 0 or 1
 * is bisected.
 */
const firstExit = (rgb: Cubic[], from: number): number => {
  let edge = MAX_CHROMA;

  for (const channel of rgb) {
    const outside = (x: number) => violation([channel], x) > 0;
    const turns = turningPoints(channel).filter((x) => x > from && x < edge);
    const bounds = [from, ...turns, edge];

    // `from` is inside the gamut, so the first bound outside it closes the piece with the exit
    const i = bounds.findIndex(outside);
    if (i > 0) edge = bisect(outside, bounds[i - 1], bounds[i]);
  }

  return edge;
};

// Golden-section search: where a function with a single dip on `[lo, hi]` is the lowest
const argMin = (f: (x: number) => number, lo: number, hi: number): number => {
  for (let step = 0; step < 30; step++) {
    const a = lo + 0.381966 * (hi - lo);
    const b = hi - 0.381966 * (hi - lo);
    if (f(a) < f(b)) hi = b;
    else lo = a;
  }
  return (lo + hi) / 2;
};

// How deep a dip past the first exit the square's edge steps over, in a linear RGB channel, at
// most: fully up to the gap, fading out up to twice the gap so that the edge never jumps
const GAP = 1e-3;

// The blue dip deepens with lightness as l³ (0.0007 at #0000ff, l = 0.452), so the gap follows
// l³ too: a fixed gap would step over the far deeper-looking dips of dark colors, where nothing
// of the gamut lies behind them. 0.011 ≈ GAP / 0.452³: the full gap from the lightness of
// `#0000ff` up
const gapAt = (l: number): number => Math.min(GAP, 0.011 * l * l * l);

// What lies just past an exit from the gamut, see `maxChroma`
interface Dip {
  // Where the walk ended, and how far from the gamut the color was there (0: back inside)
  end: number;
  depth: number;
  // How deep the dip got
  peak: number;
  // Once the color started to come back: its lowest distance from the gamut, at chroma `back`
  low: number;
  back: number;
}

// Walks past `edge` in steps of 1e-4 while the color stays within twice the gap of the gamut
const walkDip = (rgb: Cubic[], edge: number, gap: number): Dip => {
  const dip = { end: edge, depth: 0, peak: 0, low: Infinity, back: edge };
  let rising = true;

  do {
    dip.end += 1e-4;
    dip.depth = violation(rgb, dip.end);

    if (rising && dip.depth >= dip.peak) {
      dip.peak = dip.depth;
    } else {
      rising = false;
      if (dip.depth <= dip.low) {
        dip.low = dip.depth;
        dip.back = dip.end;
      }
    }
  } while (dip.depth && dip.depth <= 2 * gap && dip.end < MAX_CHROMA);

  return dip;
};

/**
 * The right edge of the square: the chroma where the color leaves the gamut, walking out from
 * grey at this lightness and hue.
 *
 * For some sRGB blues (hues near 264°, including `#0000ff` and the whole `#0000xx` axis) the
 * red channel dips below 0 just past the first exit and then comes back: by 0.0007 in linear
 * light at `#0000ff`, and by up to 0.0012 (~4 of 255 steps after gamma) where the edge stops
 * inside a dip. Stopping at the first exit would make pure blue unreachable. So the edge
 * looks past it: the closer the color comes back to the gamut after the dip, the
 * further the edge moves from the first exit towards the point where it comes back. The move is
 * gradual, so the edge doesn't jump as the hue changes. Colors in such a dip are outside sRGB by
 * less than twice the gap (`gapAt`); everything else is inside.
 */
export const maxChroma = (l: number, h: number, gamut: OklchGamut): number => {
  if (l <= 0 || l >= 1) return 0;

  const rgb = channels(l, h, gamut);
  const gap = gapAt(l);
  let edge = firstExit(rgb, 0);

  while (edge < MAX_CHROMA) {
    const dip = walkDip(rgb, edge, gap);

    // Back inside: go on to the end of the next range
    if (!dip.depth && dip.end < MAX_CHROMA) {
      edge = firstExit(rgb, dip.end);
      continue;
    }

    // How far the color came back after the dip: 1 once it is down to a quarter of the dip's
    // depth, 0 while it is above three quarters (in between, the edge slides, so it never jumps)
    const cameBack = clamp(1.5 - (2 * dip.low) / dip.peak);
    // How shallow the dip was: 1 up to the gap, 0 from twice the gap
    const shallow = clamp(2 - dip.peak / gap);
    // Both move the edge towards `back`
    const weight = cameBack * shallow;
    if (!weight) return edge;

    // `back` is on a 1e-4 grid: find the lowest point between its neighbours
    const lowest = argMin((x) => violation(rgb, x), dip.back - 1e-4, dip.back + 1e-4);
    return edge + (lowest - edge) * weight;
  }

  return edge;
};

/** The lightness and chroma of the most vivid color of a hue */
export const cusp = (h: number, gamut: OklchGamut): [number, number] => {
  // A coarse scan first, then the exact peak around the best sample
  let best = 0.5;
  let bestChroma = 0;
  for (let l = 0.2; l < 1; l += 0.02) {
    const c = maxChroma(l, h, gamut);
    if (c > bestChroma) {
      best = l;
      bestChroma = c;
    }
  }

  const from = Math.max(0, best - 0.02);
  const to = Math.min(1, best + 0.02);
  const l = argMin((x) => -maxChroma(x, h, gamut), from, to);
  return [l, maxChroma(l, h, gamut)];
};
