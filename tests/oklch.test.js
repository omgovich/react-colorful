import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import {
  OklchColorPicker,
  OklchaColorPicker,
  OklchStringColorPicker,
  OklchaStringColorPicker,
} from "../src";
import {
  cusp,
  formatOklch,
  formatOklcha,
  hueGradient,
  inGamut,
  layerMask,
  maxChroma,
  oklchaToState,
  parseOklcha,
  squareLayers,
  stateToOklcha,
} from "../src/utils/oklch";

afterEach(cleanup);

// Fix to pass `pageX` and `pageY`
// See https://github.com/testing-library/react-testing-library/issues/268
class FakeMouseEvent extends MouseEvent {
  constructor(type, values = {}) {
    super(type, { buttons: 1, bubbles: true, ...values });
    Object.assign(this, { pageX: values.pageX || 0, pageY: values.pageY || 0 });
  }
}

Object.defineProperties(HTMLElement.prototype, {
  getBoundingClientRect: {
    get: () => () => ({ left: 5, top: 5, width: 100, height: 100 }),
  },
});

// A deterministic stand-in for `Math.random`
const random = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

describe("gamut", () => {
  it("Keeps white and black in both gamuts", () => {
    for (const gamut of ["srgb", "p3"]) {
      expect(inGamut(1, 0, 0, gamut)).toBe(true);
      expect(inGamut(0, 0, 0, gamut)).toBe(true);
      expect(maxChroma(1, 90, gamut)).toBe(0);
      expect(maxChroma(0, 90, gamut)).toBe(0);
    }
    // Just below white the P3 gamut is a sliver, not nothing
    expect(maxChroma(0.99999998, 90, "p3")).toBeGreaterThan(0);
  });

  it("Finds the sRGB primaries at the cusps of their hues", () => {
    // #f00 is oklch(0.62796 0.25768 29.234)
    const [l, c] = cusp(29.234, "srgb");
    expect(l).toBeCloseTo(0.628, 2);
    expect(c).toBeCloseTo(0.2577, 3);
  });

  it("Reaches further in P3 than in sRGB", () => {
    expect(maxChroma(0.6, 145, "p3")).toBeGreaterThan(maxChroma(0.6, 145, "srgb"));
  });

  it("Stops at the first exit from the gamut", () => {
    // At this lightness and hue sRGB holds two ranges of chroma, [0, .2694] and [.3090, .3131];
    // the edge of the square is the end of the first one
    const edge = maxChroma(0.452013718, 264.1, "srgb");
    expect(edge).toBeCloseTo(0.2694, 4);
    expect(inGamut(0.452013718, 0.31, 264.1, "srgb")).toBe(true);
  });

  it("Keeps every chroma up to the edge in the gamut", () => {
    const next = random(42);
    for (let i = 0; i < 300; i++) {
      const gamut = i % 2 ? "p3" : "srgb";
      const l = next();
      const h = next() * 360;
      const edge = maxChroma(l, h, gamut);
      for (let t = 0; t <= 1; t += 0.05) expect(inGamut(l, edge * t, h, gamut)).toBe(true);
      if (edge > 0) expect(inGamut(l, edge + 1e-6, h, gamut)).toBe(false);
    }
  });
});

describe("state", () => {
  it("Reopens every color it emits at the same spot", () => {
    const next = random(7);
    for (let i = 0; i < 1000; i++) {
      const gamut = i % 2 ? "p3" : "srgb";
      // Every tenth hue sits by 264.2°, where the sRGB edge jumps between two branches of blue
      const h = i % 10 ? next() * 360 : 264.15 + next() * 0.15;
      const color = stateToOklcha({ l: next(), x: next(), h, a: next() }, gamut);

      expect(inGamut(color.l, color.c, color.h, gamut)).toBe(true);
      expect(color.c).toBeLessThanOrEqual(maxChroma(color.l, color.h, gamut));
      expect(stateToOklcha(oklchaToState(color, gamut), gamut)).toEqual(color);
    }
  });

  it("Shows a color outside the gamut at the edge", () => {
    expect(oklchaToState({ l: 0.6, c: 0.4, h: 145, a: 1 }, "srgb").x).toBe(1);
  });

  it("Keeps the hue of a grey color", () => {
    expect(oklchaToState({ l: 0.5, c: 0, h: 200, a: 1 }, "srgb")).toEqual({
      l: 0.5,
      x: 0,
      h: 200,
      a: 1,
    });
  });

  it("Emits no chroma at black and white", () => {
    expect(stateToOklcha({ l: 1, x: 0.8, h: 30, a: 1 }, "srgb").c).toBe(0);
    expect(stateToOklcha({ l: 0, x: 0.8, h: 30, a: 1 }, "p3").c).toBe(0);
  });
});

describe("strings", () => {
  it("Parses OKLCH strings", () => {
    const test = (input, output) => expect(parseOklcha(input)).toEqual(output);

    test("oklch(0.6 0.15 260)", { l: 0.6, c: 0.15, h: 260, a: 1 });
    test("oklch(60% 0.15 260)", { l: 0.6, c: 0.15, h: 260, a: 1 });
    test("OKLCH(0.6 50% 260deg)", { l: 0.6, c: 0.2, h: 260, a: 1 });
    test("oklch(.6 .15 0.5turn / 0.5)", { l: 0.6, c: 0.15, h: 180, a: 0.5 });
    test("oklch(0.6 0.15 -90 / 50%)", { l: 0.6, c: 0.15, h: 270, a: 0.5 });
    test("oklch(1.5 -1 20)", { l: 1, c: 0, h: 20, a: 1 });
    test("rgb(0, 0, 0)", { l: 0, c: 0, h: 0, a: 1 });
  });

  it("Formats OKLCH strings", () => {
    expect(formatOklch({ l: 0.6, c: 0.1234, h: 260.5, a: 0.5 })).toBe("oklch(0.6 0.1234 260.5)");
    expect(formatOklcha({ l: 0.6, c: 0.1234, h: 260.5, a: 0.5 })).toBe(
      "oklch(0.6 0.1234 260.5 / 0.5)"
    );
    expect(formatOklcha({ l: 0.6, c: 0.1234, h: 260.5, a: 1 })).toBe(
      "oklch(0.6 0.1234 260.5 / 1)"
    );
  });
});

describe("drawing", () => {
  it("Draws the square as six masked layers", () => {
    const layers = squareLayers(260, "srgb");
    expect(layers).toHaveLength(6);
    for (const layer of layers) expect(layer).toMatch(/^linear-gradient\(to bottom in oklab, /);
    expect(layerMask(0)).toBeUndefined();
    expect(layerMask(5)).toBe("linear-gradient(to right, transparent 96%, #000 100%)");
  });

  it("Draws the hue bar from cusp colors", () => {
    expect(hueGradient("srgb")).toMatch(/^linear-gradient\(to right in oklab, oklab\(/);
    expect(hueGradient("p3")).not.toBe(hueGradient("srgb"));
  });
});

describe("pickers", () => {
  const square = (container) =>
    container.querySelector(".react-colorful__saturation .react-colorful__interactive");

  it("Renders the square, the hue and the alpha sliders", () => {
    const { container } = render(<OklchaColorPicker />);
    expect(container.querySelector(".react-colorful__saturation")).not.toBeNull();
    expect(container.querySelector(".react-colorful__hue")).not.toBeNull();
    expect(container.querySelector(".react-colorful__alpha")).not.toBeNull();
    expect(container.querySelector(".react-colorful__last-control").className).toContain(
      "react-colorful__alpha"
    );
  });

  it("Doesn't trigger `onChange` after mounting, even for a color outside the gamut", () => {
    const handleChange = jest.fn();
    render(<OklchColorPicker color={{ l: 0.6, c: 0.4, h: 145 }} onChange={handleChange} />);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("Doesn't trigger `onChange` when the gamut changes", () => {
    const handleChange = jest.fn();
    const color = { l: 0.6, c: 0.15, h: 145 };
    const { rerender } = render(<OklchColorPicker color={color} onChange={handleChange} />);
    rerender(<OklchColorPicker color={color} gamut="p3" onChange={handleChange} />);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("Emits an OKLCH color in the gamut after a mouse interaction", () => {
    const handleChange = jest.fn();
    const { container } = render(
      <OklchColorPicker color={{ l: 0.6, c: 0.1, h: 145 }} onChange={handleChange} />
    );

    fireEvent(square(container), new FakeMouseEvent("mousedown", { pageX: 105, pageY: 30 }));

    const [color] = handleChange.mock.calls[0];
    expect(Object.keys(color)).toEqual(["l", "c", "h"]);
    expect(color.l).toBe(0.75);
    expect(color.h).toBe(145);
    // The right edge: the highest chroma of this lightness and hue, rounded inside the gamut
    expect(color.c).toBeCloseTo(maxChroma(0.75, 145, "srgb"), 3);
    expect(color.c).toBeLessThanOrEqual(maxChroma(0.75, 145, "srgb"));
  });

  it("Lets P3 reach a higher chroma", () => {
    const pick = (gamut) => {
      const handleChange = jest.fn();
      const { container } = render(
        <OklchStringColorPicker color="oklch(0.6 0.1 145)" gamut={gamut} onChange={handleChange} />
      );
      fireEvent(square(container), new FakeMouseEvent("mousedown", { pageX: 105, pageY: 45 }));
      cleanup();
      return parseOklcha(handleChange.mock.calls[0][0]).c;
    };

    expect(pick("p3")).toBeGreaterThan(pick("srgb"));
  });

  it("Changes lightness and chroma with arrow keys", () => {
    const handleChange = jest.fn((color) => color);
    const { container } = render(
      <OklchStringColorPicker color="oklch(0.6 0 200)" onChange={handleChange} />
    );

    square(container).focus();
    fireEvent.keyDown(document.activeElement, { keyCode: 38 }); // up: lighter
    fireEvent.keyDown(document.activeElement, { keyCode: 39 }); // right: more chroma

    expect(handleChange).toHaveReturnedTimes(2);
    const { l, c, h } = parseOklcha(handleChange.mock.results[1].value);
    expect(l).toBeCloseTo(0.65, 5);
    expect(c).toBeGreaterThan(0);
    // A grey color keeps its hue
    expect(h).toBe(200);
  });

  it("Changes alpha", () => {
    const handleChange = jest.fn();
    const { container } = render(
      <OklchaStringColorPicker color="oklch(0.6 0.1 145 / 1)" onChange={handleChange} />
    );
    const alpha = container.querySelector(".react-colorful__alpha .react-colorful__interactive");

    fireEvent(alpha, new FakeMouseEvent("mousedown", { pageX: 55, pageY: 0 }));

    expect(handleChange).toHaveBeenCalledWith("oklch(0.6 0.1 145 / 0.5)");
  });
});
