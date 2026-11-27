import { round } from "./round";
import { RAD, cusp, maxChroma } from "./oklchGamut";
import { oklchString } from "./oklch";
import { OklchGamut } from "../types";

// The CSS gradients of the OKLCH pickers: the square's layers and the hue bar

const lerp = (a: number, b: number, t: number): number => a + t * (b - a);

// A gradient stop position: 0.25 → "25%"
const percent = (t: number): string => `${round(t * 100, 3)}%`;

/**
 * Splits `[0, 1]` until a function of it is a straight line within `tolerance` on every piece,
 * checking each piece at its quarter points so that a corner sitting off-centre is not missed.
 * Corners (a cusp, a jump between two branches of the gamut) end up as hair-thin pieces.
 * Returns the points and the values there.
 */
const splitByCurvature = <V>(
  value: (t: number) => V,
  distance: (expected: V, actual: V) => number,
  interpolate: (a: V, b: V, t: number) => V,
  tolerance: number
): [number[], V[]] => {
  const points = [0];
  const values = [value(0)];

  const split = (t0: number, v0: V, t1: number, v1: V, depth: number) => {
    const bent = [0.25, 0.5, 0.75].some(
      (t) => distance(interpolate(v0, v1, t), value(lerp(t0, t1, t))) > tolerance
    );

    // At least 16 pieces, so that a corner between two straight stretches is not missed, and at
    // most 2¹⁴
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

// Where each layer of the square is fully opaque, as a share of the maximal chroma.
// Browsers blend layers in the display's gamma space, not in OKLab, so the square is drawn
// piecewise between these chromas; the pieces crowd towards the vivid edge, where that space
// bends the most. Max measured error: ΔE_OK ≈ 0.0044 in sRGB and P3
const LAYER_SHARES = [0, 0.36, 0.64, 0.84, 0.96, 1];

/** One layer of the square: its gradient, and the mask it fades in by (none for the first one) */
export interface SquareLayer {
  background: string;
  mask?: string;
}

// The last hue drawn per gamut: dragging the hue slider asks for a new hue on every move
const layerCache: Partial<Record<OklchGamut, { hue: number; layers: SquareLayer[] }>> = {};

/**
 * The square's layers at a hue. Each one is a vertical gradient from white to black at a share
 * of the edge's chroma, with stops that follow the gamut edge closely enough that a straight line
 * between two stops is never more than 0.0004 of chroma off the edge. It fades in from the left
 * where the previous layer is fully opaque
 */
export const squareLayers = (h: number, gamut: OklchGamut): SquareLayer[] => {
  const cached = layerCache[gamut];
  if (cached && cached.hue === h) return cached.layers;

  // `y` goes down the square, from white (0) to black (1); `edges` are the chromas of the edge
  const [ys, edges] = splitByCurvature(
    (y) => maxChroma(1 - y, h, gamut),
    (a, b) => Math.abs(a - b),
    lerp,
    0.0004
  );

  const layers = LAYER_SHARES.map((share, i) => {
    const stops = ys.map((y, j) => `${oklchString(1 - y, edges[j] * share, h)} ${percent(y)}`);
    const background = `linear-gradient(to bottom in oklab, ${stops.join(", ")})`;
    if (!i) return { background };

    const from = percent(LAYER_SHARES[i - 1]);
    const mask = `linear-gradient(to right, transparent ${from}, #000 ${percent(share)})`;
    return { background, mask };
  });

  layerCache[gamut] = { hue: h, layers };
  return layers;
};

// The hue bar's lightness is sampled every 4°: 90 samples around the circle
const HUE_STEP = 4;
const HUE_SAMPLES = 90;
// Smoothed over ±7 samples: ±28°
const SMOOTHING = 7;

// The hue bar's lightness table (see `hueColor`), per gamut
const hueLightness: Partial<Record<OklchGamut, number[]>> = {};

// The cusps' lightness at every sample, smoothed with a triangular window
const smoothCuspLightness = (gamut: OklchGamut): number[] => {
  const cusps: number[] = [];
  for (let i = 0; i < HUE_SAMPLES; i++) cusps.push(cusp(i * HUE_STEP, gamut)[0]);

  return cusps.map((_, i) => {
    let sum = 0;
    let weights = 0;
    for (let j = -SMOOTHING; j <= SMOOTHING; j++) {
      const weight = SMOOTHING + 1 - Math.abs(j);
      // The hue circle wraps around
      sum += cusps[(i + j + HUE_SAMPLES) % HUE_SAMPLES] * weight;
      weights += weight;
    }
    return sum / weights;
  });
};

/**
 * The color of a hue on the hue bar. Not exactly the most vivid color of the hue (its cusp): at
 * the corners of the gamut (pure red, green, blue) the cusp's lightness changes so fast that the
 * bar shows a hard step. So the lightness is the cusp's lightness smoothed over ±28° of hue, and
 * the chroma is the highest one at that lightness. The bar is free of steps and nearly as vivid
 * as the cusps themselves.
 */
export const hueColor = (h: number, gamut: OklchGamut): [number, number] => {
  let table = hueLightness[gamut];
  if (!table) table = hueLightness[gamut] = smoothCuspLightness(gamut);

  // Between two samples of the table; the hue circle wraps around
  const t = (((h % 360) + 360) % 360) / HUE_STEP;
  const i = Math.floor(t);
  const l = lerp(table[i], table[(i + 1) % HUE_SAMPLES], t - i);
  return [l, maxChroma(l, h, gamut)];
};

// The color of the hue bar at `t` (0 to 1) as OKLab, for measuring distances
const hueBarLab = (t: number, gamut: OklchGamut): number[] => {
  const h = t * 360;
  const [l, c] = hueColor(h, gamut);
  return [l, c * Math.cos(h * RAD), c * Math.sin(h * RAD)];
};

const hueCache: Partial<Record<OklchGamut, string>> = {};

/**
 * The hue bar: `hueColor` of every hue, with stops placed so that the bar is within ΔE_OK 0.004
 * of it everywhere
 */
export const hueGradient = (gamut: OklchGamut): string => {
  const cached = hueCache[gamut];
  if (cached) return cached;

  const [points, colors] = splitByCurvature(
    (t) => hueBarLab(t, gamut),
    (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]),
    (a, b, t) => a.map((v, i) => lerp(v, b[i], t)),
    0.004
  );

  const stops = points.map((t, i) => {
    const [l, a, b] = colors[i].map((v) => round(v, 5));
    return `oklab(${l} ${a} ${b}) ${percent(t)}`;
  });

  const gradient = `linear-gradient(to right in oklab, ${stops.join(", ")})`;
  hueCache[gamut] = gradient;
  return gradient;
};
