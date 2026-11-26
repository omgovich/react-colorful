import { clamp } from "./clamp";
import { round } from "./round";
import { parseHue } from "./convert";
import { OklchaColor, OklchGamut, OklchState } from "../types";

// OKLCH pickers. The square shows lightness (top to bottom) against chroma as a share of the
// highest chroma that lightness and hue reach in the gamut (left to right). That keeps the
// square solid at every hue and every point in it inside the gamut.
// Math: https://bottosson.github.io/posts/oklab/

// π / 180 as a literal: a top-level `Math.PI / 180` would stay in every picker's bundle
const RAD = 0.017453292519943295;

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

type Cubic = number[];

// Applies a 3×3 matrix to three vectors of coefficients
const mix = (matrix: number[][], rows: Cubic[]): Cubic[] =>
  matrix.map((m) =>
    rows[0].map((_, i) => m[0] * rows[0][i] + m[1] * rows[1][i] + m[2] * rows[2][i])
  );

/**
 * At a fixed lightness and hue every linear RGB channel is a cubic in chroma.
 * Returns the coefficients `[c⁰, c¹, c², c³]` of the three channels in the given gamut.
 */
const channels = (l: number, h: number, gamut: OklchGamut): Cubic[] => {
  const cos = Math.cos(h * RAD);
  const sin = Math.sin(h * RAD);
  // (l + k·C)³ for each LMS component
  const lms = LAB_TO_LMS.map(([u, v]) => {
    const k = u * cos + v * sin;
    return [l * l * l, 3 * l * l * k, 3 * l * k * k, k * k * k];
  });
  const rgb = mix(LMS_TO_RGB, lms);
  return gamut === "p3" ? mix(RGB_TO_P3, rgb) : rgb;
};

const evaluate = ([a, b, c, d]: Cubic, x: number) => a + x * (b + x * (c + x * d));

// How far a color is from the gamut: 0 inside, else how far its worst channel is past 0 or 1.
// Anything up to 1e-9 is float noise: white comes out as 1.0000000000000002
const violation = (rgb: Cubic[], c: number) => {
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

/**
 * The chroma, from `from` on, where the color first leaves the gamut. Each channel's cubic is
 * split at its turning points into monotonic pieces, and the earliest piece that crosses 0 or 1
 * is bisected.
 */
const firstExit = (rgb: Cubic[], from: number): number => {
  let edge = MAX_CHROMA;

  for (const channel of rgb) {
    const [, b, c, d] = channel;
    const outside = (x: number) => violation([channel], x) > 0;
    // Turning points: the roots of b + 2c·x + 3d·x² that lie before the current edge
    const cuts = [from];
    const disc = 4 * c * c - 12 * b * d;
    if (Math.abs(d) > 1e-12) {
      if (disc > 0) {
        const q = Math.sqrt(disc);
        cuts.push(...[(-2 * c - q) / (6 * d), (-2 * c + q) / (6 * d)].sort((x, y) => x - y));
      }
    } else if (Math.abs(c) > 1e-12) cuts.push(-b / (2 * c));
    const pieces = cuts.filter((x) => x >= from && x < edge).concat(edge);

    for (let i = 0; i + 1 < pieces.length; i++) {
      let lo = pieces[i];
      let hi = pieces[i + 1];
      if (outside(lo)) {
        edge = lo;
        break;
      }
      if (!outside(hi)) continue;
      for (let step = 0; step < 40; step++) {
        const mid = (lo + hi) / 2;
        outside(mid) ? (hi = mid) : (lo = mid);
      }
      edge = lo;
      break;
    }
  }

  return edge;
};

// How deep a dip past the first exit the square's edge steps over, in a linear RGB channel, at
// most: fully up to the gap, fading out up to twice the gap so that the edge never jumps
const GAP = 1e-3;
// The blue dip deepens with lightness as l³ (0.0007 at #0000ff, l = 0.452), so the gap follows
// l³ too: a fixed gap would step over the far deeper-looking dips of dark colors, where nothing
// of the gamut lies behind them
const gapAt = (l: number) => Math.min(GAP, 0.011 * l * l * l);

/**
 * The right edge of the square: the chroma where the color leaves the gamut, walking out from
 * grey at this lightness and hue.
 *
 * For some sRGB blues (hues near 264°, including `#0000ff` and the whole `#0000xx` axis) the
 * red channel dips below 0 just past the first exit and then comes back, by at most 0.0007 in
 * linear light (up to ~3 of 255 steps after gamma). Stopping at the first exit would make pure
 * blue unreachable. So
 * the edge looks past it: the closer the color comes back to the gamut after the dip, the
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
    // Walk past the edge while the color stays within the gap of the gamut, noting the deepest
    // point (`peak`) and the lowest point after it (`low` at chroma `back`)
    let c = edge;
    let depth;
    let peak = 0;
    let low = Infinity;
    let back = edge;
    do {
      c += 1e-4;
      depth = violation(rgb, c);
      // The first rise sets the peak; after that only the lowest point matters
      if (low === Infinity && depth >= peak) peak = depth;
      else if (depth <= low) [low, back] = [depth, c];
    } while (depth && depth <= 2 * gap && c < MAX_CHROMA);
    // Back inside: go on to the end of the next range
    if (!depth && c < MAX_CHROMA) {
      edge = firstExit(rgb, c);
      continue;
    }
    // How far the color came back after the dip (0 not at all, 1 all the way to the gamut) and
    // how shallow the dip was (1 up to the gap, 0 from twice the gap) move the edge towards `back`
    const weight = clamp((0.75 - low / peak) / 0.5) * clamp(2 - peak / gap);
    if (!weight) return edge;
    // `back` is on a 1e-4 grid: find the lowest point between its neighbours
    let lo = back - 1e-4;
    let hi = back + 1e-4;
    for (let step = 0; step < 30; step++) {
      const a = lo + 0.381966 * (hi - lo);
      const b = hi - 0.381966 * (hi - lo);
      violation(rgb, a) < violation(rgb, b) ? (hi = b) : (lo = a);
    }
    return edge + ((lo + hi) / 2 - edge) * weight;
  }

  return edge;
};

/** The lightness and chroma of the most vivid color of a hue */
export const cusp = (h: number, gamut: OklchGamut): [number, number] => {
  let best = 0.5;
  let bestChroma = 0;
  for (let l = 0.2; l < 1; l += 0.02) {
    const c = maxChroma(l, h, gamut);
    if (c > bestChroma) [best, bestChroma] = [l, c];
  }
  // Golden-section search around the best sample
  let lo = Math.max(0, best - 0.02);
  let hi = Math.min(1, best + 0.02);
  for (let step = 0; step < 30; step++) {
    const a = lo + 0.381966 * (hi - lo);
    const b = hi - 0.381966 * (hi - lo);
    maxChroma(a, h, gamut) > maxChroma(b, h, gamut) ? (hi = b) : (lo = a);
  }
  const l = (lo + hi) / 2;
  return [l, maxChroma(l, h, gamut)];
};

export const oklchString = (l: number, c: number, h: number, a?: number): string =>
  `oklch(${round(l, 5)} ${round(c, 5)} ${round(h, 3)}${
    a === undefined ? "" : ` / ${round(a, 3)}`
  })`;

/**
 * Splits `[0, 1]` until a function of it is a straight line within `tolerance` on every piece,
 * checking each piece at its quarter points so that a corner sitting off-centre is not missed.
 * Corners (a cusp, a jump between two branches of the gamut) end up as hair-thin pieces.
 * Returns the points and the values there.
 */
const splitByCurvature = <V>(
  value: (t: number) => V,
  distance: (expected: V, actual: V) => number,
  lerp: (a: V, b: V, t: number) => V,
  tolerance: number
): [number[], V[]] => {
  const points = [0];
  const values = [value(0)];

  const split = (t0: number, v0: V, t1: number, v1: V, depth: number) => {
    const bent = [0.25, 0.5, 0.75].some(
      (t) => distance(lerp(v0, v1, t), value(t0 + t * (t1 - t0))) > tolerance
    );
    if (depth < 4 || (depth < 14 && bent)) {
      const tm = (t0 + t1) / 2;
      const vm = value(tm);
      split(t0, v0, tm, vm, depth + 1);
      split(tm, vm, t1, v1, depth + 1);
    } else {
      points.push(t1);
      values.push(v1);
    }
  };

  split(0, values[0], 1, value(1), 0);
  return [points, values];
};

const lerpNumber = (a: number, b: number, t: number) => a + t * (b - a);

// Where each layer of the square is fully opaque, as a share of the maximal chroma.
// Browsers blend layers in the display's gamma space, not in OKLab, so the square is drawn
// piecewise between these chromas; the pieces crowd towards the vivid edge, where that space
// bends the most. Max measured error: ΔE_OK ≈ 0.0044 in sRGB and P3
const LAYERS = [0, 0.36, 0.64, 0.84, 0.96, 1];

// The last hue drawn per gamut: dragging the hue slider asks for a new hue on every move
const layerCache: Record<string, [number, string[]]> = {};

/**
 * Backgrounds of the square's layers at a hue: vertical gradients from white to black whose
 * stops follow the gamut edge closely enough that a straight line between two stops is never
 * more than 0.0004 of chroma off the edge
 */
export const squareLayers = (h: number, gamut: OklchGamut): string[] => {
  const cached = layerCache[gamut];
  if (cached && cached[0] === h) return cached[1];
  {
    const [points, chromas] = splitByCurvature(
      (y) => maxChroma(1 - y, h, gamut),
      (a, b) => Math.abs(a - b),
      lerpNumber,
      0.0004
    );
    layerCache[gamut] = [
      h,
      LAYERS.map(
        (share) =>
          `linear-gradient(to bottom in oklab, ${points
            .map((y, i) => `${oklchString(1 - y, chromas[i] * share, h)} ${round(y * 100, 3)}%`)
            .join(", ")})`
      ),
    ];
  }
  return layerCache[gamut][1];
};

/** Where layer `i` of the square fades in (a function: top-level calls defeat tree-shaking) */
export const layerMask = (i: number): string | undefined =>
  i
    ? `linear-gradient(to right, transparent ${LAYERS[i - 1] * 100}%, #000 ${LAYERS[i] * 100}%)`
    : undefined;

const toLab = ([l, c, h]: number[]) => [l, c * Math.cos(h * RAD), c * Math.sin(h * RAD)];

// The hue bar's lightness at every 4° (see `hueColor`), per gamut
const hueLightness: Partial<Record<OklchGamut, number[]>> = {};

/**
 * The color of a hue on the hue bar. Not exactly the most vivid color of the hue (its cusp): at
 * the corners of the gamut (pure red, green, blue) the cusp's lightness changes so fast that the
 * bar shows a hard step. So the lightness is the cusp's lightness smoothed over ±28° of hue, and
 * the chroma is the highest one at that lightness. The bar is free of steps and nearly as vivid
 * as the cusps themselves.
 */
export const hueColor = (h: number, gamut: OklchGamut): [number, number] => {
  let table = hueLightness[gamut];
  if (!table) {
    const cusps: number[] = [];
    for (let i = 0; i < 90; i++) cusps.push(cusp(i * 4, gamut)[0]);
    // A triangular window over ±28° (±7 samples), wrapping around the hue circle
    table = hueLightness[gamut] = cusps.map((_, i) => {
      let sum = 0;
      let weights = 0;
      for (let j = -7; j <= 7; j++) {
        const weight = 8 - Math.abs(j);
        sum += cusps[(i + j + 90) % 90] * weight;
        weights += weight;
      }
      return sum / weights;
    });
  }
  const t = (((h % 360) + 360) % 360) / 4;
  const i = Math.floor(t);
  const l = lerpNumber(table[i], table[(i + 1) % 90], t - i);
  return [l, maxChroma(l, h, gamut)];
};

const hueCache: Record<string, string> = {};

/**
 * The hue bar: `hueColor` of every hue, with stops placed so that the bar is within ΔE_OK 0.004
 * of it everywhere
 */
export const hueGradient = (gamut: OklchGamut): string => {
  if (!hueCache[gamut]) {
    const [points, colors] = splitByCurvature(
      (t) => toLab([...hueColor(t * 360, gamut), t * 360]),
      (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]),
      (a, b, t) => a.map((v, i) => lerpNumber(v, b[i], t)),
      0.004
    );
    hueCache[gamut] = `linear-gradient(to right in oklab, ${points
      .map((t, i) => {
        const [l, a, b] = colors[i];
        return `oklab(${round(l, 5)} ${round(a, 5)} ${round(b, 5)}) ${round(t * 100, 3)}%`;
      })
      .join(", ")})`;
  }
  return hueCache[gamut];
};

/** Turns a color into the picker's state; a color outside the gamut is shown at the edge */
export const oklchaToState = ({ l, c, h, a }: OklchaColor, gamut: OklchGamut): OklchState => {
  // `|| 0` turns NaN (a broken prop) into 0 instead of letting it into the state and styles
  l = clamp(l || 0);
  h = parseHue(String(h || 0));
  const edge = maxChroma(l, h, gamut);
  return { l, x: edge ? clamp(c / edge || 0) : 0, h, a };
};

/**
 * Turns the picker's state into a color. L and H are rounded first, and C is then clamped to
 * the edge for the ROUNDED lightness and hue: the color always reopens at the same spot. (Near
 * 264.2° in sRGB rounding the hue alone can move the edge from a far branch of blue to the near
 * one.) C is rounded to the nearest step, not down: `c → x → c` drifts by float noise, and
 * 0.1 must come back as 0.1, not 0.09999. Only a step past the edge is taken back.
 */
export const stateToOklcha = ({ l, x, h, a }: OklchState, gamut: OklchGamut): OklchaColor => {
  const lr = round(l, 4);
  const hr = round(h, 2);
  const edge = maxChroma(lr, hr, gamut);
  const c = round(Math.min(x * maxChroma(l, h, gamut), edge), 5);
  return {
    l: lr,
    c: c > edge ? round(c - 1e-5, 5) : c,
    h: hr,
    a: round(a, 2),
  };
};

/**
 * Parses `oklch(L C H)` and `oklch(L C H / A)`: L as a number or a percentage, C as a number or
 * a percentage (100% is 0.4, as in CSS), H with an optional angle unit, A as a number or a
 * percentage
 */
export const parseOklcha = (value: string): OklchaColor => {
  // A number is `(?:\d+\.|\.)?\d+` and not `\d*\.?\d+`: both take the same digits, but the
  // second one tries every split of a long run of digits and turns quadratic.
  // `none` is a missing component in CSS, which counts as 0
  const match = /oklch\(\s*(none|[-+]?(?:\d+\.|\.)?\d+(?:e[-+]?\d+)?)(%)?\s+(none|[-+]?(?:\d+\.|\.)?\d+(?:e[-+]?\d+)?)(%)?\s+(none|[-+]?(?:\d+\.|\.)?\d+(?:e[-+]?\d+)?)(deg|rad|grad|turn)?\s*(?:\/\s*(none|[-+]?(?:\d+\.|\.)?\d+(?:e[-+]?\d+)?)(%)?\s*)?\)/i.exec(
    value
  );

  if (!match) return { l: 0, c: 0, h: 0, a: 1 };

  const number = (value: string) => Number(value) || 0;

  return {
    l: clamp(number(match[1]) / (match[2] ? 100 : 1)),
    c: Math.max(0, number(match[3]) * (match[4] ? 0.004 : 1)),
    h: parseHue(String(number(match[5])), match[6]),
    a: match[7] === undefined ? 1 : clamp(number(match[7]) / (match[8] ? 100 : 1)),
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
