import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import * as manipulation from "../src/hooks/useColorManipulation";
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
  hueColor,
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

  // The OKLCH coordinates of an sRGB color given as 0..255 channels
  const fromRgb = (...rgb) => {
    const [r, g, b] = rgb.map((x) =>
      (x /= 255) <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
    );
    const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
    const l = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    return [l, Math.hypot(a, bb), ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360];
  };

  it("Reaches pure blue and the whole #0000xx axis", () => {
    // Past the first exit the red channel dips below 0 by under 0.0007 and comes back
    for (let blue = 8; blue <= 255; blue += 8) {
      const [l, c, h] = fromRgb(0, 0, blue);
      expect(maxChroma(l, h, "srgb")).toBeGreaterThan(c - 2e-4);
    }
  });

  it("Reaches every color of the sRGB cube", () => {
    for (let r = 0; r < 256; r += 15)
      for (let g = 0; g < 256; g += 15)
        for (let b = 0; b < 256; b += 15) {
          const [l, c, h] = fromRgb(r, g, b);
          if (l > 0 && l < 1) expect(maxChroma(l, h, "srgb")).toBeGreaterThan(c - 2e-4);
        }
  });

  it("Moves the edge smoothly with the hue, even by the blue dip", () => {
    for (const l of [0.1, 0.27, 0.452]) {
      for (let h = 263.5; h < 264.8; h += 0.001) {
        expect(Math.abs(maxChroma(l, h + 0.001, "srgb") - maxChroma(l, h, "srgb"))).toBeLessThan(
          0.002
        );
      }
    }
  });

  it("Keeps every chroma up to the edge in the gamut", () => {
    const next = random(42);
    for (let i = 0; i < 300; i++) {
      const gamut = i % 2 ? "p3" : "srgb";
      const l = next();
      // Every tenth hue sits by the blue dip
      const h = i % 10 ? next() * 360 : 263.5 + next();
      const edge = maxChroma(l, h, gamut);
      // Strictly inside, except for the blues of the dip: within 0.002 of a channel there
      const tolerance = h > 263 && h < 265 && gamut === "srgb" ? 2e-3 : 0;
      for (let t = 0; t <= 1; t += 0.05)
        expect(inGamut(l, edge * t, h, gamut, tolerance)).toBe(true);
      if (edge > 0 && !tolerance) expect(inGamut(l, edge + 1e-3, h, gamut)).toBe(false);
    }
  });
});

describe("state", () => {
  it("Reopens every color it emits at the same spot", () => {
    const next = random(7);
    for (let i = 0; i < 1000; i++) {
      const gamut = i % 2 ? "p3" : "srgb";
      // Every tenth hue sits by the blue dip of sRGB
      const h = i % 10 ? next() * 360 : 263.5 + next();
      const color = stateToOklcha({ l: next(), x: next(), h, a: next() }, gamut);

      expect(inGamut(color.l, color.c, color.h, gamut, 2e-3)).toBe(true);
      expect(color.c).toBeLessThanOrEqual(maxChroma(color.l, color.h, gamut));
      expect(stateToOklcha(oklchaToState(color, gamut), gamut)).toEqual(color);
    }
  });

  it("Keeps pure blue as it is", () => {
    const color = { l: 0.452, c: 0.3132, h: 264.05, a: 1 };
    expect(stateToOklcha(oklchaToState(color, "srgb"), "srgb")).toEqual(color);
  });

  it("Turns NaN into 0", () => {
    expect(oklchaToState({ l: NaN, c: NaN, h: NaN, a: 1 }, "srgb")).toEqual({
      l: 0,
      x: 0,
      h: 0,
      a: 1,
    });
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
    test("oklch(0.6 0.15 none)", { l: 0.6, c: 0.15, h: 0, a: 1 });
    test("oklch(+0.6 1.5e-1 2e1)", { l: 0.6, c: 0.15, h: 20, a: 1 });
    test("rgb(0, 0, 0)", { l: 0, c: 0, h: 0, a: 1 });
  });

  it("Formats OKLCH strings", () => {
    expect(formatOklch({ l: 0.6, c: 0.1234, h: 260.5, a: 0.5 })).toBe("oklch(0.6 0.1234 260.5)");
    expect(formatOklcha({ l: 0.6, c: 0.1234, h: 260.5, a: 0.5 })).toBe(
      "oklch(0.6 0.1234 260.5 / 0.5)"
    );
    expect(formatOklcha({ l: 0.6, c: 0.1234, h: 260.5, a: 1 })).toBe("oklch(0.6 0.1234 260.5 / 1)");
  });
});

describe("drawing", () => {
  it("Draws the square as six masked layers", () => {
    const shares = [0, 0.36, 0.64, 0.84, 0.96, 1];
    for (const [h, gamut] of [
      [260, "srgb"],
      [145, "p3"],
    ]) {
      const layers = squareLayers(h, gamut);
      expect(layers).toHaveLength(6);
      layers.forEach((layer, i) => {
        expect(layer).toMatch(/^linear-gradient\(to bottom in oklab, /);
        const stops = [...layer.matchAll(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)\) ([\d.]+)%/g)];
        expect(stops.length).toBeGreaterThan(10);
        // Each stop is the layer's share of the edge at that lightness, top to bottom
        for (const [, l, c, hue, y] of stops) {
          expect(Number(l)).toBeCloseTo(1 - y / 100, 4);
          expect(Number(c)).toBeCloseTo(shares[i] * maxChroma(Number(l), h, gamut), 4);
          expect(Number(hue)).toBe(h);
        }
      });
    }
    expect(layerMask(0)).toBeUndefined();
    expect(layerMask(1)).toBe("linear-gradient(to right, transparent 0%, #000 36%)");
    expect(layerMask(5)).toBe("linear-gradient(to right, transparent 96%, #000 100%)");
  });

  it("Draws the hue bar without steps", () => {
    const toLab = (l, c, h) => [
      l,
      c * Math.cos((h * Math.PI) / 180),
      c * Math.sin((h * Math.PI) / 180),
    ];
    for (const gamut of ["srgb", "p3"]) {
      const bar = hueGradient(gamut);
      expect(bar).toMatch(/^linear-gradient\(to right in oklab, oklab\(/);
      // Each stop is the hue's bar color
      const stops = [...bar.matchAll(/oklab\((-?[\d.]+) (-?[\d.]+) (-?[\d.]+)\) ([\d.]+)%/g)];
      for (const [, l, a, b, t] of stops) {
        const h = t * 3.6;
        const expected = toLab(...hueColor(h, gamut), h);
        expect(Math.hypot(l - expected[0], a - expected[1], b - expected[2])).toBeLessThan(1e-4);
      }
      // No hard steps, not even at pure red, green or blue
      let previous = toLab(...hueColor(0, gamut), 0);
      for (let h = 0.25; h <= 360; h += 0.25) {
        const color = toLab(...hueColor(h, gamut), h);
        expect(Math.hypot(...color.map((v, i) => v - previous[i]))).toBeLessThan(0.01);
        previous = color;
      }
    }
    // Yellow stays light enough to look yellow
    expect(hueColor(110, "srgb")[0]).toBeGreaterThan(0.8);
  });
});

describe("pickers", () => {
  const square = (container) =>
    container.querySelector(".react-colorful__saturation .react-colorful__interactive");

  it("Gives the hook the same color model on every render", () => {
    // A new model is a new gamut to the hook: it would redraw the color on every render
    const spy = jest.spyOn(manipulation, "useColorManipulation");
    const color = { l: 0.6, c: 0.1, h: 145 };
    const { rerender } = render(<OklchColorPicker color={color} />);
    rerender(<OklchColorPicker color={{ ...color }} />);
    rerender(<OklchColorPicker color={{ ...color }} gamut="p3" />);
    rerender(<OklchColorPicker color={{ ...color }} gamut="p3" />);
    rerender(<OklchColorPicker color={{ ...color }} />);

    const models = spy.mock.calls.map(([model]) => model);
    spy.mockRestore();
    expect(new Set(models).size).toBe(2);
    // The redraw after a gamut change adds renders, so compare the first and the last one
    expect(models[0]).toBe(models[models.length - 1]);
  });

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

  it("Keeps the picked color when the gamut changes and the parent doesn't pass it back", () => {
    for (const color of [undefined, "oklch(0.5 0.1 30)"]) {
      const handleChange = jest.fn();
      const { container, rerender } = render(
        <OklchStringColorPicker color={color} onChange={handleChange} />
      );
      fireEvent(square(container), new FakeMouseEvent("mousedown", { pageX: 30, pageY: 30 }));
      const picked = parseOklcha(handleChange.mock.calls[0][0]);

      rerender(<OklchStringColorPicker color={color} gamut="p3" onChange={handleChange} />);
      // Moving the hue keeps the lightness: the color wasn't reset to `color` or black
      const hue = container.querySelector(".react-colorful__hue .react-colorful__interactive");
      fireEvent(hue, new FakeMouseEvent("mousedown", { pageX: 55, pageY: 0 }));

      expect(parseOklcha(handleChange.mock.calls[1][0]).l).toBe(picked.l);
      cleanup();
    }
  });

  it("Keeps lightness and the share of chroma when the hue moves", () => {
    const handleChange = jest.fn();
    const color = { l: 0.6, c: 0.1, h: 145 };
    const { container } = render(<OklchColorPicker color={color} onChange={handleChange} />);
    const hue = container.querySelector(".react-colorful__hue .react-colorful__interactive");

    fireEvent(hue, new FakeMouseEvent("mousedown", { pageX: 55, pageY: 0 }));

    const share = 0.1 / maxChroma(0.6, 145, "srgb");
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0]).toEqual({
      l: 0.6,
      c: Math.round(share * maxChroma(0.6, 180, "srgb") * 1e4) / 1e4,
      h: 180,
    });
  });

  const pointer = (container, control) =>
    container.querySelector(`.react-colorful__${control}-pointer`).style;

  it("Places the pointers", () => {
    const edge = maxChroma(0.75, 145, "srgb");
    const { container } = render(
      <OklchaColorPicker color={{ l: 0.75, c: edge / 2, h: 90, a: 0.3 }} />
    );
    // The hue moved to 90 only after the render: the pointer is at the color's own hue
    const square = pointer(container, "saturation");
    expect(parseFloat(square.top)).toBeCloseTo(25, 5);
    expect(parseFloat(square.left)).toBeCloseTo((50 * edge) / maxChroma(0.75, 90, "srgb"), 3);
    expect(parseFloat(pointer(container, "hue").left)).toBeCloseTo(25, 5);
    expect(parseFloat(pointer(container, "alpha").left)).toBeCloseTo(30, 5);
  });

  it("Moves the pointer, keeps the chroma and the focus when the gamut changes", () => {
    const color = { l: 0.6, c: 0.15, h: 145 };
    const { container, rerender } = render(<OklchColorPicker color={color} />);
    square(container).focus();

    rerender(<OklchColorPicker color={color} gamut="p3" />);

    expect(parseFloat(pointer(container, "saturation").left)).toBeCloseTo(
      (100 * 0.15) / maxChroma(0.6, 145, "p3"),
      3
    );
    expect(document.activeElement).toBe(square(container));
  });

  it("Keeps dragging and calls `onChangeEnd` when the gamut changes mid-drag", () => {
    const handleChange = jest.fn();
    const handleChangeEnd = jest.fn();
    const color = "oklch(0.6 0.1 145)";
    const props = { color, onChange: handleChange, onChangeEnd: handleChangeEnd };
    const { container, rerender } = render(<OklchStringColorPicker {...props} />);

    fireEvent(square(container), new FakeMouseEvent("mousedown", { pageX: 30, pageY: 30 }));
    rerender(<OklchStringColorPicker {...props} gamut="p3" />);
    fireEvent(square(container), new FakeMouseEvent("mousemove", { pageX: 90, pageY: 30 }));
    fireEvent(square(container), new FakeMouseEvent("mouseup", { pageX: 90, pageY: 30 }));

    // The move after the switch still goes through, with the P3 edge
    const last = parseOklcha(handleChange.mock.calls[handleChange.mock.calls.length - 1][0]);
    expect(last.c).toBeCloseTo(0.85 * maxChroma(last.l, 145, "p3"), 3);
    expect(handleChangeEnd).toHaveBeenCalledTimes(1);
  });

  it("Calls `onChangeEnd` when the gamut changes right before the release", () => {
    const handleChangeEnd = jest.fn();
    const props = { color: "oklch(0.6 0.1 145)", onChangeEnd: handleChangeEnd };
    const { container, rerender } = render(<OklchStringColorPicker {...props} />);

    fireEvent(square(container), new FakeMouseEvent("mousedown", { pageX: 30, pageY: 30 }));
    rerender(<OklchStringColorPicker {...props} gamut="p3" />);
    fireEvent(square(container), new FakeMouseEvent("mouseup", { pageX: 30, pageY: 30 }));

    expect(handleChangeEnd).toHaveBeenCalledTimes(1);
  });

  it("Changes hue and alpha with arrow keys", () => {
    const handleChange = jest.fn((color) => color);
    const { container } = render(
      <OklchaStringColorPicker color="oklch(0.6 0 145 / 1)" onChange={handleChange} />
    );
    const control = (name) =>
      container.querySelector(`.react-colorful__${name} .react-colorful__interactive`);

    control("hue").focus();
    fireEvent.keyDown(document.activeElement, { keyCode: 39 });
    expect(handleChange).toHaveLastReturnedWith("oklch(0.6 0 163 / 1)");

    control("alpha").focus();
    fireEvent.keyDown(document.activeElement, { keyCode: 37 });
    expect(handleChange).toHaveLastReturnedWith("oklch(0.6 0 163 / 0.95)");
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
