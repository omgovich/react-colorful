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

// OKLab → LMS (cube roots) and LMS → linear sRGB
const LAB_TO_LMS = [
  [0.3963377774, 0.2158037573],
  [-0.1055613458, -0.0638541728],
  [-0.0894841775, -1.291485548],
];
const LMS_TO_RGB = [
  [4.0767416621, -3.3077115913, 0.2309699292],
  [-1.2684380046, 2.6097574011, -0.3413193965],
  [-0.0041960863, -0.7034186147, 1.707614701],
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

// Absorbs float noise only: white comes out as 1.0000000000000002
const outside = (value: number) => value < -1e-9 || value > 1 + 1e-9;

/** Whether an OKLCH color fits the gamut */
export const inGamut = (l: number, c: number, h: number, gamut: OklchGamut): boolean =>
  !channels(l, h, gamut).some((channel) => outside(evaluate(channel, c)));

/**
 * The right edge of the square: the chroma where the color first leaves the gamut, walking
 * out from grey at this lightness and hue.
 *
 * It is the FIRST exit on purpose. For some blues the gamut at a fixed lightness and hue is
 * two separate ranges of chroma; going up to the far one would leave out-of-gamut colors
 * inside the square. So each channel's cubic is split at its turning points into monotonic
 * pieces, and the earliest piece that crosses 0 or 1 is bisected.
 */
export const maxChroma = (l: number, h: number, gamut: OklchGamut): number => {
  if (l <= 0 || l >= 1) return 0;

  let edge = MAX_CHROMA;

  for (const channel of channels(l, h, gamut)) {
    const [, b, c, d] = channel;
    // Turning points: the roots of b + 2c·x + 3d·x² that lie before the current edge
    const cuts = [0];
    const disc = 4 * c * c - 12 * b * d;
    if (Math.abs(d) > 1e-12) {
      if (disc > 0) {
        const q = Math.sqrt(disc);
        cuts.push(...[(-2 * c - q) / (6 * d), (-2 * c + q) / (6 * d)].sort((x, y) => x - y));
      }
    } else if (Math.abs(c) > 1e-12) cuts.push(-b / (2 * c));
    const pieces = cuts.filter((x) => x >= 0 && x < edge).concat(edge);

    for (let i = 0; i + 1 < pieces.length; i++) {
      let lo = pieces[i];
      let hi = pieces[i + 1];
      if (outside(evaluate(channel, lo))) {
        edge = lo;
        break;
      }
      if (!outside(evaluate(channel, hi))) continue;
      for (let step = 0; step < 40; step++) {
        const mid = (lo + hi) / 2;
        outside(evaluate(channel, mid)) ? (hi = mid) : (lo = mid);
      }
      edge = lo;
      break;
    }
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

const hueCache: Record<string, string> = {};

/**
 * The hue bar: the most vivid color of every hue. Stops are placed so that the bar is within
 * ΔE_OK 0.004 of each hue's actual cusp color
 */
export const hueGradient = (gamut: OklchGamut): string => {
  if (!hueCache[gamut]) {
    const [points, colors] = splitByCurvature(
      (t) => toLab([...cusp(t * 360, gamut), t * 360]),
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
  const edge = maxChroma(l, h, gamut);
  return { l: clamp(l), x: edge ? clamp(c / edge) : 0, h: parseHue(String(h)), a };
};

/**
 * Turns the picker's state into a color. L and H are rounded first, and C is then clamped to
 * the edge for the ROUNDED lightness and hue: the color always reopens at the same spot. (Near
 * 264.2° in sRGB rounding the hue alone can move the edge from a far branch of blue to the near
 * one.) C is rounded to the nearest step, not down: `c → x → c` drifts by float noise, and
 * 0.1 must come back as 0.1, not 0.0999. Only a step past the edge is taken back.
 */
export const stateToOklcha = ({ l, x, h, a }: OklchState, gamut: OklchGamut): OklchaColor => {
  const lr = round(l, 4);
  const hr = round(h, 2);
  const edge = maxChroma(lr, hr, gamut);
  const c = round(Math.min(x * maxChroma(l, h, gamut), edge), 4);
  return {
    l: lr,
    c: c > edge ? round(c - 1e-4, 4) : c,
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
  // second one tries every split of a long run of digits and turns quadratic
  const match = /oklch\(\s*(-?(?:\d+\.|\.)?\d+)(%)?\s+(-?(?:\d+\.|\.)?\d+)(%)?\s+(-?(?:\d+\.|\.)?\d+)(deg|rad|grad|turn)?\s*(?:\/\s*(-?(?:\d+\.|\.)?\d+)(%)?\s*)?\)/i.exec(
    value
  );

  if (!match) return { l: 0, c: 0, h: 0, a: 1 };

  return {
    l: clamp(Number(match[1]) / (match[2] ? 100 : 1)),
    c: Math.max(0, Number(match[3]) * (match[4] ? 0.004 : 1)),
    h: parseHue(match[5], match[6]),
    a: match[7] === undefined ? 1 : clamp(Number(match[7]) / (match[8] ? 100 : 1)),
  };
};

export const formatOklch = ({ l, c, h }: OklchaColor): string => oklchString(l, c, h);

export const formatOklcha = ({ l, c, h, a }: OklchaColor): string => oklchString(l, c, h, a);
